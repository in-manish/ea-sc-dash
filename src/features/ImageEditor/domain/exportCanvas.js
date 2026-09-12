import { encodeAvifFromPngBlob } from './encodeAvif';
import { EXPORT_FORMATS } from './exportFormats';
import { findArtboard, findMainImage, sceneBox } from './objectMeta';

function exportBox(canvas) {
  const board = findArtboard(canvas);
  if (board) return sceneBox(board);
  const main = findMainImage(canvas);
  if (main) return sceneBox(main);
  return { left: 0, top: 0, width: canvas.getWidth(), height: canvas.getHeight() };
}

export async function exportEditedImage(canvas, options) {
  const format = EXPORT_FORMATS.find((item) => item.id === options.formatId) || EXPORT_FORMATS[0];
  const box = exportBox(canvas);
  const scale = Number(options.scale) || 1;
  const outW = Math.max(1, Math.round((Number(options.width) || box.width) * scale));
  const multiplier = outW / Math.max(box.width, 1);
  const hide = [];
  canvas.getObjects().forEach((obj) => {
    if (obj.isCropGuide || obj.isGuide) {
      obj.visible = false;
      hide.push(obj);
    }
  });
  canvas.discardActiveObject();
  const vpt = canvas.viewportTransform.slice();
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.requestRenderAll();
  try {
    const quality = Number(options.quality) || 90;
    const raw = await canvas.toBlob({
      format: format.id === 'jpeg' ? 'jpeg' : format.id === 'avif' ? 'png' : format.id,
      quality: format.hasQuality && format.id !== 'avif' ? quality / 100 : 1,
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      multiplier,
      enableRetinaScaling: false,
    });
    if (!raw) throw new Error('Export failed in this browser.');
    const blob = format.id === 'avif' ? await encodeAvifFromPngBlob(raw, quality) : raw;
    const base = (options.filename || 'edited-image').replace(/\.[a-z0-9]+$/i, '');
    return {
      blob,
      filename: `${base}.${format.ext}`,
      mime: blob.type || format.mime,
      width: outW,
      height: Math.round(box.height * multiplier),
    };
  } finally {
    hide.forEach((obj) => { obj.visible = true; });
    canvas.setViewportTransform(vpt);
    canvas.requestRenderAll();
  }
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
