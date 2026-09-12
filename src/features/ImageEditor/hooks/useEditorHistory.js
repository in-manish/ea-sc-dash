import { useCallback, useEffect, useRef, useState } from 'react';
import { HISTORY_LIMIT } from '../constants';
import { historyFingerprint, snapshotCanvas } from '../domain/historySnapshot';

export function useEditorHistory(canvas) {
  const stackRef = useRef([]);
  const indexRef = useRef(-1);
  const restoringRef = useRef(false);
  const lastPrintRef = useRef('');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = useCallback(() => {
    setCanUndo(indexRef.current > 0);
    setCanRedo(indexRef.current < stackRef.current.length - 1);
  }, []);

  const save = useCallback(() => {
    if (!canvas || restoringRef.current) return;
    const snap = snapshotCanvas(canvas);
    const print = historyFingerprint(snap);
    if (print === lastPrintRef.current) return;
    lastPrintRef.current = print;
    const next = stackRef.current.slice(0, indexRef.current + 1);
    next.push(snap);
    if (next.length > HISTORY_LIMIT) next.shift();
    stackRef.current = next;
    indexRef.current = next.length - 1;
    syncFlags();
  }, [canvas, syncFlags]);

  const restore = useCallback(async (index) => {
    if (!canvas || index < 0 || index >= stackRef.current.length) return;
    restoringRef.current = true;
    try {
      await canvas.loadFromJSON(stackRef.current[index]);
      canvas.requestRenderAll();
      indexRef.current = index;
      lastPrintRef.current = historyFingerprint(stackRef.current[index]);
      syncFlags();
    } finally {
      restoringRef.current = false;
    }
  }, [canvas, syncFlags]);

  const undo = useCallback(() => restore(indexRef.current - 1), [restore]);
  const redo = useCallback(() => restore(indexRef.current + 1), [restore]);
  const reset = useCallback(() => {
    stackRef.current = [];
    indexRef.current = -1;
    lastPrintRef.current = '';
    save();
  }, [save]);

  useEffect(() => {
    if (!canvas) return undefined;
    const onModified = () => save();
    canvas.on('object:modified', onModified);
    canvas.on('path:created', onModified);
    return () => {
      canvas.off('object:modified', onModified);
      canvas.off('path:created', onModified);
    };
  }, [canvas, save]);

  return { save, undo, redo, reset, canUndo, canRedo, restoringRef };
}
