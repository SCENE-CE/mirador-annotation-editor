import flatten from 'lodash/flatten';

/** */
export function mapChildren(layerThing) {
  if (layerThing.children) {
    return flatten(layerThing.children.map((child) => mapChildren(child)));
  }
  return layerThing;
}

/** Pretty print a seconds count into HH:mm:ss */
export function secondsToHMS(secs) {
  const [h, m, s] = secondsToHMSarray(secs);
  // eslint-disable-next-line require-jsdoc
  const pad = (n) => (n < 10 ? `0${n}` : n);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Split a second to [hours, minutes, seconds]  */
export function secondsToHMSarray(secs) {
  const h = Math.floor(secs / 3600);
  return [h, Math.floor(secs / 60) - h * 60, secs % 60];
}
