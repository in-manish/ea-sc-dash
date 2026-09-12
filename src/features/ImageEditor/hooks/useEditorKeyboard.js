import { useCallback, useEffect } from 'react';
import { NUDGE, NUDGE_FAST, TOOLS } from '../constants';
import { findMainImage, isTypingTarget } from '../domain/objectMeta';

export function useEditorKeyboard({
  canvas, history, viewport, exporter, layers, setTool, tool, crop,
}) {
  const duplicate = useCallback(async () => {
    const obj = canvas?.getActiveObject();
    if (obj) await layers.duplicate(obj);
  }, [canvas, layers]);

  useEffect(() => {
    const onKey = async (event) => {
      if (isTypingTarget(event.target)) return;
      const obj = canvas?.getActiveObject();
      if (obj?.isEditing) return;
      const meta = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (meta && key === 'z') {
        event.preventDefault();
        if (event.shiftKey) history.redo();
        else history.undo();
        return;
      }
      if (meta && key === 's') {
        event.preventDefault();
        exporter.setOpen(true);
        return;
      }
      if (meta && key === 'c' && obj && !obj.isArtboard) {
        event.preventDefault();
        window.__ieClipboard = await obj.clone();
        return;
      }
      if (meta && key === 'v' && window.__ieClipboard && canvas) {
        event.preventDefault();
        const cloned = await window.__ieClipboard.clone();
        cloned.set({ left: (cloned.left || 0) + 18, top: (cloned.top || 0) + 18 });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        history.save();
        return;
      }
      if (meta && key === 'd') {
        event.preventDefault();
        await duplicate();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        if (tool === TOOLS.crop) crop?.cancel();
        else {
          setTool(TOOLS.select);
          canvas?.discardActiveObject();
          canvas?.requestRenderAll();
        }
        return;
      }
      if ((event.key === 'Enter' || event.key === 'NumpadEnter') && tool === TOOLS.crop) {
        event.preventDefault();
        crop?.apply();
        return;
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && obj && !obj.isArtboard && !obj.isMainImage) {
        event.preventDefault();
        layers.remove(obj);
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key) && obj) {
        event.preventDefault();
        const step = event.shiftKey ? NUDGE_FAST : NUDGE;
        const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
        const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
        obj.set({ left: obj.left + dx, top: obj.top + dy });
        obj.setCoords();
        canvas.requestRenderAll();
        return;
      }
      if (event.key === '+' || event.key === '=') { event.preventDefault(); viewport.zoomBy(1); }
      if (event.key === '-' || event.key === '_') { event.preventDefault(); viewport.zoomBy(-1); }
      if (event.key === '0' && !meta) { event.preventDefault(); viewport.fit(); }
      if (event.key === '1' && !meta) { event.preventDefault(); viewport.actual(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canvas, crop, duplicate, exporter, history, layers, setTool, tool, viewport]);
}

export function transformMain(canvas, history, action) {
  const main = findMainImage(canvas);
  if (!main) return;
  if (action === 'rotateLeft') main.rotate((main.angle || 0) - 90);
  if (action === 'rotateRight') main.rotate((main.angle || 0) + 90);
  if (action === 'flipX') main.set('flipX', !main.flipX);
  if (action === 'flipY') main.set('flipY', !main.flipY);
  main.setCoords();
  canvas.requestRenderAll();
  history.save();
}

export function resizeMain(canvas, history, session, width, height) {
  const main = findMainImage(canvas);
  if (!main) return;
  main.scaleX = width / main.width;
  main.scaleY = height / main.height;
  main.setCoords();
  session.setMeta((prev) => ({ ...prev, width, height }));
  canvas.requestRenderAll();
  history.save();
}
