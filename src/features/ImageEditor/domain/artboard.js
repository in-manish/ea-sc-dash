import { Gradient, Rect } from 'fabric';
import { findArtboard } from './objectMeta';

export function makeArtboard(width, height, fill = 'transparent') {
  const board = new Rect({
    left: 0,
    top: 0,
    width,
    height,
    fill,
    selectable: false,
    evented: false,
    hoverCursor: 'default',
    objectCaching: false,
    strokeWidth: 0,
  });
  board.isArtboard = true;
  board.layerType = 'artboard';
  board.layerName = 'Background';
  board.layerId = 'artboard';
  return board;
}

export function resizeArtboard(canvas, width, height) {
  const board = findArtboard(canvas);
  if (!board) return;
  board.set({ width, height, scaleX: 1, scaleY: 1 });
  board.setCoords();
}

export function setArtboardFill(canvas, fill) {
  const board = findArtboard(canvas);
  if (!board) return;
  board.set('fill', fill);
  canvas.requestRenderAll();
}

export function makeLinearGradient(stops, angleDeg, width, height) {
  const rad = ((angleDeg || 0) * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;
  const dx = Math.cos(rad) * cx;
  const dy = Math.sin(rad) * cy;
  return new Gradient({
    type: 'linear',
    gradientUnits: 'pixels',
    coords: { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy },
    colorStops: stops,
  });
}

export function makeRadialGradient(stops, width, height) {
  const r = Math.max(width, height) / 2;
  return new Gradient({
    type: 'radial',
    gradientUnits: 'pixels',
    coords: { x1: width / 2, y1: height / 2, r1: 0, x2: width / 2, y2: height / 2, r2: r },
    colorStops: stops,
  });
}
