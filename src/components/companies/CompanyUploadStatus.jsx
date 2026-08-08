import React, { useState, useEffect, useCallback } from 'react';
import { eventService } from '../../services/eventService';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, User, Clock, XCircle, Download } from 'lucide-react';

const STATUS_COLORS = {
    completed: 'bg-emerald-100 text-emerald-800',
    complete: 'bg-emerald-100 text-emerald-800',
    success: 'bg-emerald-100 text-emerald-800',
    in_progress: 'bg-blue-100 text-blue-800 animate-pulse',
    processing: 'bg-blue-100 text-blue-800 animate-pulse',
    pending: 'bg-slate-100 text-slate-800',
    queued: 'bg-slate-100 text-slate-800',
    failed: 'bg-red-100 text-red-800',
    error: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
};

const PREVIEW_LIMIT = 5;

const statusClass = (status) => STATUS_COLORS[String(status || '').toLowerCase()] || 'bg-slate-100 text-slate-800';

const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

const toNumber = (value) => {
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
};

const escapeCsv = (value) => {
    const s = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const objectsToCsv = (rows) => {
    if (!rows.length) return '';
    const cols = Array.from(rows.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k));
        return set;
    }, new Set()));
    const header = cols.join(',');
    const body = rows.map((row) => cols.map((c) => escapeCsv(row[c])).join(',')).join('\n');
    return `${header}\n${body}`;
};

