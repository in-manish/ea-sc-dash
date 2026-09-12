import { Circle, filters, FabricImage, Rect } from 'fabric';
import { findMainImage, stampObjectMeta, sceneBox } from './objectMeta';

function regionOnImage(main, box) {
  const mainBox = sceneBox(main);
  const scaleX = main.width / Math.max(main.getScaledWidth(), 1);
  const scaleY = main.height / Math.max(main.getScaledHeight(), 1);
  return {
    x: Math.max(0, (box.left - mainBox.left) * scaleX),
    y: Math.max(0, (box.top - mainBox.top) * scaleY),
    w: Math.max(2, box.width * scaleX),
    h: Math.max(2, box.height * scaleY),
  };
}

export async function stampLocalizedEffect(canvas, box, kind, color = '#000000') {
  const main = findMainImage(canvas);
  if (!main) return null;
  if (kind === 'black' || kind === 'color') {
    const rect = new Rect({
      left: box.left,
      top: box.top,
      width: Math.max(2, box.width),
      height: Math.max(2, box.height),
      fill: kind === 'black' ? '#000000' : color,
      strokeWidth: 0,
    });
    stampObjectMeta(rect, 'redaction', kind === 'black' ? 'Redaction' : 'Color redaction');
    canvas.add(rect);
    canvas.requestRenderAll();
    return rect;
  }

  const region = regionOnImage(main, box);
  const source = main.toCanvasElement();
  const slice = document.createElement('canvas');
  slice.width = Math.round(region.w);
  slice.height = Math.round(region.h);
  const ctx = slice.getContext('2d');
  ctx.drawImage(source, region.x, region.y, region.w, region.h, 0, 0, slice.width, slice.height);
  const stamp = await FabricImage.fromURL(slice.toDataURL('image/png'));
  if (kind === 'blur') {
    stamp.filters = [new filters.Blur({ blur: 0.35 })];
  } else {
    stamp.filters = [new filters.Pixelate({ blocksize: kind === 'mosaic' ? 18 : 10 })];
  }
  stamp.applyFilters();
  stamp.set({ left: box.left, top: box.top, originX: 'left', originY: 'top' });
  const scaleX = box.width / stamp.width;
  const scaleY = box.height / stamp.height;
  stamp.set({ scaleX, scaleY });
  stampObjectMeta(stamp, 'redaction', kind === 'blur' ? 'Blur' : kind === 'mosaic' ? 'Mosaic' : 'Pixelate');
  canvas.add(stamp);
  canvas.requestRenderAll();
  return stamp;
}

export function applyClipMask(obj, kind) {
  if (!obj) return;
  const w = obj.width || 100;
  const h = obj.height || 100;
  const rx = w / 2;
  const ry = h / 2;
  if (kind === 'none') {
    obj.clipPath = undefined;
    obj.dirty = true;
    return;
  }
  if (kind === 'circle') {
    obj.clipPath = new Circle({ radius: Math.min(rx, ry), originX: 'center', originY: 'center' });
  } else if (kind === 'roundRect') {
    obj.clipPath = new Rect({
      width: w,
      height: h,
      rx: Math.min(w, h) * 0.16,
      ry: Math.min(w, h) * 0.16,
      originX: 'center',
      originY: 'center',
    });
  } else {
    obj.clipPath = new Rect({ width: w, height: h, originX: 'center', originY: 'center' });
  }
  obj.dirty = true;
}
