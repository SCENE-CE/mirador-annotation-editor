import {
  getKonvaAsDataURL,
  getSvg,
} from './annotationForm/AnnotationFormOverlay/KonvaDrawing/KonvaUtils';
import { playerReferences } from './playerReferences';
import { TEMPLATE } from './annotationForm/AnnotationFormUtils';

/**
 * Check if annotation is exportable to image in case of Konva annotation
 * @param maeData
 * @returns {boolean}
 */
function isAnnotationExportableToImage(maeData) {
  if (maeData.templateType === TEMPLATE.KONVA_TYPE) {
    if (maeData.target.drawingState.shapes.length > 1) {
      return true;
    }
    if (maeData.target.drawingState.shapes.length === 1 && maeData.target.drawingState.shapes[0].type !== 'rectangle') {
      return true;
    }
  }
  return false;
}

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

  if (isAnnotationExportableToImage(annotationStateForSaving.maeData)) {
    annotationStateForSaving.body.id = await getKonvaAsDataURL(windowId);
    annotationStateForSaving.body.format = 'image/jpg';
    annotationStateForSaving.type = 'Annotation';
  }

  if (annotationStateForSaving.maeData.templateType == TEMPLATE.IMAGE_TYPE) {
    if (annotationStateForSaving.maeData.target.drawingState.shapes.length == 1) {
      // eslint-disable-next-line max-len
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
  // In case of IIIF target, the user know what he is doing
  if (maeTarget.templateType === TEMPLATE.IIIF_TYPE) {
    return maeTarget;
  }

  if (maeTarget.templateType !== TEMPLATE.KONVA_TYPE) {
    // In some case the target can be simplify in a string
    if (maeTarget.drawingState.shapes.length === 1 && (maeTarget.drawingState.shapes[0].type === 'rectangle' || maeTarget.drawingState.shapes[0].type == 'image')) {
      let {
        // eslint-disable-next-line prefer-const
        x, y, width, height,
      } = maeTarget.drawingState.shapes[0];
      console.info('Implement target as string with one shape (reactangle or image)');
      // Image have not tstart and tend
      return `${canvasId}#${maeTarget.tend ? `xywh=${x},${y},${width},${height}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${x},${y},${width},${height}`}`;
    }
    // On the other case, the target is a SVG
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

  // In case of Konva target and for all the other case, target is a string and on full size canvas
  console.info('Implement target as string on fullSizeCanvas');
  return `${canvasId}#${maeTarget.tend ? `xywh=${maeTarget.fullCanvaXYWH}&t=${maeTarget.tstart},${maeTarget.tend}` : `xywh=${maeTarget.fullCanvaXYWH}`}`;
};
