import { useCallback, useEffect, useState } from 'react';
import { visibleEditorObjects } from '../domain/objectMeta';

export function useEditorSelection(canvas) {
  const [selected, setSelected] = useState(null);

  const refresh = useCallback(() => {
    setSelected(canvas?.getActiveObject() || null);
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return undefined;
    canvas.on('selection:created', refresh);
    canvas.on('selection:updated', refresh);
    canvas.on('selection:cleared', refresh);
    canvas.on('object:modified', refresh);
    return () => {
      canvas.off('selection:created', refresh);
      canvas.off('selection:updated', refresh);
      canvas.off('selection:cleared', refresh);
      canvas.off('object:modified', refresh);
    };
  }, [canvas, refresh]);

  const layers = canvas ? visibleEditorObjects(canvas).slice().reverse() : [];

  const selectLayer = useCallback((obj) => {
    if (!canvas || !obj || obj.locked) return;
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
    refresh();
  }, [canvas, refresh]);

  return { selected, setSelected, refresh, layers, selectLayer };
}
