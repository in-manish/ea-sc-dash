import { useCallback } from 'react';
import { findArtboard } from '../domain/objectMeta';

export function useEditorLayers(canvas, history, refresh) {
  const rename = useCallback((obj, name) => {
    if (!obj) return;
    obj.layerName = name;
    refresh?.();
    history.save();
  }, [history, refresh]);

  const toggleVisible = useCallback((obj) => {
    if (!obj || obj.isArtboard) return;
    obj.visible = !obj.visible;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    refresh?.();
    history.save();
  }, [canvas, history, refresh]);

  const toggleLock = useCallback((obj) => {
    if (!obj || obj.isArtboard || obj.isMainImage) return;
    obj.locked = !obj.locked;
    obj.selectable = !obj.locked;
    obj.evented = !obj.locked;
    canvas.requestRenderAll();
    refresh?.();
    history.save();
  }, [canvas, history, refresh]);

  const duplicate = useCallback(async (obj) => {
    if (!canvas || !obj || obj.isArtboard || obj.isMainImage) return;
    const cloned = await obj.clone();
    cloned.set({ left: (obj.left || 0) + 16, top: (obj.top || 0) + 16 });
    cloned.layerId = `${obj.layerType || 'layer'}-${Date.now()}`;
    cloned.layerName = `${obj.layerName || 'Layer'} copy`;
    canvas.add(cloned);
    canvas.setActiveObject(cloned);
    canvas.requestRenderAll();
    history.save();
    refresh?.();
  }, [canvas, history, refresh]);

  const remove = useCallback((obj) => {
    if (!canvas || !obj || obj.isArtboard || obj.isMainImage) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    history.save();
    refresh?.();
  }, [canvas, history, refresh]);

  const order = useCallback((obj, dir) => {
    if (!canvas || !obj) return;
    if (dir === 'front') canvas.bringObjectToFront(obj);
    if (dir === 'back') {
      canvas.sendObjectToBack(obj);
      const board = findArtboard(canvas);
      if (board) canvas.sendObjectToBack(board);
    }
    if (dir === 'forward') canvas.bringObjectForward(obj);
    if (dir === 'backward') canvas.sendObjectBackwards(obj);
    canvas.requestRenderAll();
    history.save();
    refresh?.();
  }, [canvas, history, refresh]);

  return { rename, toggleVisible, toggleLock, duplicate, remove, order };
}
