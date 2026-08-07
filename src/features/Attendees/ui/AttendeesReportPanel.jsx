import { useMemo, useState } from 'react';
import { AlertCircle, BarChart3, ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import useAttendeesReport from '../hooks/useAttendeesReport';
import { formatReportNumber } from '../domain/reportChart';
import AttendeesReportCharts from './AttendeesReportCharts';

const SkeletonRow = () => (
    <div className="flex items-center justify-between gap-6 py-2.5 border-b border-border last:border-b-0">
        <div className="animate-pulse h-3.5 w-36 rounded bg-bg-tertiary" />
        <div className="animate-pulse h-3.5 w-12 rounded bg-bg-tertiary" />
    </div>
);

const SourceToggle = ({ source, onChange, disabled }) => (
    <div className="flex items-center gap-1 p-0.5 bg-bg-secondary border border-border rounded-md">
        {['es', 'db'].map((value) => (
            <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => onChange(value)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    source === value
                        ? 'bg-white text-accent shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                }`}
            >
                {value === 'es' ? 'Elasticsearch' : 'Postgres'}
            </button>
        ))}
    </div>
);

const AttendeesReportPanel = ({ eventId, token, filters = {} }) => {
    const [expanded, setExpanded] = useState(false);
    const filtersKey = JSON.stringify(filters);
    const stableFilters = useMemo(() => JSON.parse(filtersKey), [filtersKey]);
    const {
        source,
        setSource,
        report,
        loading,
        error,
        hasFetched,
        fetchReport,
    } = useAttendeesReport({
        eventId,
        token,
        filters: stableFilters,
        enabled: expanded,
    });

    const typeCount = report?.attendee_types?.length ?? 0;

    return (
        <div className="mb-6 border border-border bg-bg-primary overflow-hidden animate-fade-in">
            <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-bg-secondary/50 transition-colors text-left"
                aria-expanded={expanded}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <BarChart3 size={16} className="text-accent shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary m-0">Attendees Report</p>
                        <p className="text-xs text-text-tertiary m-0 truncate">
                            Registered badge counts per attendee type, plus event total
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {!expanded && report && (
                        <span className="hidden sm:inline text-xs text-text-tertiary tabular-nums">
                            {formatReportNumber(report.total)} total · {typeCount} types
                        </span>
                    )}
                    <ChevronDown
                        size={18}
                        className={`text-text-tertiary transition-transform duration-200 ${
                            expanded ? 'rotate-180' : ''
                        }`}
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <SourceToggle
                                source={source}
                                onChange={setSource}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm self-end sm:self-auto"
                                onClick={fetchReport}
                                disabled={loading}
                                title="Refresh"
                                aria-label="Refresh report"
                            >
                                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {error && (
                            <div className="py-2 flex items-start gap-2 text-red-700 text-sm">
                                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {loading && !report ? (
                            <div>
                                {[1, 2, 3, 4].map((i) => (
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
                                <AttendeesReportCharts report={report} />
                                {report.source && (
                                    <p className="text-xs text-text-tertiary m-0 mt-3">
                                        Source: {report.source}
                                    </p>
                                )}
                            </div>
                        ) : hasFetched ? null : (
                            <p className="text-sm text-text-tertiary m-0 py-2">
                                Expand to load report metrics.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendeesReportPanel;
