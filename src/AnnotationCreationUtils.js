import { exportStageSVG } from 'react-konva-to-svg';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import WebAnnotation from './WebAnnotation';

//const fileUploaderUrl = 'https://scene-uploads.tetras-libre.fr/upload';
const fileUploaderUrl = 'http://localhost:3000/upload';
const fileReaderUrl = 'http://localhost:3000/static/';

/** Extract time information from annotation target */
export function timeFromAnnoTarget(annotarget) {
  console.info('TODO proper time extraction from: ', annotarget);
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}

/** Extract xywh from annotation target */
export function geomFromAnnoTarget(annotarget) {
  console.info('TODO proper xywh extraction from: ', annotarget);
  const r = /xywh=((-?[0-9]+,?)+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return '';
  }
  return r[1];
}

export const OVERLAY_TOOL = {
  CURSOR: 'cursor',
  DELETE: 'delete',
  EDIT: 'edit',
  IMAGE: 'image',
  SHAPE: 'shapes',
  TEXT: 'text',
};

export const SHAPES_TOOL = {
  ARROW: 'arrow',
  ELLIPSE: 'ellipse',
  FREEHAND: 'freehand',
  POLYGON: 'polygon',
  RECTANGLE: 'rectangle',
  SHAPES: 'shapes',
};

export function isShapesTool(activeTool) {
  // Find if active tool in the list of overlay tools. I want a boolean in return
  return Object.values(SHAPES_TOOL).find((tool) => tool === activeTool);
}

/**
 * Get SVG picture containing all the stuff draw in the stage (Konva Stage).
 * This image will be put in overlay of the iiif media
 */
export async function getSvg(windowId) {
  const stage = window.Konva.stages.find((s) => s.attrs.id === windowId);
  const svg = await exportStageSVG(stage, false); // TODO clean
  console.log('SVG:', svg);
  return svg;
}

export async function getJPG(windowId) {
  const stage = window.Konva.stages.find((s) => s.attrs.id === windowId);
  const jpg = await stage.toImage({ mimeType: 'image/jpeg', quality: 1 });
  console.log('JPG:', jpg);
  return jpg;
}

export async function saveAnnotation(canvases, config, receiveAnnotation, annotation, body, t, xywh, image, drawingStateSerialized, drawingImageExport, tags) {
  console.log('Send file :', drawingImageExport);
  const filename = await sendFile(drawingImageExport);

  canvases.forEach(async (canvas) => {
    const storageAdapter = config.annotation.adapter(canvas.id);
    const anno = {
      body: {
        id: fileReaderUrl + filename,
        type: 'Image',
        format: 'image/svg+xml',
        value: body.value,
      },
      drawingState: drawingStateSerialized,
      id: (annotation && annotation.id) || `${uuid()}`,
      motivation: 'painting',
      target: `${canvas.id}#xywh=0,0,640,360&t=0,1000',`,
      type: 'Annotation',
    };

    if (annotation) {
      storageAdapter.update(anno)
        .then((annoPage) => {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        });
    } else {
      storageAdapter.create(anno)
        .then((annoPage) => {
          receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
        });
    }
  });
}

const sendFile = async (fileContent) => {
  const blob = new Blob([fileContent], { type: 'image/svg+xml'});

  const formData = new FormData();
  formData.append('file', blob);


  try {
    const response = await axios.post(fileUploaderUrl, formData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File Uploaded', response.data);
    return response.data.file.filename;
  } catch (error) {
    return '';
    console.error('Error uploading file:', error);
  }
};
