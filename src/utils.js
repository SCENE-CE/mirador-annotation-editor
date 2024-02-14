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
  /**
   * Pads a number with a leading zero if it is less than 10.
   * @param {number} n - The number to pad.
   * @returns {string} The padded number as a string.
   */
  const pad = (n) => (n < 10 ? `0${n}` : n);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
/**
 * Checks if a given string is a valid URL.
 * @returns {boolean} - Returns true if the string is a valid URL, otherwise false.
 */
export const isValidUrl = (string) => {
  if (string === '') {
    return true;
  }
  try {
    // eslint-disable-next-line no-new
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
/**
 * Removes HTML tags from a given HTML string.
 *
 * @param {string} htmlString - The HTML string from which to remove tags.
 * @returns {string} The text content of the HTML string without any HTML tags.
 */
export const removeHTMLTags = (htmlString) => {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};
