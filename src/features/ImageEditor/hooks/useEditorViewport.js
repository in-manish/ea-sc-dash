import { useCallback, useEffect, useRef } from 'react';
import { MAX_ZOOM, MIN_ZOOM, TOOLS } from '../constants';
import { pinchDistance } from '../domain/memory';
import { shouldPanViewport } from '../domain/shouldPan';
import {
  centerView, fitToScreen, panBy, pointerOnCanvas, setZoomAt, zoomTo100,
} from '../domain/viewportMath';

export function useEditorViewport(canvas, tool, hostRef, setZoom) {
  const panRef = useRef(false);
  const lastRef = useRef(null);
  const pinchRef = useRef(0);

  const fit = useCallback(() => setZoom(fitToScreen(canvas)), [canvas, setZoom]);
  const actual = useCallback(() => setZoom(zoomTo100(canvas)), [canvas, setZoom]);
  const center = useCallback(() => centerView(canvas), [canvas]);
  const zoomBy = useCallback((delta) => {
    if (!canvas) return;
    const next = canvas.getZoom() * (delta > 0 ? 1.15 : 0.87);
    setZoom(setZoomAt(canvas, next, canvas.getWidth() / 2, canvas.getHeight() / 2));
  }, [canvas, setZoom]);

  useEffect(() => {
    if (!canvas) return undefined;
    const onDown = (opt) => {
      if (!shouldPanViewport(tool, opt)) return;
      panRef.current = true;
      canvas.selection = false;
      canvas._currentTransform = null;
      canvas.discardActiveObject();
      lastRef.current = { x: opt.e.clientX, y: opt.e.clientY };
      canvas.setCursor('grabbing');
      canvas.requestRenderAll();
    };
    const onMove = (opt) => {
      if (!panRef.current || !lastRef.current) return;
      const dx = opt.e.clientX - lastRef.current.x;
      const dy = opt.e.clientY - lastRef.current.y;
      lastRef.current = { x: opt.e.clientX, y: opt.e.clientY };
      panBy(canvas, dx, dy);
    };
    const onUp = () => {
      if (!panRef.current) return;
      panRef.current = false;
      lastRef.current = null;
      canvas.selection = tool === TOOLS.select;
      canvas.setCursor(tool === TOOLS.pan || tool === TOOLS.select ? 'grab' : 'default');
    };
    canvas.on('mouse:down', onDown);
    canvas.on('mouse:move', onMove);
    canvas.on('mouse:up', onUp);
    window.addEventListener('pointerup', onUp);
    return () => {
      canvas.off('mouse:down', onDown);
      canvas.off('mouse:move', onMove);
      canvas.off('mouse:up', onUp);
      window.removeEventListener('pointerup', onUp);
    };
  }, [canvas, tool]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !canvas) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const point = pointerOnCanvas(canvas, event);
      const next = canvas.getZoom() * 0.999 ** event.deltaY;
      setZoom(setZoomAt(canvas, Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)), point.x, point.y));
    };
    const onTouch = (event) => {
      if (event.touches.length !== 2) {
        pinchRef.current = 0;
        return;
      }
      event.preventDefault();
      const dist = pinchDistance(event.touches);
      if (!pinchRef.current) {
        pinchRef.current = dist;
        return;
      }
      const ratio = dist / pinchRef.current;
      pinchRef.current = dist;
      const rect = host.getBoundingClientRect();
      setZoom(setZoomAt(canvas, canvas.getZoom() * ratio, event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top));
    };
    host.addEventListener('wheel', onWheel, { passive: false });
    host.addEventListener('touchmove', onTouch, { passive: false });
    return () => {
      host.removeEventListener('wheel', onWheel);
      host.removeEventListener('touchmove', onTouch);
    };
  }, [canvas, hostRef, setZoom]);

  return { fit, actual, center, zoomBy };
}