const downloadCsv = (rows, filename) => {
    const content = objectsToCsv(rows);
    if (!content) return;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

const CompanyUploadStatus = ({ eventId, token, refreshKey = 0 }) => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [total, setTotal] = useState(0);
    const [expandedId, setExpandedId] = useState(null);

    const loadUploads = useCallback(async (targetPage) => {
        setLoading(true);
        setError(null);
        try {
            const data = await eventService.getCompanyUploads(eventId, token, { page: targetPage, page_size: 20 });
            setUploads(data.results || []);
            setHasNext(Boolean(data.has_next));
            setTotal(data.total ?? (data.results ? data.results.length : 0));
        } catch (err) {
            setError(err.message || 'Failed to load upload status.');
        } finally {
            setLoading(false);
        }
    }, [eventId, token]);

    useEffect(() => {
        loadUploads(page);
    }, [page, refreshKey, loadUploads]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{total} upload{total === 1 ? '' : 's'}</span>
                <button
                    type="button"
                    onClick={() => loadUploads(page)}
                    disabled={loading}
                    className="btn btn-secondary btn-sm gap-2"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-4 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-3 text-status-danger text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {loading && uploads.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-text-tertiary gap-3">
                    <Loader2 className="animate-spin text-accent" size={24} />
                    <span className="text-sm">Loading upload status…</span>
                </div>
            ) : uploads.length === 0 ? (
                <div className="text-center py-16 text-text-secondary text-sm bg-bg-primary border border-border rounded-lg">
                    No uploads found for this event yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {uploads.map((rec) => {
                        const isExpanded = expandedId === rec.id;
                        const successRows = Array.isArray(rec.success) ? rec.success : [];
                        const rejectedRows = Array.isArray(rec.rejectee) ? rec.rejectee : [];
                        const successCount = successRows.length;
                        const rejectedCount = rejectedRows.length;
                        const totalCount = Array.isArray(rec.upload_data) ? rec.upload_data.length : (successCount + rejectedCount);
                        const percentage = toNumber(rec.upload_percentage);

                        return (
                            <div key={rec.id} className="bg-bg-primary rounded-lg border border-border overflow-hidden shadow-sm">
                                {/* Header (click to expand) */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(isExpanded ? null : rec.id); } }}
                                    className="w-full text-left p-4 cursor-pointer hover:bg-bg-secondary/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-text-primary">Upload #{rec.id}</span>
                                                <span className={`inline-flex py-0.5 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass(rec.status)}`}>
                                                    {rec.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-text-tertiary mt-1 flex items-center gap-3 flex-wrap">
                                                <span className="inline-flex items-center gap-1"><Clock size={11} /> {formatDate(rec.uploaded_on)}</span>
                                                {rec.uploaded_by?.name && (
                                                    <span className="inline-flex items-center gap-1"><User size={11} /> {rec.uploaded_by.name}</span>
                                                )}
                                                {rec.processing_time != null && <span>{rec.processing_time}s</span>}
                                            </div>
                                        </div>
                                        {isExpanded ? <ChevronUp size={18} className="text-text-tertiary shrink-0" /> : <ChevronDown size={18} className="text-text-tertiary shrink-0" />}
                                    </div>

                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex-1 bg-border rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${String(rec.status).toLowerCase() === 'failed' ? 'bg-red-500' : 'bg-accent'}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-text-secondary w-9 text-right">{percentage}%</span>
                                    </div>

                                    {/* Counts + downloads */}
                                    <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
                                        <span className="inline-flex items-center py-0.5 px-2 rounded-full bg-bg-secondary text-text-secondary font-medium border border-border">
                                            Total {totalCount}
                                        </span>
                                        <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                                            <CheckCircle2 size={12} /> {successCount} success
                                        </span>
                                        {successCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); downloadCsv(successRows, `upload_${rec.id}_success.csv`); }}
                                                className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors border-none cursor-pointer"
                                                title="Download success details"
                                            >
                                                <Download size={12} /> Success
                                            </button>
                                        )}
                                        <span className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-red-50 text-red-700 font-medium">
                                            <XCircle size={12} /> {rejectedCount} error
                                        </span>
                                        {rejectedCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); downloadCsv(rejectedRows, `upload_${rec.id}_errors.csv`); }}
                                                className="inline-flex items-center gap-1 py-0.5 px-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors border-none cursor-pointer"
                                                title="Download error details"
                                            >
                                                <Download size={12} /> Error
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-border pt-4 space-y-5">
                                        {successRows.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                                                        <CheckCircle2 size={13} /> Successful ({successCount})
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadCsv(successRows, `upload_${rec.id}_success.csv`)}
                                                        className="btn btn-secondary btn-sm gap-1.5 text-emerald-700"
                                                    >
                                                        <Download size={13} /> Download CSV
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {successRows.slice(0, PREVIEW_LIMIT).map((row, idx) => (
                                                        <div key={`${rec.id}-s-${row.company_id ?? idx}`} className="bg-bg-secondary border border-border rounded-lg px-3 py-2.5">
                                                            <div className="flex items-center gap-2 flex-wrap text-sm text-text-primary">
                                                                <span className="font-medium">{row.company_name || `Company #${row.company_id}`}</span>
                                                                {row.obf_number && (
                                                                    <span className="text-[11px] font-mono bg-bg-tertiary text-text-secondary px-1.5 py-0.5 rounded">OBF {row.obf_number}</span>
                                                                )}
                                                                {row.is_parent_exhibitor && (
                                                                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">Parent</span>
                                                                )}
                                                            </div>
                                                            {row.matchmaking_error && (
                                                                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-1.5 mt-2 flex items-start gap-1.5">
                                                                    <AlertCircle size={12} className="mt-0.5 shrink-0" />
                                                                    {row.matchmaking_error}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {successCount > PREVIEW_LIMIT && (
                                                    <p className="text-xs text-text-tertiary mt-2">
                                                        Showing {PREVIEW_LIMIT} of {successCount}. Download the CSV for all records.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {rejectedRows.length > 0 && (
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                                                        <XCircle size={13} /> Rejected ({rejectedCount})
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => downloadCsv(rejectedRows, `upload_${rec.id}_errors.csv`)}
                                                        className="btn btn-secondary btn-sm gap-1.5 text-red-700"
                                                    >
                                                        <Download size={13} /> Download CSV
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {rejectedRows.slice(0, PREVIEW_LIMIT).map((row, idx) => (
                                                        <div key={`${rec.id}-r-${row.company_id ?? idx}`} className="bg-bg-secondary border border-red-100 rounded-lg px-3 py-2.5">
                                                            <div className="text-sm font-medium text-text-primary">
                                                                {row.company_name || `Company #${row.company_id}`}
                                                            </div>
                                                            {row.error && (
                                                                <p className="text-xs text-red-700 mt-1">{row.error}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {rejectedCount > PREVIEW_LIMIT && (
                                                    <p className="text-xs text-text-tertiary mt-2">
                                                        Showing {PREVIEW_LIMIT} of {rejectedCount}. Download the CSV for all records.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {rec.uploaded_by && (
                                            <div className="text-xs text-text-tertiary pt-1 border-t border-border/60">
                                                Uploaded by {rec.uploaded_by.name}
                                                {rec.uploaded_by.email ? ` (${rec.uploaded_by.email})` : ''}
                                                {' · '}Updated {formatDate(rec.updated_at)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex justify-end items-center gap-4 pt-2">
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Previous
                </button>
                <span className="text-sm text-text-secondary">Page {page}</span>
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={!hasNext || loading}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CompanyUploadStatus;
