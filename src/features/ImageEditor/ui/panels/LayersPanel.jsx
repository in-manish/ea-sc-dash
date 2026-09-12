import { Copy, Eye, EyeOff, Lock, Unlock, Trash2 } from 'lucide-react';
import { useCanvasEditor } from '../../hooks/editorContext';

export default function LayersPanel() {
  const { selection, layers } = useCanvasEditor();
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Layers</h3>
      <ul className="list-none m-0 p-0 flex flex-col gap-1">
        {selection.layers.map((obj) => (
          <li key={obj.layerId || obj.cacheKey}>
            <div
              className={`flex items-center gap-1 rounded-md border px-2 py-1.5 ${
                selection.selected === obj ? 'border-accent bg-accent/5' : 'border-border'
              }`}
            >
              <button type="button" className="flex-1 text-left bg-transparent border-none text-xs text-text-primary truncate" onClick={() => selection.selectLayer(obj)}>
                {obj.layerName || obj.layerType || obj.type}
              </button>
              <button type="button" className="btn btn-ghost p-1" aria-label="Visibility" onClick={() => layers.toggleVisible(obj)}>
                {obj.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              <button type="button" className="btn btn-ghost p-1" aria-label="Lock" onClick={() => layers.toggleLock(obj)}>
                {obj.locked ? <Lock size={12} /> : <Unlock size={12} />}
              </button>
              <button type="button" className="btn btn-ghost p-1" aria-label="Duplicate" onClick={() => layers.duplicate(obj)}>
                <Copy size={12} />
              </button>
              <button type="button" className="btn btn-ghost p-1" aria-label="Delete" onClick={() => layers.remove(obj)}>
                <Trash2 size={12} />
              </button>
            </div>
            <input
              className="input-field text-[11px] py-1 mt-1"
              aria-label="Rename layer"
              defaultValue={obj.layerName || ''}
              onBlur={(e) => layers.rename(obj, e.target.value || obj.layerName)}
            />
          </li>
        ))}
      </ul>
      {selection.selected ? (
        <div className="grid grid-cols-2 gap-1 mt-3">
          <button type="button" className="btn btn-secondary text-[11px] py-1" onClick={() => layers.order(selection.selected, 'forward')}>Forward</button>
          <button type="button" className="btn btn-secondary text-[11px] py-1" onClick={() => layers.order(selection.selected, 'backward')}>Backward</button>
          <button type="button" className="btn btn-secondary text-[11px] py-1" onClick={() => layers.order(selection.selected, 'front')}>To front</button>
          <button type="button" className="btn btn-secondary text-[11px] py-1" onClick={() => layers.order(selection.selected, 'back')}>To back</button>
        </div>
      ) : null}
    </div>
  );
}
