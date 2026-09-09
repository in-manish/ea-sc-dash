import { AlertCircle, AlertTriangle, CheckCircle2, Download, Loader2, ShieldCheck, XCircle } from 'lucide-react';

export const CSV_ROW_PREVIEW_LIMIT = 8;

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

/**
 * Shared "Validation results" panel for CSV bulk-upload modals: summary badges,
 * header-issue banner, blocking-errors banner, and a capped preview of per-row issues.
 * `renderRowLabel(row)` supplies the row-identifying fragment next to "Row N"
 * (e.g. company name + OBF number, or attendee name + email).
 */
export default function CsvUploadResultPanel({
    summary,
    rowIssues,
    hasBlockingErrors,
    downloadingReport,
    downloadDisabled = downloadingReport,
    onDownloadReport,
    renderRowLabel,
}) {
    if (!summary) return null;
    const headerIssues = summary.header_issues;

    return (
        <div className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-accent" /> Validation results
                </p>
                <button
                    type="button"
                    onClick={onDownloadReport}
                    disabled={downloadDisabled}
                    className="btn btn-secondary btn-sm gap-1.5"
                >
                    {downloadingReport ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    Download report
                </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="inline-flex items-center py-0.5 px-2 rounded-full bg-bg-secondary text-text-secondary font-medium border border-border">
                    Total {summary.total_rows}
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    <CheckCircle2 size={12} /> {summary.valid_rows} valid
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-amber-50 text-amber-700 font-medium">
                    <AlertTriangle size={12} /> {summary.rows_with_warnings} warning{summary.rows_with_warnings === 1 ? '' : 's'}
                </span>
                <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-red-50 text-red-700 font-medium">
                    <XCircle size={12} /> {summary.rows_with_errors} error{summary.rows_with_errors === 1 ? '' : 's'}
                </span>
            </div>

            {headerIssues && (headerIssues.unknown_headers?.length > 0 || headerIssues.duplicate_headers?.length > 0) && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 space-y-1">
                    {headerIssues.unknown_headers?.length > 0 && (
                        <p>Unrecognized columns (ignored): {headerIssues.unknown_headers.join(', ')}</p>
                    )}
                    {headerIssues.duplicate_headers?.length > 0 && (
                        <p>Duplicate columns: {headerIssues.duplicate_headers.join(', ')}</p>
                    )}
                </div>
            )}

            {hasBlockingErrors && (
                <div className="p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-start gap-2 text-status-danger text-xs">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>Fix the row errors below before uploading, or upload anyway and the affected rows will be rejected.</span>
                </div>
            )}

            {rowIssues.length > 0 && (
                <div className="space-y-2">
                    {rowIssues.slice(0, CSV_ROW_PREVIEW_LIMIT).map((row) => (
                        <div
                            key={row.row_number}
                            className={`bg-bg-secondary border rounded-lg px-3 py-2.5 ${row.status === 'error' ? 'border-red-100' : 'border-amber-100'}`}
                        >
                            <div className="flex items-center gap-2 flex-wrap text-sm text-text-primary">
                                <span className="font-medium">Row {row.row_number}</span>
                                {renderRowLabel?.(row)}
                            </div>
                            {(row.errors || []).map((issue, idx) => (
                                <IssueLine key={`e-${idx}`} issue={issue} tone="error" />
                            ))}
                            {(row.warnings || []).map((issue, idx) => (
                                <IssueLine key={`w-${idx}`} issue={issue} tone="warning" />
                            ))}
                        </div>
                    ))}
                    {rowIssues.length > CSV_ROW_PREVIEW_LIMIT && (
                        <p className="text-xs text-text-tertiary">
                            Showing {CSV_ROW_PREVIEW_LIMIT} of {rowIssues.length} rows with issues. Download the report for the full list.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
