import { FabricImage } from 'fabric';
import { findArtboard, findMainImage, sceneBox } from './objectMeta';
import { resizeArtboard } from './artboard';
import { configureMainImage } from './placeImage';

export function cropRectFromGuide(main, guide) {
  const mainBox = sceneBox(main);
  const guideBox = sceneBox(guide);
  const scaleX = main.width / Math.max(main.getScaledWidth(), 1);
  const scaleY = main.height / Math.max(main.getScaledHeight(), 1);
  const left = Math.max(0, (guideBox.left - mainBox.left) * scaleX);
  const top = Math.max(0, (guideBox.top - mainBox.top) * scaleY);
  const width = Math.min(main.width - left, guideBox.width * scaleX);
  const height = Math.min(main.height - top, guideBox.height * scaleY);
  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}

export async function applyCropToMain(canvas, guide) {
  const main = findMainImage(canvas);
  if (!main || !guide) return null;
  const crop = cropRectFromGuide(main, guide);
  const source = main.toCanvasElement();
  const out = document.createElement('canvas');
  out.width = crop.width;
  out.height = crop.height;
  const ctx = out.getContext('2d');
  ctx.drawImage(source, crop.left, crop.top, crop.width, crop.height, 0, 0, crop.width, crop.height);
  const blob = await new Promise((resolve) => out.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Crop failed.');
  const url = URL.createObjectURL(blob);
  const next = await FabricImage.fromURL(url);
  next.set({
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top',
    width: crop.width,
    height: crop.height,
    scaleX: 1,
    scaleY: 1,
  });
  configureMainImage(next);
  next.layerType = 'image';
  next.layerName = main.layerName || 'Background image';
  next.layerId = main.layerId;
  canvas.remove(main);
  canvas.add(next);
  canvas.sendObjectToBack(next);
  const board = findArtboard(canvas);
  if (board) canvas.sendObjectToBack(board);
  resizeArtboard(canvas, crop.width, crop.height);
  canvas.remove(guide);
  canvas.requestRenderAll();
  return { url, width: crop.width, height: crop.height };
}
