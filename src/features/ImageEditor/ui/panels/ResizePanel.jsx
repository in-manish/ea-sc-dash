import { useState } from 'react';
import { useCanvasEditor } from '../../hooks/editorContext';
import { resizeMain } from '../../hooks/useEditorKeyboard';

export default function ResizePanel() {
  const { canvas, history, session } = useCanvasEditor();
  const [lock, setLock] = useState(true);
  const [width, setWidth] = useState(session.meta.width || 0);
  const [height, setHeight] = useState(session.meta.height || 0);
  const ratio = (session.meta.width || 1) / Math.max(session.meta.height || 1, 1);

  const onWidth = (value) => {
    setWidth(value);
    if (lock) setHeight(Math.max(1, Math.round(value / ratio)));
  };
  const onHeight = (value) => {
    setHeight(value);
    if (lock) setWidth(Math.max(1, Math.round(value * ratio)));
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Resize</h3>
      <label className="flex items-center gap-2 text-xs text-text-secondary mb-3">
        <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
        Lock aspect ratio
      </label>
      <label className="text-[11px] text-text-secondary block mb-2">
        Width
        <input className="input-field py-1 text-xs mt-1" type="number" min={1} value={width} onChange={(e) => onWidth(Number(e.target.value))} />
      </label>
      <label className="text-[11px] text-text-secondary block mb-3">
        Height
        <input className="input-field py-1 text-xs mt-1" type="number" min={1} value={height} onChange={(e) => onHeight(Number(e.target.value))} />
      </label>
      <button
        type="button"
        className="btn btn-primary text-xs w-full"
        onClick={() => resizeMain(canvas, history, session, Math.max(1, width), Math.max(1, height))}
      >
        Apply exact size
      </button>
    </div>
  );
}
