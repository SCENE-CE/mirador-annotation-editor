import { v4 as uuidv4 } from 'uuid';

/** Extract time information from annotation target */
export function timeFromAnnoTarget(annotarget) {
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}

/** Extract xywh from annotation target */
export function geomFromAnnoTarget(annotarget) {
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

/** Check if the active tool is a shape tool */
export function isShapesTool(activeTool) {
  // Find if active tool in the list of overlay tools. I want a boolean in return
  return Object.values(SHAPES_TOOL).find((tool) => tool === activeTool);
}

/** Save annotation in the storage adapter */
export async function saveAnnotationInStorageAdapter(
  canvasId,
  storageAdapter,
  receiveAnnotation,
  annotation,
) {
  console.log('Annotation to save', annotation);
  if (annotation.id) {
    storageAdapter.update(annotation)
      .then((annoPage) => {
        receiveAnnotation(canvasId, storageAdapter.annotationPageId, annoPage);
      });
  } else {
    annotation.id = uuidv4();
    storageAdapter.create(annotation)
      .then((annoPage) => {
        receiveAnnotation(canvasId, storageAdapter.annotationPageId, annoPage);
      });
  }
}

/** Save annotation for each canvas */
export async function saveAnnotationInEachCanvas(
  canvases,
  config,
  receiveAnnotation,
  annotation,
  target,
  isNewAnnotation,
) {
  canvases.forEach(async (canvas) => {
    // Adapt target to the canvas
    // eslint-disable-next-line no-param-reassign
    annotation.target = `${canvas.id}#xywh=${target.xywh}&t=${target.t}`;
    const storageAdapter = config.annotation.adapter(canvas.id);
    saveAnnotationInStorageAdapter(canvas, storageAdapter, receiveAnnotation, annotation, isNewAnnotation);
  });
}

export const defaultToolState = {
  activeTool: OVERLAY_TOOL.EDIT,
  closedMode: 'closed',
  fillColor: 'rgba(83,162, 235, 0.5)',
  image: { id: null },
  imageEvent: null,
  strokeColor: 'rgba(20,82,168,1)',
  strokeWidth: 2,
};
