export function outputSize(naturalW, naturalH, maxDim = 1920) {
  const longest = Math.max(naturalW, naturalH);
  if (!longest || longest <= maxDim) {
    return { width: Math.round(naturalW), height: Math.round(naturalH) };
  }
  const scale = maxDim / longest;
  return {
    width: Math.round(naturalW * scale),
    height: Math.round(naturalH * scale),
  };
}

export function resolveExportMime({ sourceType, optimize, lossy }) {
  if (optimize || lossy) return 'image/webp';
  if (sourceType === 'image/png' || sourceType === 'image/webp') return sourceType;
  return 'image/jpeg';
}

export function extForMime(mime) {
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/png') return 'png';
  return 'jpg';
}

export function qualityForMime(mime) {
  if (mime === 'image/webp') return 0.82;
  if (mime === 'image/jpeg') return 0.92;
  return undefined;
}

export function swapFilenameExt(filename, mime) {
  const base = (filename || 'image').replace(/\.[^/.]+$/, '');
  return `${base}.${extForMime(mime)}`;
}

export function canvasToFile(canvas, { mime, filename, quality }) {
  const q = quality ?? qualityForMime(mime);
  return new Promise((resolve) => {
    const encode = (type, nextQ) => {
      canvas.toBlob((blob) => {
        if (!blob && type === 'image/webp') {
          encode('image/jpeg', 0.92);
          return;
        }
        if (!blob) {
          resolve(null);
          return;
        }
        const name = swapFilenameExt(filename, blob.type);
        resolve(new File([blob], name, { type: blob.type }));
      }, type, type === 'image/png' ? undefined : nextQ);
    };
    encode(mime, q);
  });
}
