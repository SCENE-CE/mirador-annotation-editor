import axios from 'axios';

export const fileUploaderUrl = 'https://scene-uploads.tetras-libre.fr/upload';
export const fileReaderUrl = 'https://scene-uploads.tetras-libre.fr/static/';
/*const fileUploaderUrl = 'http://localhost:3000/upload';
const fileReaderUrl = 'http://localhost:3000/static/';*/

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

/** Save annotation in the storage adapter */
export async function saveAnnotation(canvas, storageAdapter, receiveAnnotation, annotationToSaved, isNewAnnotation) {
  if (isNewAnnotation) {
    storageAdapter.update(annotationToSaved)
      .then((annoPage) => {
        receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
      });
  } else {
    storageAdapter.create(annotationToSaved)
      .then((annoPage) => {
        receiveAnnotation(canvas.id, storageAdapter.annotationPageId, annoPage);
      });
  }
}

export async function saveAnnotationInEachCanvas(canvases, config, receiveAnnotation, annotationToSaved, target, isNewAnnotation) {
  canvases.forEach(async (canvas) => {
    // Adapt target to the canvas
    // eslint-disable-next-line no-param-reassign
    annotationToSaved.target = `${canvas.id}#xywh=${target.xywh}&t=${target.t}`;
    const storageAdapter = config.annotation.adapter(canvas.id);
    saveAnnotation(canvas, storageAdapter, receiveAnnotation, annotationToSaved, isNewAnnotation);
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


function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}
