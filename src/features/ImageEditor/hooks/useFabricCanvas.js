import { useEffect, useState } from 'react';
import { Canvas, PencilBrush } from 'fabric';
import { syncCanvasSize } from '../domain/placeImage';
import { fitToScreen } from '../domain/viewportMath';

export function useFabricCanvas(hostRef, onZoom) {
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const el = document.createElement('canvas');
    host.innerHTML = '';
    host.appendChild(el);
    const instance = new Canvas(el, {
      preserveObjectStacking: true,
      selection: true,
      backgroundColor: 'rgba(0,0,0,0)',
      renderOnAddRemove: true,
      stopContextMenu: true,
      fireRightClick: true,
      imageSmoothingEnabled: true,
      enableRetinaScaling: true,
      allowTouchScrolling: false,
    });
    instance.freeDrawingBrush = new PencilBrush(instance);
    instance.freeDrawingBrush.width = 4;
    instance.freeDrawingBrush.color = '#0f172a';
    instance.defaultCursor = 'grab';

    const resize = () => {
      const result = syncCanvasSize(instance, host);
      if (result.shouldFit) onZoom?.(fitToScreen(instance));
      else instance.requestRenderAll();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    queueMicrotask(() => setCanvas(instance));

    return () => {
      ro.disconnect();
      instance.dispose();
      queueMicrotask(() => setCanvas(null));
    };
  }, [hostRef, onZoom]);

  return canvas;
}
