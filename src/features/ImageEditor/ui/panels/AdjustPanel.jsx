import { ADJUSTMENT_FIELDS } from '../../domain/adjustments';
import { useCanvasEditor } from '../../hooks/editorContext';
import SliderField from '../SliderField';

export default function AdjustPanel() {
  const { styles, adj, history } = useCanvasEditor();
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-text-primary m-0">Adjust</h3>
        <button type="button" className="btn btn-ghost text-[11px] py-1 px-2" onClick={adj.resetAll}>Reset all</button>
      </div>
      {ADJUSTMENT_FIELDS.map((field) => (
        <SliderField
          key={field.key}
          id={`adj-${field.key}`}
          label={field.label}
          min={field.min}
          max={field.max}
          value={styles.adjustments[field.key]}
          onChange={(value) => adj.setField(field.key, value)}
          onReset={() => { adj.resetField(field.key); history.save(); }}
        />
      ))}
    </div>
  );
}
