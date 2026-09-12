import { MAX_EDGE, WARN_FILE_BYTES, WORK_EDGE } from '../constants';
import { validateImageFile } from './acceptedTypes';

function readAsObjectUrl(file) {
  return URL.createObjectURL(file);
}

function decodeImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image. It may be corrupt or unsupported.'));
    img.src = url;
  });
}

function downscale(img, maxEdge) {
  const edge = Math.max(img.naturalWidth, img.naturalHeight);
  if (edge <= maxEdge) {
    return { canvas: null, width: img.naturalWidth, height: img.naturalHeight, scaled: false };
  }
  const scale = maxEdge / edge;
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, width, height, scaled: true };
}

function canvasToUrl(canvas, type) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not prepare a working copy of this image.'));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, type || 'image/png');
  });
}

export async function loadImageFile(file) {
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);

  const originalUrl = readAsObjectUrl(file);
  let decoded;
  try {
    decoded = await decodeImage(originalUrl);
  } catch (err) {
    URL.revokeObjectURL(originalUrl);
    throw err;
  }

  const natural = { width: decoded.naturalWidth, height: decoded.naturalHeight };
  if (!natural.width || !natural.height) {
    URL.revokeObjectURL(originalUrl);
    throw new Error('Invalid image: missing dimensions.');
  }

  const cap = downscale(decoded, Math.min(MAX_EDGE, WORK_EDGE));
  const source = cap.canvas || decoded;
  let workingUrl = originalUrl;
  const urls = [originalUrl];
  if (cap.scaled) {
    workingUrl = await canvasToUrl(cap.canvas, file.type.startsWith('image/jpeg') ? 'image/jpeg' : 'image/png');
    urls.push(workingUrl);
  }

  return {
    file,
    fileName: file.name || 'image',
    fileSize: file.size,
    type: file.type,
    originalUrl,
    workingUrl,
    source,
    width: cap.width,
    height: cap.height,
    naturalWidth: natural.width,
    naturalHeight: natural.height,
    scaled: cap.scaled,
    warnLarge: file.size >= WARN_FILE_BYTES,
    urls,
  };
}
