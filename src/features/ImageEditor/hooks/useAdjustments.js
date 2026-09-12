import { useCallback, useEffect } from 'react';
import { applyMainImageFilters } from '../domain/buildFilters';
import { DEFAULT_ADJUSTMENTS } from '../domain/adjustments';
import { findMainImage } from '../domain/objectMeta';

export function useAdjustments(canvas, values, history) {
  const { adjustments, setAdjustments, presetId, setPresetId, intensity, setIntensity } = values;

  const apply = useCallback(() => {
    if (!canvas) return;
    const main = findMainImage(canvas);
    if (!main) return;
    applyMainImageFilters(main, adjustments, presetId, intensity);
    canvas.requestRenderAll();
  }, [adjustments, canvas, intensity, presetId]);

  useEffect(() => {
    const id = window.setTimeout(apply, 40);
    return () => window.clearTimeout(id);
  }, [apply]);

  const setField = useCallback((key, value) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  }, [setAdjustments]);

  const resetField = useCallback((key) => {
    setAdjustments((prev) => ({ ...prev, [key]: DEFAULT_ADJUSTMENTS[key] }));
  }, [setAdjustments]);

  const resetAll = useCallback(() => {
    setAdjustments({ ...DEFAULT_ADJUSTMENTS });
    setPresetId('original');
    setIntensity(100);
    history.save();
  }, [history, setAdjustments, setIntensity, setPresetId]);

  const choosePreset = useCallback((id) => {
    setPresetId(id);
    history.save();
  }, [history, setPresetId]);

  return { apply, setField, resetField, resetAll, choosePreset };
}
