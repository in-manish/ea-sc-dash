import { useCallback } from 'react';
import { toColorParts } from '../domain/colors';

export function useEyedropper(canvas, setStyle, setTool, setStatus, setError) {
  const pick = useCallback(async () => {
    try {
      if (window.EyeDropper) {
        const result = await new window.EyeDropper().open();
        setStyle((prev) => ({ ...prev, color: result.sRGBHex }));
        setStatus(`Picked ${result.sRGBHex}`);
        setTool('select');
        return toColorParts(result.sRGBHex);
      }
      if (!canvas) throw new Error('Eyedropper API is not available in this browser.');
      setStatus('Click the canvas to sample a color.');
      const once = (opt) => {
        const ctx = canvas.lowerCanvasEl.getContext('2d', { willReadFrequently: true });
        const pixel = ctx.getImageData(opt.e.offsetX, opt.e.offsetY, 1, 1).data;
        const hex = `#${[pixel[0], pixel[1], pixel[2]].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
        setStyle((prev) => ({ ...prev, color: hex }));
        setStatus(`Picked ${hex}`);
        setTool('select');
        canvas.off('mouse:down', once);
      };
      canvas.on('mouse:down', once);
      return null;
    } catch (err) {
      if (err?.name === 'AbortError') return null;
      setError(err.message || 'Could not pick a color.');
      return null;
    }
  }, [canvas, setError, setStatus, setStyle, setTool]);

  return { pick };
}
