import { extForMime, swapFilenameExt } from './imageOutput';

const MIN_Q = 0.12;
const MAX_Q = 0.95;

export function qualityFromCompression(pct) {
  const p = Math.min(100, Math.max(0, Number(pct) || 0));
  return Math.round((MAX_Q - (p / 100) * (MAX_Q - MIN_Q)) * 100) / 100;
}

export function parseTargetBytes(targetKb) {
  const n = Number(targetKb);
  if (!n || n < 1) return null;
  return Math.round(n * 1024);
}

function scaleCanvas(source, scale) {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

export function blobFromCanvas(canvas, mime, quality) {
  const q = mime === 'image/png' ? undefined : quality;
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob && mime === 'image/webp') {
        canvas.toBlob((fallback) => resolve(fallback), 'image/jpeg', quality);
        return;
      }
      resolve(blob);
    }, mime, q);
  });
}

async function fitTarget(canvas, mime, quality, targetBytes) {
  let blob = await blobFromCanvas(canvas, mime, quality);
  if (!blob || !targetBytes || blob.size <= targetBytes) {
    return { blob, canvas };
  }

  let lo = MIN_Q;
  let hi = quality;
  for (let i = 0; i < 8; i += 1) {
    const mid = (lo + hi) / 2;
    const next = await blobFromCanvas(canvas, mime, mid);
    if (!next) break;
    if (next.size <= targetBytes) {
      blob = next;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  let out = canvas;
  let scale = 1;
  while (blob && blob.size > targetBytes && scale > 0.45) {
    scale *= 0.85;
    out = scaleCanvas(canvas, scale);
    blob = await blobFromCanvas(out, mime, MIN_Q);
  }
  return { blob, canvas: out };
}

export async function encodeCanvas(canvas, { mime, quality, targetBytes, filename }) {
  const { blob, canvas: out } = await fitTarget(canvas, mime, quality, targetBytes);
  if (!blob) return null;
  const type = blob.type || mime;
  const name = swapFilenameExt(filename || 'image', type);
  return {
    file: new File([blob], name, { type }),
    width: out.width,
    height: out.height,
    bytes: blob.size,
    ext: extForMime(type),
  };
}
