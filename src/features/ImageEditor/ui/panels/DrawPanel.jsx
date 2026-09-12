import { TOOLS } from '../../constants';
import { useCanvasEditor } from '../../hooks/editorContext';
import ColorField from '../ColorField';
import SliderField from '../SliderField';

const BRUSHES = [
  [TOOLS.pencil, 'Pencil'],
  [TOOLS.brush, 'Brush'],
  [TOOLS.marker, 'Marker'],
  [TOOLS.highlighter, 'Highlighter'],
  [TOOLS.eraser, 'Eraser'],
  [TOOLS.line, 'Line'],
  [TOOLS.arrow, 'Arrow'],
];

export default function DrawPanel() {
  const { tool, setTool, styles } = useCanvasEditor();
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Drawing</h3>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {BRUSHES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`btn text-[11px] py-1.5 ${tool === id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTool(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <ColorField id="draw-color" label="Color" value={styles.style.color} onChange={(v) => styles.setStyle((s) => ({ ...s, color: v }))} />
      <SliderField id="draw-size" label="Size" min={1} max={64} value={styles.style.strokeWidth} onChange={(v) => styles.setStyle((s) => ({ ...s, strokeWidth: v }))} />
      <SliderField id="draw-op" label="Opacity" min={5} max={100} value={Math.round(styles.style.opacity * 100)} onChange={(v) => styles.setStyle((s) => ({ ...s, opacity: v / 100 }))} />
      <p className="text-[11px] text-text-tertiary mb-0">Drawn strokes stay selectable after you finish.</p>
    </div>
  );
}
