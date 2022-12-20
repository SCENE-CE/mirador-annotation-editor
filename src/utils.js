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
  return `${Math.floor(secs / 3600)}:${Math.floor(secs / 60)}:${secs % 60}`;
}

/** Split a second to [hours, minutes, seconds]  */
export function secondsToHMSarray(secs) {
  return [Math.floor(secs / 3600), Math.floor(secs / 60), secs % 60];
}
