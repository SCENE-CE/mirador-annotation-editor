import { exportStageSVG } from 'react-konva-to-svg';
import { rgbaToObj } from '../AnnotationFormOverlayToolOptions';

/**
 * Get the Konva stage associated with the windowId
 * @param windowId
 * @returns {Stage}
 */
export function getKonvaStage(windowId) {
  return window.Konva.stages.find((s) => s.attrs.id === windowId);
}

/**
 * Resize the Konva stage and redraw it
 * @param windowId
 * @param width
 * @param height
 * @param scale
 */
export function resizeKonvaStage(windowId, width, height, scale) {
  const stage = getKonvaStage(windowId);
  stage.width(width);
  stage.height(height);
  stage.scale({ x: scale, y: scale });
  // stage.draw();
}

/**
 * Get SVG picture containing all the stuff draw in the stage (Konva Stage).
 * This image will be put in overlay of the iiif media
 */
export async function getSvg(windowId) {
  const stage = getKonvaStage(windowId);
  stage.find('Transformer').forEach((node) => node.destroy());

  stage.find('Rect').map((node) => {
    const {
      r, g, b, a,
    } = rgbaToObj(node.stroke());
    node.strokeScaleEnabled(true);
    node.stroke(`rgb(${r},${g},${b}`);
  });

  let svg = await exportStageSVG(stage, false); // TODO clean
  svg = svg.replaceAll('"', "'");
  return svg;
}

/** Export the stage as a JPG image in a data url */
export async function getKonvaAsDataURL(windowId) {
  const stage = getKonvaStage(windowId);
  const dataURL = stage.toDataURL({
    mimeType: 'image/png',
    quality: 1,
  });
  return dataURL;
}

export const defaultLineWeightChoices = [0, 2, 5, 10, 20, 50];

export const KONVA_MODE = {
  DRAW: 'draw',
  IMAGE: 'image',
  TARGET: 'target',
};

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
