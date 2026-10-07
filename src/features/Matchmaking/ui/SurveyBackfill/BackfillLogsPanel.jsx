import { Link } from 'react-router-dom';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { BACKFILL_LOG_STATUSES } from '../../domain/parseBackfillMappingResult';
import { BACKFILL_PAGE_SIZES } from '../../hooks/useSurveyBackfillLogs';

const STATUS_LABEL = {
    done: 'Done',
    no_badge: 'No badge',
    no_mapping: 'No mapping',
    error: 'Error',
};

function writtenSummary(written) {
    if (!Array.isArray(written) || !written.length) return null;
    return written
        .map((row) => `Q${row.question_id} ${row.answer_for || ''} (${(row.option_ids || []).join(',')})`)
        .join(' · ');
}

function countsTotal(counts) {
    return BACKFILL_LOG_STATUSES.reduce((sum, key) => sum + (Number(counts?.[key]) || 0), 0);
}

export default function BackfillLogsPanel({
    eventId,
    logs,
    formFilter,
    setFormFilter,
    statusFilter,
    setStatusFilter,
    pageSize,
    setPageSize,
}) {
    const countEntries = BACKFILL_LOG_STATUSES.map((key) => ({
        key,
        count: Number(logs.counts?.[key]) || 0,
    }));
    const allCount = countsTotal(logs.counts);

    return (
        <section className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-base font-bold text-text-primary">4. Backfill log</h3>
                    <p className="text-xs text-text-tertiary mt-1">
                        Counts follow form filter but ignore status. Newest first.
                        {logs.polling ? ' Polling…' : ''}
                    </p>
                </div>
                <button type="button" onClick={logs.refresh} disabled={logs.loading} className="btn btn-secondary btn-sm gap-2">
                    <RefreshCw size={14} className={logs.loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="flex flex-wrap gap-2 items-end">
                <label className="text-sm flex-1 min-w-[180px]">
                    <span className="text-xs font-semibold text-text-secondary">Form filter</span>
                    <input
                        type="text"
                        value={formFilter}
                        onChange={(e) => setFormFilter(e.target.value)}
                        placeholder="All forms"
                        className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-secondary"
                    />
                </label>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setStatusFilter('')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
                        !statusFilter ? 'bg-accent text-white border-accent' : 'bg-bg-secondary border-border text-text-secondary'
                    }`}
                >
                    All ({allCount})
                </button>
                {countEntries.map(({ key, count }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setStatusFilter(key)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${
                            statusFilter === key
                                ? 'bg-accent text-white border-accent'
                                : 'bg-bg-secondary border-border text-text-secondary'
                        }`}
                    >
                        {STATUS_LABEL[key]} ({count})
                    </button>
                ))}
            </div>

            {logs.error && (
                <div className="p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-2 text-status-danger text-sm">
                    <AlertCircle size={16} />
                    {logs.error}
                </div>
            )}

            {logs.loading && !logs.results.length ? (
                <div className="flex items-center justify-center py-10 text-text-tertiary gap-2 text-sm">
                    <Loader2 className="animate-spin text-accent" size={20} />
                    Loading logs…
                </div>
            ) : logs.results.length === 0 ? (
                <p className="text-sm text-text-secondary py-6 text-center">No backfill log rows yet.</p>
            ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                    {logs.results.map((row) => (
                        <div key={row.id} className="p-3 rounded-lg border border-border bg-bg-secondary text-sm">
                            <div className="flex flex-wrap justify-between gap-2">
                                <span className="font-semibold text-text-primary">{row.form_value || '—'}</span>
                                <span className="text-xs uppercase tracking-wide text-text-tertiary font-bold">
                                    {STATUS_LABEL[row.status] || row.status}
                                </span>
                            </div>
                            <p className="text-xs text-text-tertiary mt-1 break-all">
                                record {row.record_id || '—'}
                                {row.badge_uuid ? (
                                    <>
                                        {' · badge '}
                                        <Link
                                            to={`/event/${eventId}/attendees?q=${encodeURIComponent(row.badge_uuid)}`}
                                            className="text-accent hover:underline font-medium"
                                            title="Open attendee"
                                        >
                                            {row.badge_uuid}
                                        </Link>
                                    </>
                                ) : null}
                            </p>
                            {row.status === 'done' && writtenSummary(row.written) && (
                                <p className="text-xs text-text-secondary mt-1">{writtenSummary(row.written)}</p>
                            )}
                            {row.status === 'error' && row.error && (
                                <p className="text-xs text-status-danger mt-1">{row.error}</p>
                            )}
                            {row.processed_at && (
                                <p className="text-[11px] text-text-tertiary mt-1">
                                    {new Date(row.processed_at).toLocaleString()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-tertiary">
                <div className="flex flex-wrap items-center gap-3">
                    <span>
                        Page {logs.page} · {logs.total} row{logs.total === 1 ? '' : 's'}
                    </span>
                    <label className="flex items-center gap-1.5">
                        <span className="font-semibold text-text-secondary">Per page</span>
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="px-2 py-1 text-xs border border-border rounded-md bg-bg-primary text-text-primary"
                        >
                            {BACKFILL_PAGE_SIZES.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm gap-1"
                        disabled={logs.page <= 1 || logs.loading}
                        onClick={() => logs.setPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm gap-1"
                        disabled={logs.page * pageSize >= logs.total || logs.loading}
                        onClick={() => logs.setPage((p) => p + 1)}
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </section>
    );
}
