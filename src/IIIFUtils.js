import {
  getKonvaAsDataURL,
  getSvg,
} from './annotationForm/AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
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
  windowId,
) => {
  const annotationStateForSaving = annotationState;

  if (annotationState.maeData.templateType === TEMPLATE.IIIF_TYPE) {
    return annotationState;
  }

  // TODO I dont know why this code is here? To clean the object ?
  annotationStateForSaving.maeData.target = {
    drawingState: annotationStateForSaving.maeData.target.drawingState,
    fullCanvaXYWH: annotationStateForSaving.maeData.target.fullCanvaXYWH,
    scale: annotationStateForSaving.maeData.target.scale,
    tend: annotationStateForSaving.maeData.target.tend,
    tstart: annotationStateForSaving.maeData.target.tstart,
  };

  if (annotationStateForSaving.maeData.templateType == TEMPLATE.TAGGING_TYPE
    || annotationStateForSaving.maeData.templateType == TEMPLATE.TEXT_TYPE) {
    // Complex annotation
    if (annotationStateForSaving.maeData.target.drawingState.shapes.length > 0) {
      // eslint-disable-next-line no-param-reassign
      annotationStateForSaving.maeData.target.svg = await getSvg(windowId);
    }
  }

  if (annotationStateForSaving.maeData.templateType == TEMPLATE.KONVA_TYPE) {
    annotationStateForSaving.body.id = await getKonvaAsDataURL(windowId);
    annotationStateForSaving.body.format = 'image/jpg';
    annotationStateForSaving.type = 'Annotation';
  }

  if (annotationStateForSaving.maeData.templateType == TEMPLATE.IMAGE_TYPE) {
    if (annotationStateForSaving.maeData.target.drawingState.shapes.length == 1) {
      annotationStateForSaving.body.id = annotationStateForSaving.maeData.target.drawingState.shapes[0].url;
      annotationStateForSaving.type = 'Annotation';
    }
  }

  // eslint-disable-next-line no-param-reassign
  annotationStateForSaving.maeData.target.scale = playerReferences.getMediaTrueHeight()
    / playerReferences.getDisplayedMediaHeight() * playerReferences.getZoom();

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
export const maeTargetToIiifTarget = (maeTarget, canvasId) => {
  if (maeTarget.templateType === TEMPLATE.IIIF_TYPE) {
    // CHeck that one
    return maeTarget;
  }

  if (maeTarget.templateType !== TEMPLATE.KONVA_TYPE && maeTarget.drawingState.shapes.length > 1) {
    console.info('Implement target as SVG/Fragment with shapes');
    const fragmentTarget = `${maeTarget.tend ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`}`;
    return {
      selector: [
        {
          type: 'SvgSelector',
          value: maeTarget.svg,
        },
        {
          type: 'FragmentSelector',
          value: `${canvasId}#${fragmentTarget}`,
        },
      ],
      source: canvasId,
    };
  }

  if (maeTarget.drawingState.shapes.length == 0) {
    console.info('Implement target as string on fullSizeCanvas');
    return `${canvasId}#` + `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}`;
  }

  if (maeTarget.drawingState.shapes.length === 1 && maeTarget.drawingState.shapes[0].type === 'rectangle' || maeTarget.drawingState.shapes[0].type == 'image') {
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

  return `${canvasId}#${maeTarget.tend ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`}`;
};
