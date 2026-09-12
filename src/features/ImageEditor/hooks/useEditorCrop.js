import { useCallback } from 'react';
import { TOOLS } from '../constants';
import { applyCropToMain } from '../domain/applyCrop';
import { CROP_ASPECTS } from '../domain/cropAspects';
import { makeCropGuide, resizeCropGuide } from '../domain/cropGuide';

export function useEditorCrop({
  canvas, history, session, setTool, setStatus, setError, setRightTab, setMobilePanel, viewport,
}) {
  const enter = useCallback((aspectId = 'free') => {
    if (!canvas) return;
    canvas.getObjects().filter((obj) => obj.isCropGuide).forEach((obj) => canvas.remove(obj));
    const def = CROP_ASPECTS.find((item) => item.id === aspectId);
    const ratio = def?.value === 'original'
      ? (session.meta.width / Math.max(session.meta.height, 1))
      : def?.value;
    if (!makeCropGuide(canvas, ratio)) {
      setError('Load an image before cropping.');
      return;
    }
    setTool(TOOLS.crop);
    setRightTab?.('crop');
    setMobilePanel?.('crop');
    setStatus('Drag the box, then Apply crop.');
  }, [canvas, session.meta.height, session.meta.width, setError, setMobilePanel, setRightTab, setStatus, setTool]);

  const apply = useCallback(async () => {
    if (!canvas) return;
    const guide = canvas.getObjects().find((obj) => obj.isCropGuide);
    if (!guide) {
      enter('free');
      setStatus('Adjust the crop box, then Apply crop.');
      return;
    }
    try {
      const result = await applyCropToMain(canvas, guide);
      if (result) {
        session.trackUrls([result.url]);
        session.setMeta((prev) => ({ ...prev, width: result.width, height: result.height }));
      }
      setTool(TOOLS.select);
      setMobilePanel?.(null);
      history.save();
      viewport?.fit();
      setStatus('Crop applied.');
    } catch (err) {
      setError(err.message || 'Crop failed.');
    }
  }, [canvas, enter, history, session, setError, setMobilePanel, setStatus, setTool, viewport]);

  const cancel = useCallback(() => {
    if (!canvas) return;
    canvas.getObjects().filter((obj) => obj.isCropGuide).forEach((obj) => canvas.remove(obj));
    canvas.requestRenderAll();
    setTool(TOOLS.select);
    setMobilePanel?.(null);
  }, [canvas, setMobilePanel, setTool]);

  const resizeGuide = useCallback((width, height) => {
    if (!canvas) return;
    if (!canvas.getObjects().some((obj) => obj.isCropGuide)) enter('free');
    resizeCropGuide(canvas, width, height);
  }, [canvas, enter]);

  return { enter, apply, cancel, resizeGuide };
}
