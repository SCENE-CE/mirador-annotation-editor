import { exportStageSVG } from 'react-konva-to-svg';

/**
 * Get SVG picture containing all the stuff draw in the stage (Konva Stage).
 * This image will be put in overlay of the iiif media
 */
export async function getSvg(windowId) {
  const stage = window.Konva.stages.find((s) => s.attrs.id === windowId);
  let svg = await exportStageSVG(stage, false); // TODO clean
  svg = svg.replaceAll('"', "'");
  return svg;
}

/** Export the stage as a JPG image in a data url */
export async function getKonvaAsDataURL(windowId) {
  const stage = window.Konva.stages.find((s) => s.attrs.id === windowId);
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
