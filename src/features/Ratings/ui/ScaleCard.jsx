import { Pencil, Plus, Trash2 } from 'lucide-react';

const iconButton = 'p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-secondary';

function OptionRow({ option, onEdit, onDelete }) {
  return (
    <li className="group flex items-start gap-3 py-2 border-t border-border first:border-t-0">
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${option.isActive ? 'text-text-primary' : 'text-text-tertiary line-through'}`}>{option.title}</div>
        {option.description ? <div className="text-xs text-text-tertiary mt-0.5">{option.description}</div> : null}
      </div>
      {!option.isActive ? <span className="text-[10px] font-bold uppercase text-text-tertiary mt-1">Inactive</span> : null}
      <div className="flex opacity-60 group-hover:opacity-100 transition-opacity">
        <button type="button" className={iconButton} onClick={() => onEdit(option)} aria-label={`Edit option ${option.title}`}><Pencil size={14} /></button>
        <button type="button" className={iconButton} onClick={() => onDelete(option)} aria-label={`Delete option ${option.title}`}><Trash2 size={14} /></button>
      </div>
    </li>
  );
}

/** One rating value (colour, number, label) with its feedback options. */
export default function ScaleCard({ scale, onEditScale, onDeleteScale, onAddOption, onEditOption, onDeleteOption }) {
  return (
    <section className="border border-border rounded-xl bg-bg-primary overflow-hidden" style={{ borderLeft: `4px solid ${scale.color || '#94a3b8'}` }}>
      <header className="flex items-center gap-3 px-4 py-3 bg-bg-secondary/50">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold" style={{ backgroundColor: scale.color || '#94a3b8' }}>
          {scale.value}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-text-primary">{scale.label || `Value ${scale.value}`}</div>
          <div className="text-xs text-text-tertiary">
            {scale.options.length} option{scale.options.length === 1 ? '' : 's'}{scale.isActive ? '' : ' · inactive'}
          </div>
        </div>
        <button type="button" className={iconButton} onClick={() => onEditScale(scale)} aria-label={`Edit value ${scale.value}`}><Pencil size={15} /></button>
        <button type="button" className={iconButton} onClick={() => onDeleteScale(scale)} aria-label={`Delete value ${scale.value}`}><Trash2 size={15} /></button>
      </header>
      <div className="px-4 py-2">
        {scale.options.length ? (
          <ul className="m-0 p-0 list-none">
            {scale.options.map((option) => (
              <OptionRow key={option.id} option={option} onEdit={(o) => onEditOption(scale, o)} onDelete={(o) => onDeleteOption(scale, o)} />
            ))}
          </ul>
        ) : (
          <p className="text-xs text-text-tertiary my-2">No feedback options yet.</p>
        )}
        <button type="button" onClick={() => onAddOption(scale)} className="my-1 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline">
          <Plus size={14} /> Add option
        </button>
      </div>
    </section>
  );
}
