import { Point } from 'fabric';
import { MAX_ZOOM, MIN_ZOOM } from '../constants';
import { findArtboard } from './objectMeta';

export function artboardSize(canvas) {
  const board = findArtboard(canvas);
  if (!board) return { width: canvas.getWidth(), height: canvas.getHeight() };
  return { width: board.getScaledWidth(), height: board.getScaledHeight() };
}

export function pointerOnCanvas(canvas, event) {
  if (typeof canvas.getViewportPoint === 'function') {
    return canvas.getViewportPoint(event);
  }
  const el = canvas.upperCanvasEl || canvas.wrapperEl;
  const rect = el.getBoundingClientRect();
  return new Point(event.clientX - rect.left, event.clientY - rect.top);
}

export function setZoomAt(canvas, zoom, x, y) {
  const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
  canvas.zoomToPoint(new Point(x, y), next);
  return next;
}

export function panBy(canvas, dx, dy) {
  if (typeof canvas.relativePan === 'function') {
    canvas.relativePan(new Point(dx, dy));
    return;
  }
  const vpt = canvas.viewportTransform;
  vpt[4] += dx;
  vpt[5] += dy;
  canvas.setViewportTransform(vpt);
  canvas.requestRenderAll();
}

export function fitToScreen(canvas) {
  if (!canvas) return 1;
  const { width, height } = artboardSize(canvas);
  const cw = canvas.getWidth();
  const ch = canvas.getHeight();
  if (cw < 32 || ch < 32 || !width || !height) return canvas.getZoom() || 1;
  const pad = 48;
  const usableW = Math.max(cw - pad, 32);
  const usableH = Math.max(ch - pad, 32);
  const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min(usableW / width, usableH / height)));
  canvas.setZoom(next);
  const vpt = canvas.viewportTransform;
  vpt[4] = (cw - width * next) / 2;
  vpt[5] = (ch - height * next) / 2;
  canvas.setViewportTransform(vpt);
  canvas.requestRenderAll();
  return next;
}

export function zoomTo100(canvas) {
  if (!canvas) return 1;
  const { width, height } = artboardSize(canvas);
  canvas.setZoom(1);
  const vpt = canvas.viewportTransform;
  vpt[4] = (canvas.getWidth() - width) / 2;
  vpt[5] = (canvas.getHeight() - height) / 2;
  canvas.setViewportTransform(vpt);
  canvas.requestRenderAll();
  return 1;
}

export function centerView(canvas) {
  if (!canvas) return;
  const { width, height } = artboardSize(canvas);
  const zoom = canvas.getZoom();
  const vpt = canvas.viewportTransform;
  vpt[4] = (canvas.getWidth() - width * zoom) / 2;
  vpt[5] = (canvas.getHeight() - height * zoom) / 2;
  canvas.setViewportTransform(vpt);
  canvas.requestRenderAll();
}
