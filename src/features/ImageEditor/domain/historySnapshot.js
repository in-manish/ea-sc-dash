import { CUSTOM_PROPS } from '../constants';

export function snapshotCanvas(canvas) {
  return canvas.toObject(CUSTOM_PROPS);
}

export function historyFingerprint(snapshot) {
  try {
    return JSON.stringify(snapshot);
  } catch {
    return String(Date.now());
  }
}
