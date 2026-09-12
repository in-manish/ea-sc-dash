import { FILTER_PRESETS } from '../../domain/filterPresets';
import { useCanvasEditor } from '../../hooks/editorContext';
import SliderField from '../SliderField';

export default function FiltersPanel() {
  const { styles, adj, session } = useCanvasEditor();
  const src = session.meta.hasImage ? undefined : null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Filters</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`border rounded-md p-2 text-left transition-colors ${
              styles.presetId === preset.id ? 'border-accent bg-accent/5' : 'border-border hover:border-border-hover bg-bg-secondary'
            }`}
            onClick={() => adj.choosePreset(preset.id)}
            aria-pressed={styles.presetId === preset.id}
          >
            <span
              className="block h-10 rounded-sm mb-1 bg-gradient-to-br from-slate-300 to-slate-500"
              style={{ filter: src === null ? 'none' : preset.css }}
              aria-hidden
            />
            <span className="text-[11px] font-medium text-text-primary">{preset.label}</span>
          </button>
        ))}
      </div>
      <SliderField
        id="filter-intensity"
        label="Intensity"
        min={0}
        max={100}
        value={styles.intensity}
        onChange={styles.setIntensity}
      />
    </div>
  );
}
