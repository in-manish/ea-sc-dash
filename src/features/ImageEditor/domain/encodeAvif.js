const AVIF_MIME = 'image/avif';

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Could not encode image.'));
      else resolve(blob);
    }, mime, quality);
  });
}

async function rasterFromBlob(blob) {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();
  return { canvas, imageData: ctx.getImageData(0, 0, canvas.width, canvas.height) };
}

async function encodeWithLibavif(imageData, qualityPct) {
  const encode = (await import('@jsquash/avif/encode')).default;
  const buffer = await encode(imageData, {
    quality: qualityPct,
    qualityAlpha: qualityPct,
    speed: 8,
  });
  if (!buffer) throw new Error('AVIF encoding failed.');
  return new Blob([buffer], { type: AVIF_MIME });
}

export function canEncodeAvif() {
  return typeof WebAssembly !== 'undefined';
}

export async function encodeAvifFromPngBlob(pngBlob, qualityPct) {
  const quality = Math.round(Math.min(100, Math.max(10, Number(qualityPct) || 90)));
  const { canvas, imageData } = await rasterFromBlob(pngBlob);
  try {
    const native = await canvasToBlob(canvas, AVIF_MIME, quality / 100);
    if (native.type === AVIF_MIME) return native;
  } catch {
    /* Chrome/Brave decode AVIF but canvas.toBlob still falls back to PNG. */
  }
  return encodeWithLibavif(imageData, quality);
}
