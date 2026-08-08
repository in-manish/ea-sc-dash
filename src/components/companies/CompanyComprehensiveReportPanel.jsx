import React, { useCallback, useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import {
    AlertCircle,
    BarChart3,
    ChevronDown,
    Loader2,
    RefreshCw,
} from 'lucide-react';

const formatNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    return Number(value).toLocaleString();
};

const getProgressPercent = (done, total) => {
    const d = Number(done);
    const t = Number(total);
    if (!t || Number.isNaN(d) || Number.isNaN(t) || t <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((d / t) * 100)));
};

/** Color fill based on how many companies completed vs total parents */
const getProgressBarClass = (percent) => {
    if (percent >= 100) return 'bg-emerald-500';
    if (percent >= 66) return 'bg-emerald-400';
    if (percent >= 33) return 'bg-amber-400';
    return 'bg-rose-400';
};

const MetricRow = ({ label, value, hint, progressDone, progressTotal }) => {
    const showProgress = progressTotal !== undefined && progressTotal !== null;
    const percent = showProgress ? getProgressPercent(progressDone, progressTotal) : 0;
    const barClass = getProgressBarClass(percent);

    return (
        <div className="py-2.5 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between gap-6">
                <span className="text-sm text-text-secondary">{label}</span>
                <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-text-primary tabular-nums">{value}</span>
                    {hint && (
                        <p className="text-xs text-text-tertiary m-0 mt-0.5">{hint}</p>
                    )}
                </div>
            </div>
            {showProgress && (
                <div className="mt-2 flex items-center gap-3">
                    <div
                        className="flex-1 h-1.5 rounded-full bg-bg-tertiary overflow-hidden"
                        role="progressbar"
                        aria-valuenow={percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${label} progress`}
                    >
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${barClass}`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-text-tertiary tabular-nums shrink-0 w-16 text-right">
                        {formatNumber(progressDone)} / {formatNumber(progressTotal)}
                        <span className="ml-1">({percent}%)</span>
                    </span>
                </div>
            )}
        </div>
    );
};

const SkeletonRow = () => (
    <div className="flex items-center justify-between gap-6 py-2.5 border-b border-border last:border-b-0">
        <div className="animate-pulse h-3.5 w-36 rounded bg-bg-tertiary" />
        <div className="animate-pulse h-3.5 w-12 rounded bg-bg-tertiary" />
    </div>
);

const CompanyComprehensiveReportPanel = ({
    eventId,
    token,
    parentExhibitorId: filterParentId = '',
}) => {
    const [expanded, setExpanded] = useState(false);
    const [parentExhibitorId, setParentExhibitorId] = useState(
        filterParentId ? String(filterParentId) : ''
    );
    const [appliedParentId, setAppliedParentId] = useState(
        filterParentId ? String(filterParentId) : ''
    );
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        const next = filterParentId ? String(filterParentId) : '';
        setParentExhibitorId(next);
        setAppliedParentId(next);
    }, [filterParentId]);

    const fetchReport = useCallback(async (parentId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await eventService.getCompanyComprehensiveReport(
                eventId,
                token,
                parentId || null
            );
            setReport(data);
            setHasFetched(true);
        } catch (err) {
            setReport(null);
            setError(err.message || 'Failed to load company report.');
        } finally {
            setLoading(false);
        }
    }, [eventId, token]);

    useEffect(() => {
        if (!expanded) return;
        fetchReport(appliedParentId);
    }, [expanded, fetchReport, appliedParentId]);

    const handleToggle = () => {
        setExpanded((prev) => !prev);
    };

    const handleApplyParentFilter = (e) => {
        e.preventDefault();
        const trimmed = parentExhibitorId.trim();
        if (trimmed && !/^\d+$/.test(trimmed)) {
            setError('Parent exhibitor ID must be an integer.');
            return;
        }
        setAppliedParentId(trimmed);
    };

    const handleClearParentFilter = () => {
        setParentExhibitorId('');
        setAppliedParentId('');
    };

    const isScoped = Boolean(appliedParentId);

    return (
        <div className="mb-6 border border-border bg-bg-primary overflow-hidden animate-fade-in">
            <button
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-bg-secondary/50 transition-colors text-left"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <BarChart3 size={16} className="text-accent shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary m-0">Company Report</p>
                        <p className="text-xs text-text-tertiary m-0 truncate">
                            Parent / co-exhibitor totals, handover, water coupons, print badges
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {!expanded && report && (
                        <span className="hidden sm:inline text-xs text-text-tertiary tabular-nums">
                            {formatNumber(report.parent_exhibitor_count)} parents · {formatNumber(report.co_exhibitor_count)} co
                        </span>
                    )}
                    <ChevronDown
                        size={18}
                        className={`text-text-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            <div
                className={`transition-[grid-template-rows] duration-300 ease-out grid ${
                    expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                        <form
                            onSubmit={handleApplyParentFilter}
                            className="flex flex-col sm:flex-row sm:items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <label htmlFor="inline-report-parent-id" className="sr-only">
                                Parent exhibitor ID
                            </label>
                            <input
                                id="inline-report-parent-id"
                                type="text"
                                inputMode="numeric"
                                placeholder="Optional parent ID for nested metrics"
                                className="flex-1 min-w-0 py-2 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                value={parentExhibitorId}
                                onChange={(e) => setParentExhibitorId(e.target.value)}
                            />
                            <div className="flex gap-2 shrink-0">
                                {isScoped && (
                                    <button type="button" className="btn btn-ghost btn-sm" onClick={handleClearParentFilter}>
                                        Clear
                                    </button>
                                )}
                                <button type="submit" className="btn btn-secondary btn-sm" disabled={loading}>
                                    Apply
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => fetchReport(appliedParentId)}
                                    disabled={loading}
                                    title="Refresh"
                                    aria-label="Refresh report"
                                >
                                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </form>

                        {isScoped && (
                            <p className="text-xs text-text-tertiary m-0">
                                Nested metrics scoped to parent #{appliedParentId}
                            </p>
                        )}

                        {error && (
                            <div className="py-2 flex items-start gap-2 text-red-700 text-sm">
                                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {loading && !report ? (
                            <div>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <SkeletonRow key={i} />
                                ))}
                            </div>
                        ) : report ? (
                            <div className="relative">
                                {loading && (
                                    <div className="absolute top-0 right-0 z-10">
                                        <Loader2 size={14} className="animate-spin text-accent" />
                                    </div>
                                )}
                                <div>
                                    <MetricRow
                                        label="Parent exhibitors"
                                        value={formatNumber(report.parent_exhibitor_count)}
                                        hint="Event-wide"
                                    />
                                    <MetricRow
                                        label="Co-exhibitors"
                                        value={formatNumber(report.co_exhibitor_count)}
                                        hint="Event-wide"
                                    />
                                    <MetricRow
                                        label="Handover companies"
                                        value={formatNumber(report.handover_details?.company_count)}
                                        hint={`${formatNumber(report.handover_details?.marked_handed_over_count)} marked handed over`}
                                        progressDone={report.handover_details?.company_count}
                                        progressTotal={report.parent_exhibitor_count}
                                    />
                                    <MetricRow
                                        label="Water coupons"
                                        value={formatNumber(report.water_coupon?.water_coupon)}
                                        hint={`${formatNumber(report.water_coupon?.company_count)} companies`}
                                        progressDone={report.water_coupon?.company_count}
                                        progressTotal={report.parent_exhibitor_count}
                                    />
                                    <MetricRow
                                        label="Print badges"
                                        value={formatNumber(report.print_badge?.print_badge_count)}
                                        hint={`${formatNumber(report.print_badge?.company_count)} companies`}
                                    />
                                </div>
                            </div>
                        ) : hasFetched ? null : (
                            <p className="text-sm text-text-tertiary m-0 py-2">Expand to load report metrics.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyComprehensiveReportPanel;
