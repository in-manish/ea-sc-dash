import { extractPlaceholderNames } from '../domain/contentVariables';

export default function TemplateVariablePlaceholders({
  html,
  subject,
  highlightName,
  pinnedName,
  onHover,
  onLeave,
  onToggle,
}) {
  const names = extractPlaceholderNames(html, subject);

  return (
    <div className="pt-6 border-t border-gray-200">
      <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
        Placeholders
      </span>
      {names.length ? (
        <div className="flex flex-wrap gap-2">
          {names.map((name) => {
            const active = highlightName === name;
            const pinned = pinnedName === name;
            return (
              <button
                key={name}
                type="button"
                onMouseEnter={() => onHover?.(name)}
                onMouseLeave={() => onLeave?.()}
                onClick={() => onToggle?.(name)}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border cursor-pointer transition-colors ${
                  active
                    ? 'bg-amber-200 border-amber-500 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-800 hover:border-amber-300'
                } ${pinned ? 'ring-2 ring-amber-400' : ''}`}
              >
                {`{{${name}}}`}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-500 m-0">
          Add {'{{name}}'} in the body to show placeholders here.
        </p>
      )}
      <p className="text-[11px] text-gray-500 leading-relaxed mt-3 m-0">
        Hover or click a token to highlight it in the body.
      </p>
    </div>
  );
}
