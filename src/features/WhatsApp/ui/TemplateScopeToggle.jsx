import { TEMPLATE_SCOPE } from '../constants';

const SCOPE_ITEMS = [
    { id: TEMPLATE_SCOPE.ACTIVE, label: 'Active' },
    { id: TEMPLATE_SCOPE.ARCHIVED, label: 'Archived' },
];

/** Active / Archived list filter. Default list is active (omit is_active). */
export default function TemplateScopeToggle({ scope, onChange }) {
    return (
        <div className="inline-flex p-1 rounded-xl bg-bg-secondary border border-border">
            {SCOPE_ITEMS.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        scope === item.id
                            ? 'bg-bg-primary text-accent shadow-sm'
                            : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
