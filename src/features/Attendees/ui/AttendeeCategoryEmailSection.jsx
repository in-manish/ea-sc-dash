import { Loader2, Mail } from 'lucide-react';
import AttendeeCategoryEmailRow from './AttendeeCategoryEmailRow';

export default function AttendeeCategoryEmailSection({
    emails,
    loading,
    error,
    selectedIds,
    expandedId,
    onToggle,
    onToggleExpand,
    disabled,
}) {
    return (
        <div className="pt-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary px-1 mb-1">
                Categories Email
            </h3>
            {loading && (
                <div className="flex items-center gap-2 py-6 px-1 text-text-tertiary text-sm">
                    <Loader2 className="animate-spin text-accent" size={18} />
                    Loading category emails...
                </div>
            )}
            {error && (
                <div
                    className="bg-red-50 text-red-800 p-3 border border-red-200 rounded-md text-sm"
                    role="alert"
                >
                    {error}
                </div>
            )}
            {!loading && !error && emails.length === 0 && (
                <div className="text-sm text-text-secondary py-4 px-1 flex items-start gap-2">
                    <Mail size={16} className="text-text-tertiary mt-0.5 shrink-0" />
                    <span>No category emails saved for this event.</span>
                </div>
            )}
            {!loading && !error && emails.map((email) => (
                <AttendeeCategoryEmailRow
                    key={email.id}
                    email={email}
                    selected={selectedIds.includes(email.id)}
                    expanded={expandedId === email.id}
                    onToggle={() => onToggle(email.id)}
                    onToggleExpand={() => onToggleExpand(email.id)}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}
