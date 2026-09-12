import { Circle, Rect } from 'fabric';
import { findMainImage, sceneBox } from './objectMeta';

function styleCropGuide(guide) {
  guide.isCropGuide = true;
  guide.layerName = 'Crop';
  guide.lockRotation = true;
  guide.setControlsVisibility?.({ mtr: false });
  return guide;
}

export function makeCropGuide(canvas, aspect) {
  const main = findMainImage(canvas);
  if (!main) return null;
  const box = sceneBox(main);
  let { width, height, left, top } = box;
  if (aspect && aspect !== 'original') {
    const current = width / height;
    if (current > aspect) {
      width = height * aspect;
      left = box.left + (box.width - width) / 2;
    } else {
      height = width / aspect;
      top = box.top + (box.height - height) / 2;
    }
  }
  const guide = new Rect({
    left,
    top,
    width,
    height,
    fill: 'rgba(109, 40, 217, 0.12)',
    stroke: '#6d28d9',
    strokeWidth: 2,
    strokeDashArray: [8, 4],
    cornerColor: '#6d28d9',
    cornerStrokeColor: '#ffffff',
    cornerStyle: 'rect',
    cornerSize: 12,
    transparentCorners: false,
    objectCaching: false,
    hasRotatingPoint: false,
  });
  styleCropGuide(guide);
  canvas.add(guide);
  canvas.setActiveObject(guide);
  canvas.requestRenderAll();
  return guide;
}

export function resizeCropGuide(canvas, width, height) {
  const guide = canvas.getObjects().find((obj) => obj.isCropGuide);
  const main = findMainImage(canvas);
  if (!guide || !main) return null;
  const box = sceneBox(main);
  const w = Math.max(1, Math.min(Number(width) || box.width, box.width));
  const h = Math.max(1, Math.min(Number(height) || box.height, box.height));
  guide.set({
    width: w,
    height: h,
    scaleX: 1,
    scaleY: 1,
    left: box.left + (box.width - w) / 2,
    top: box.top + (box.height - h) / 2,
  });
  guide.setCoords();
  canvas.setActiveObject(guide);
  canvas.requestRenderAll();
  return guide;
}

export function makeCircleMaskPreview() {
  return new Circle({ radius: 80, originX: 'center', originY: 'center' });
}
