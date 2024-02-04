import {exportStageSVG} from "react-konva-to-svg";
import WebAnnotation from "./WebAnnotation";
import {v4 as uuid} from "uuid";

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
  return Object.values(SHAPES_TOOL).find((tool) => tool === activeTool) ;
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
};

export function saveAnnotation(canvases, config, receiveAnnotation, annotation, body, t, xywh, image, drawingStateSerialized, svg, tags){
  // TODO promises not handled. Use promiseAll ?
  canvases.forEach(async (canvas) => {
    const storageAdapter = config.annotation.adapter(canvas.id);
    const anno = new WebAnnotation({
      body,
      canvasId: canvas.id,
      fragsel: {
        t,
        xywh,
      },
      id: (annotation && annotation.id) || `${uuid()}`,
      image,
      drawingStateSerialized,
      manifestId: canvas.options.resource.id,
      svg,
      tags,
    }).toJson();

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
