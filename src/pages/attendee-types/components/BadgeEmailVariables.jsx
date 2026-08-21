import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { filterBadgeEmailVariables } from '../domain/badgeEmailVariables';

export default function BadgeEmailVariables({
    variables,
    usedNames,
    isEditing,
    highlightName,
    onHover,
    onLeave,
    onToggle,
    onInsert,
}) {
    const [query, setQuery] = useState('');
    const used = new Set(usedNames || []);
    const visible = useMemo(
        () => filterBadgeEmailVariables(variables, query),
        [variables, query],
    );

    return (
        <div className="flex flex-col min-h-0">
            <span className="block text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">
                Available variables
            </span>
            <p className="text-[11px] text-text-tertiary leading-relaxed m-0 mb-2">
                {isEditing
                    ? 'Type to search. Click to insert at the cursor.'
                    : 'Type to search. Select a token to highlight it.'}
            </p>
            <label className="relative block mb-2">
                <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                />
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search variables"
                    className="w-full pl-8 pr-2.5 py-2 text-xs bg-bg-primary border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Search variables"
                />
            </label>
            <ul className="list-none p-0 m-0 flex flex-col gap-1 overflow-y-auto max-h-[min(28rem,50vh)]">
                {visible.map((item) => (
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
                {visible.length === 0 && (
                    <li className="text-[11px] text-text-tertiary px-1 py-2">
                        No variables match “{query}”.
                    </li>
                )}
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
                className={`w-full text-left px-2 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                    active
                        ? 'bg-amber-100 border-amber-400'
                        : 'bg-bg-primary border-border hover:border-amber-300'
                }`}
            >
                <span className="flex items-center justify-between gap-2">
                    <span className="min-w-0">
                        {item.label ? (
                            <span className="block text-xs font-semibold text-text-primary">
                                {item.label}
                            </span>
                        ) : null}
                        <span className="block font-mono text-xs text-text-primary truncate">
                            {item.name}
                        </span>
                        {item.description ? (
                            <span className="block text-[10px] text-text-tertiary leading-snug mt-0.5">
                                {item.description}
                            </span>
                        ) : null}
                    </span>
                    {isEditing ? (
                        <Plus size={14} className="text-accent shrink-0" />
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
