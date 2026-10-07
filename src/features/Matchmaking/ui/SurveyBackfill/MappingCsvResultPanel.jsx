import { AlertCircle, AlertTriangle, Ban, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
    { key: 'errors', label: 'Errors', Icon: AlertCircle, tone: 'text-status-danger', bg: 'bg-status-danger/5 border-status-danger/10' },
    { key: 'warnings', label: 'Warnings', Icon: AlertTriangle, tone: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    { key: 'ignored', label: 'Ignored', Icon: Ban, tone: 'text-text-secondary', bg: 'bg-bg-secondary border-border' },
];

export default function MappingCsvResultPanel({ result }) {
    if (!result) return null;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
                    <CheckCircle2 size={14} />
                    {result.dryRun ? 'Would save' : 'Saved'}: {result.saved}
                </span>
                {result.forms?.length > 0 && (
                    <span className="text-xs text-text-tertiary">
                        Forms: {result.forms.join(', ')}
                    </span>
                )}
                {result.uploadId != null && (
                    <span className="text-xs text-text-tertiary">
                        Upload #{result.uploadId}
                    </span>
                )}
                {result.dryRun && (
                    <span className="text-xs uppercase tracking-wide text-text-tertiary font-semibold">Dry run</span>
                )}
            </div>

            {SECTIONS.map(({ key, label, Icon, tone, bg }) => {
                const items = result[key] || [];
                if (!items.length) return null;
                return (
                    <div key={key} className={`p-4 rounded-lg border ${bg}`}>
                        <p className={`text-sm font-semibold ${tone} flex items-center gap-2 mb-2`}>
                            <Icon size={14} />
                            {label} ({items.length})
                        </p>
                        <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                            {items.map((item, idx) => (
                                <li key={`${key}-${item.row}-${idx}`} className={`text-xs ${tone}`}>
                                    {item.row != null && <span className="font-medium">Row {item.row}: </span>}
                                    {item.reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
