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
  const { hours, minutes, seconds } = secondsToHMSarray(secs);
  // eslint-disable-next-line require-jsdoc
  const pad = (n) => (n < 10 ? `0${n}` : n);
  const result = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return result;
}

/** Split a second to { hours, minutes, seconds }  */
export function secondsToHMSarray(secs) {
  const h = Math.floor(secs / 3600);
  return {
    hours: h,
    minutes: Math.floor(secs / 60) - h * 60,
    seconds: secs % 60,
  };
}

export const isValidUrl = (string) => {
  if (string === '') {
    return true;
  }
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
