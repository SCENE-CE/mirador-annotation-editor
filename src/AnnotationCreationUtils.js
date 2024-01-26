/** Extract time information from annotation target */
export function timeFromAnnoTarget(annotarget) {
  console.info('TODO proper time extraction from: ', annotarget);
  // TODO w3c media fragments: t=,10 t=5,
  const r = /t=([0-9.]+),([0-9.]+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return [0, 0];
  }
  return [Number(r[1]), Number(r[2])];
}

/** Extract xywh from annotation target */
export function geomFromAnnoTarget(annotarget) {
  console.info('TODO proper xywh extraction from: ', annotarget);
  const r = /xywh=((-?[0-9]+,?)+)/.exec(annotarget);
  if (!r || r.length !== 3) {
    return '';
  }
  return r[1];
}
