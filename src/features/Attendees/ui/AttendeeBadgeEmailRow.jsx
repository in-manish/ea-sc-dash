import { Check, Eye } from 'lucide-react';

export default function AttendeeBadgeEmailRow({
    selected,
    onToggle,
    onViewDrafts,
    disabled,
}) {
    return (
        <div className="flex items-center gap-3 py-3 px-1">
            <button
                type="button"
                role="checkbox"
                aria-checked={selected}
                aria-label="Badge Email"
                disabled={disabled}
                onClick={onToggle}
                className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:opacity-50 ${
                    selected
                        ? 'bg-accent border-accent text-white'
                        : 'bg-bg-primary border-border text-transparent hover:border-accent'
                }`}
            >
                <Check size={14} strokeWidth={3} />
            </button>
            <span className="flex-1 text-sm font-medium text-text-primary">Badge Email</span>
            <button
                type="button"
                onClick={onViewDrafts}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent bg-transparent border-none cursor-pointer px-2 py-1 rounded-md hover:bg-accent/10 disabled:opacity-50"
            >
                <Eye size={15} />
                View
            </button>
        </div>
    );
}
