import { Plus } from 'lucide-react';

export default function RatingTypeList({ types, selectedId, onSelect, onCreate }) {
  return (
    <nav className="flex flex-col gap-2" aria-label="Rating types">
      <button
        type="button"
        onClick={onCreate}
        className="h-10 rounded-md border border-dashed border-border text-sm font-semibold text-accent hover:bg-accent/5 inline-flex items-center justify-center gap-2"
      >
        <Plus size={16} /> New rating type
      </button>
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onSelect(type.id)}
          aria-current={type.id === selectedId}
          className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
            type.id === selectedId ? 'border-accent bg-accent/5' : 'border-border hover:bg-bg-secondary'
          }`}
        >
          <div className="text-sm font-semibold text-text-primary truncate">{type.name}</div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-text-tertiary">
            <span>{type.categoryLabel}</span>
            {!type.isActive ? <span className="font-bold uppercase">· Inactive</span> : null}
          </div>
        </button>
      ))}
    </nav>
  );
}
