import { getSvg } from './annotationForm/AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import { playerReferences } from './playerReferences';
import { TEMPLATE } from './annotationForm/AnnotationFormUtils';

/**
 * Convert annotation state to be saved. Function change the annotationState object
 * @param annotationState
 * @param canvas
 * @param windowId
 * @returns {Promise<void>}
 */
export const convertAnnotationStateToBeSaved = async (
  annotationState,
  canvas,
  windowId
) => {
  const annotationStateForSaving = annotationState;
  // Adapt target to the canvas
  // eslint-disable-next-line no-param-reassign
  console.log('annotationState.maeData.target', annotationState.maeData.target);
  // eslint-disable-next-line no-param-reassign

  // TODO I dont know why this code is here? To clean the object ?
  annotationStateForSaving.maeData.target = {
    drawingState: annotationStateForSaving.maeData.target.drawingState,
    fullCanvaXYWH: annotationStateForSaving.maeData.target.fullCanvaXYWH,
    scale: annotationStateForSaving.maeData.target.scale,
    tend: annotationStateForSaving.maeData.target.tend,
    tstart: annotationStateForSaving.maeData.target.tstart,
  };

  if (annotationStateForSaving.maeData.templateType == TEMPLATE.TAGGING_TYPE || annotationStateForSaving.maeData.templateType == TEMPLATE.TEXT_TYPE) {
    // Complex annotation
    if (annotationStateForSaving.maeData.target.drawingState.shapes.length > 0) {
      // eslint-disable-next-line no-param-reassign
      annotationStateForSaving.maeData.target.svg = await getSvg(windowId);
    }
  }

  // eslint-disable-next-line no-param-reassign
  annotationStateForSaving.maeData.target.scale = playerReferences.getHeight()
    / playerReferences.getDisplayedImageHeight() * playerReferences.getZoom();

  // eslint-disable-next-line no-param-reassign
  annotationStateForSaving.target = maeTargetToIiifTarget(
    annotationStateForSaving.maeData.target,
    canvas.id,
  );
  // eslint-disable-next-line no-param-reassign
  annotationStateForSaving.maeData.target.drawingState = JSON.stringify(
    annotationStateForSaving.maeData.target.drawingState,
  );

  return annotationStateForSaving;
};

/** Transform maetarget to IIIF compatible data * */
export const maeTargetToIiifTarget = (maeTarget, canvasId, windowId) => {
  if (maeTarget.drawingState) {
    if (maeTarget.drawingState.shapes.length == 0) {
      console.info('Implement target as string on fullSizeCanvas');
      return `${canvasId}#` + `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}`;
    }
    if (maeTarget.drawingState.shapes.length === 1 && maeTarget.drawingState.shapes[0].type === 'rectangle') {
      let {
        // eslint-disable-next-line prefer-const
        x, y, width, height, scaleX, scaleY,
      } = maeTarget.drawingState.shapes[0];
      x = Math.floor(x * maeTarget.scale * scaleX);
      y = Math.floor(y * maeTarget.scale * scaleY);
      width = Math.floor(width * maeTarget.scale * scaleX);
      height = Math.floor(height * maeTarget.scale * scaleY);
      console.info('Implement target as string with one shape (reactangle or image)');
      // Image have not tstart and tend
      return `${canvasId}#${maeTarget.tend ? `xywh=${x},${y},${width},${height}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${x},${y},${width},${height}`}`;
    }
    if (maeTarget.drawingState.shapes.length === 1 && maeTarget.drawingState.shapes[0].type === 'image') {
      let {
        x, y, width, height,
      } = maeTarget.drawingState.shapes[0];
      x = Math.floor(x * maeTarget.scale);
      y = Math.floor(y * maeTarget.scale);
      width = Math.floor(width * maeTarget.scale);
      height = Math.floor(height * maeTarget.scale);
      return `${canvasId}#${maeTarget.tend ? `xywh=${x},${y},${width},${height}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${x},${y},${width},${height}`}`;
    }

    return {
      selector: [
        {
          type: 'SvgSelector',
          value: maeTarget.svg,
        },
        {
          type: 'FragmentSelector',
          value: `${canvasId}#${maeTarget.tend ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`}`,
        },
      ],
      source: canvasId,
    };
  }
  return `${canvasId}#${maeTarget.tend ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`}`;
};

/** ################### SAVE LOGIC UTILS ######################## * */

/** Extract xywh from annotation target */
export function geomFromAnnoTarget(annotarget) {
  const r = /xywh=((-?[0-9]+,?)+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return '';
  }
  return r[1];
}

/** Extract time information from annotation target */
export function timeFromAnnoTarget(annotarget) {
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}
