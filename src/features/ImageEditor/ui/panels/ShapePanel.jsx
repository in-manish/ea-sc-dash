import { TOOLS } from '../../constants';
import { useCanvasEditor } from '../../hooks/editorContext';
import ColorField from '../ColorField';
import SliderField from '../SliderField';

const SHAPES = [
  ['rect', 'Rectangle'],
  ['roundRect', 'Rounded rect'],
  ['circle', 'Circle'],
  ['ellipse', 'Ellipse'],
  ['triangle', 'Triangle'],
  ['polygon', 'Polygon'],
  ['star', 'Star'],
  ['line', 'Line'],
  ['arrow', 'Arrow'],
];

export default function ShapePanel() {
  const { setTool, styles, selection, canvas } = useCanvasEditor();
  const obj = selection.selected;
  const set = (key, value) => {
    if (!obj || obj.isArtboard) return;
    obj.set(key, value);
    canvas.requestRenderAll();
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Shapes</h3>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {SHAPES.map(([id, label]) => (
          <button key={id} type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => setTool(TOOLS[id] || id)}>
            {label}
          </button>
        ))}
      </div>
      <ColorField id="shape-fill" label="Fill" value={styles.style.fill} onChange={(v) => styles.setStyle((s) => ({ ...s, fill: v }))} />
      <ColorField id="shape-stroke" label="Stroke" value={styles.style.color} onChange={(v) => styles.setStyle((s) => ({ ...s, color: v }))} />
      <SliderField id="shape-sw" label="Stroke width" min={0} max={40} value={styles.style.strokeWidth} onChange={(v) => styles.setStyle((s) => ({ ...s, strokeWidth: v }))} />
      <SliderField id="shape-op" label="Opacity" min={0} max={100} value={Math.round(styles.style.opacity * 100)} onChange={(v) => styles.setStyle((s) => ({ ...s, opacity: v / 100 }))} />
      {obj && !obj.isArtboard ? (
        <>
          <p className="text-[11px] font-medium text-text-secondary mt-3 mb-2">Selected object</p>
          <ColorField id="sel-fill" label="Fill" value={typeof obj.fill === 'string' ? obj.fill : '#ffffff'} onChange={(v) => set('fill', v)} />
          <SliderField id="sel-op" label="Opacity" min={0} max={100} value={Math.round((obj.opacity ?? 1) * 100)} onChange={(v) => set('opacity', v / 100)} />
          <SliderField id="sel-rot" label="Rotation" min={0} max={360} value={Math.round(obj.angle || 0)} onChange={(v) => set('angle', v)} />
        </>
      ) : null}
    </div>
  );
}
