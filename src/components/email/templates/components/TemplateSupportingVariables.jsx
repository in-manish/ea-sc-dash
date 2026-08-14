import { Plus } from 'lucide-react';

export default function TemplateSupportingVariables({
  variables,
  usedNames,
  isEditing,
  highlightName,
  onHover,
  onLeave,
  onToggle,
  onInsert,
}) {
  if (!variables?.length) return null;
  const used = new Set(usedNames || []);

  return (
    <div className="pt-6 border-t border-gray-200">
      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
        Available variables
      </span>
      <p className="text-[11px] text-gray-500 leading-relaxed m-0 mb-2">
        {isEditing ? 'Click to insert at the cursor in the body.' : 'Supported placeholders for this template.'}
      </p>
      <ul className="list-none p-0 m-0 flex flex-col gap-1.5">
        {variables.map((item) => (
          <VariableRow
            key={item.name}
            item={item}
            inBody={used.has(item.name)}
            active={highlightName === item.name}
            isEditing={isEditing}
            onHover={onHover}
            onLeave={onLeave}
            onToggle={onToggle}
            onInsert={onInsert}
          />
        ))}
      </ul>
    </div>
  );
}

function VariableRow({
  item,
  inBody,
  active,
  isEditing,
  onHover,
  onLeave,
  onToggle,
  onInsert,
}) {
  const pick = () => {
    if (isEditing) onInsert?.(item.name);
    else onToggle?.(item.name);
  };

  return (
    <li>
      <button
        type="button"
        title={item.description || item.name}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={() => onHover?.(item.name)}
        onMouseLeave={() => onLeave?.()}
        onClick={pick}
        className={`w-full text-left px-2.5 py-2 rounded-lg border cursor-pointer transition-colors ${
          active
            ? 'bg-amber-100 border-amber-400'
            : 'bg-white border-gray-200 hover:border-amber-300'
        }`}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block font-mono text-xs text-gray-900">{`{{${item.name}}}`}</span>
            {item.description ? (
              <span className="block text-[11px] text-gray-500 mt-0.5 leading-snug">
                {item.description}
              </span>
            ) : null}
          </span>
          {isEditing ? (
            <Plus size={14} className="text-accent shrink-0 mt-0.5" />
          ) : inBody ? (
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 shrink-0">
              In body
            </span>
          ) : null}
        </span>
      </button>
    </li>
  );
}
