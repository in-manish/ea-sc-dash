import { AlertTriangle, XCircle } from 'lucide-react';

const PREVIEW_LIMIT = 8;

function IssueLine({ issue, tone }) {
    const Icon = tone === 'error' ? XCircle : AlertTriangle;
    const color = tone === 'error' ? 'text-red-700' : 'text-amber-700';
    return (
        <p className={`text-xs ${color} mt-1.5 flex items-start gap-1.5`}>
            <Icon size={12} className="mt-0.5 shrink-0" />
            <span>
                {issue.column && <span className="font-medium">{issue.column}: </span>}
                {issue.message}
                {issue.suggestion && ` (Suggested: ${issue.suggestion})`}
            </span>
        </p>
    );
}

/** Row-level validation errors/warnings for the attendee CSV upload dry-run result. */
export default function AttendeeUploadRowIssues({ rows }) {
    if (!rows.length) return null;

    return (
        <div className="space-y-2">
            {rows.slice(0, PREVIEW_LIMIT).map((row) => (
                <div
                    key={row.row_number}
                    className={`bg-bg-secondary border rounded-lg px-3 py-2.5 ${row.status === 'error' ? 'border-red-100' : 'border-amber-100'}`}
                >
                    <div className="flex items-center gap-2 flex-wrap text-sm text-text-primary">
                        <span className="font-medium">Row {row.row_number}</span>
                        {row.name && <span className="text-text-secondary">{row.name}</span>}
                        {row.email && (
                            <span className="text-[11px] font-mono bg-bg-tertiary text-text-secondary px-1.5 py-0.5 rounded">
                                {row.email}
                            </span>
                        )}
                    </div>
                    {row.errors.map((issue, idx) => (
                        <IssueLine key={`e-${idx}`} issue={issue} tone="error" />
                    ))}
                    {row.warnings.map((issue, idx) => (
                        <IssueLine key={`w-${idx}`} issue={issue} tone="warning" />
                    ))}
                </div>
            ))}
            {rows.length > PREVIEW_LIMIT && (
                <p className="text-xs text-text-tertiary">
                    Showing {PREVIEW_LIMIT} of {rows.length} rows with issues. Download the report for the full list.
                </p>
            )}
        </div>
    );
}
