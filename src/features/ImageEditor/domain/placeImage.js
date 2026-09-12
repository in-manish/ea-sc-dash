import { FabricImage } from 'fabric';
import { makeArtboard } from './artboard';
import { stampObjectMeta } from './objectMeta';

function sourceSize(source) {
  return {
    width: source.naturalWidth || source.width || 1,
    height: source.naturalHeight || source.height || 1,
  };
}

export function createFabricImage(source) {
  const { width, height } = sourceSize(source);
  const img = new FabricImage(source, {
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top',
    objectCaching: true,
    hoverCursor: 'move',
  });
  img.set({ width, height, scaleX: 1, scaleY: 1 });
  return img;
}

export function configureMainImage(img) {
  img.isMainImage = true;
  img.selectable = false;
  img.evented = false;
  img.lockMovementX = true;
  img.lockMovementY = true;
  img.hoverCursor = 'grab';
  return img;
}

export function placeMainImage(canvas, source) {
  const { width, height } = sourceSize(source);
  const img = configureMainImage(createFabricImage(source));
  stampObjectMeta(img, 'image', 'Background image');
  canvas.clear();
  canvas.backgroundColor = 'rgba(0,0,0,0)';
  canvas.add(makeArtboard(width, height));
  canvas.add(img);
  img.setCoords();
  canvas.requestRenderAll();
  return img;
}

export function placeOverlayImage(canvas, source) {
  const img = createFabricImage(source);
  stampObjectMeta(img, 'image', 'Image');
  const board = canvas.getObjects().find((obj) => obj.isArtboard);
  img.set({
    left: (board?.width || img.width) / 2,
    top: (board?.height || img.height) / 2,
    originX: 'center',
    originY: 'center',
    scaleX: 0.35,
    scaleY: 0.35,
  });
  canvas.add(img);
  canvas.setActiveObject(img);
  img.setCoords();
  canvas.requestRenderAll();
  return img;
}

function isPlaceholderSize(width, height) {
  return width < 64 || height < 64 || (width <= 300 && height <= 150);
}

export function syncCanvasSize(canvas, host) {
  if (!canvas || !host) return { ok: false, shouldFit: false };
  const width = Math.max(1, Math.floor(host.clientWidth));
  const height = Math.max(1, Math.floor(host.clientHeight));
  if (width < 32 || height < 32) return { ok: false, shouldFit: false };
  const prevW = canvas.getWidth();
  const prevH = canvas.getHeight();
  if (prevW === width && prevH === height) {
    canvas.calcOffset();
    return { ok: true, shouldFit: false };
  }
  const leavingPlaceholder = isPlaceholderSize(prevW, prevH);
  const vpt = canvas.viewportTransform.slice();
  canvas.setDimensions({ width, height });
  if (!leavingPlaceholder) canvas.setViewportTransform(vpt);
  canvas.calcOffset();
  return { ok: true, shouldFit: leavingPlaceholder };
}
