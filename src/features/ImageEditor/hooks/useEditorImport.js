import { useCallback, useEffect, useState } from 'react';
import { placeMainImage, placeOverlayImage, syncCanvasSize } from '../domain/placeImage';
import { loadImageFile } from '../domain/loadImageFile';
import { fitToScreen } from '../domain/viewportMath';

export function useEditorImport({ canvas, hostRef, session, history, setError, setStatus, setZoom }) {
  const [dragOver, setDragOver] = useState(false);

  const showLoaded = useCallback((loaded) => {
    if (!canvas) return;
    syncCanvasSize(canvas, hostRef?.current);
    placeMainImage(canvas, loaded.source);
    const zoom = fitToScreen(canvas);
    setZoom?.(zoom);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncCanvasSize(canvas, hostRef?.current);
        setZoom?.(fitToScreen(canvas));
      });
    });
  }, [canvas, hostRef, setZoom]);

  const loadFile = useCallback(async (file, asOverlay = false) => {
    if (!canvas || !file) return;
    setError('');
    try {
      const loaded = await loadImageFile(file);
      if (!session.meta.hasImage || !asOverlay) {
        session.applyLoaded(loaded);
        showLoaded(loaded);
        history.reset();
        setStatus(loaded.warnLarge ? 'Large image loaded. Editing uses a fitted working copy.' : 'Image loaded.');
      } else {
        session.trackUrls(loaded.urls);
        placeOverlayImage(canvas, loaded.source);
        history.save();
        setStatus('Image added as a layer.');
      }
    } catch (err) {
      setError(err.message || 'Could not load image.');
    }
  }, [canvas, history, session, setError, setStatus, showLoaded]);

  const onDrop = useCallback(async (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) await loadFile(file, session.meta.hasImage);
  }, [loadFile, session.meta.hasImage]);

  useEffect(() => {
    const onPaste = async (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            event.preventDefault();
            await loadFile(file, session.meta.hasImage);
          }
          break;
        }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [loadFile, session.meta.hasImage]);

  return { loadFile, onDrop, dragOver, setDragOver };
}
