import { chartColorAt, formatReportNumber } from '../domain/reportChart';

const CHART_HEIGHT = 160;

const AttendeesReportBarChart = ({ report }) => {
    const types = report?.attendee_types || [];
    if (types.length === 0) return null;

    const maxCount = Math.max(...types.map((t) => Number(t.count) || 0), 1);

    return (
        <div className="pt-1 pb-1 overflow-x-auto">
            <div
                className="flex items-end gap-2 sm:gap-3 min-w-max px-1"
                style={{ height: CHART_HEIGHT + 56 }}
                role="img"
                aria-label="Attendee type counts bar chart"
            >
                {types.map((row, i) => {
                    const count = Number(row.count) || 0;
                    const heightPx = Math.round((count / maxCount) * CHART_HEIGHT);
                    const name = row.attendee_type_name || '—';
                    const color = chartColorAt(i);

                    return (
                        <div
                            key={row.attendee_type_id ?? name}
                            className="flex flex-col items-center gap-1.5 w-14 sm:w-16 shrink-0"
                            title={`${name}: ${formatReportNumber(count)}`}
                        >
                            <span className="text-[11px] font-semibold text-text-primary tabular-nums leading-none">
                                {formatReportNumber(count)}
                            </span>
                            <div
                                className="w-full flex items-end rounded-t bg-bg-tertiary overflow-hidden"
                                style={{ height: CHART_HEIGHT }}
                            >
                                <div
                                    className="w-full rounded-t transition-all duration-300 ease-out hover:opacity-90"
                                    style={{
                                        height: Math.max(heightPx, count > 0 ? 4 : 0),
                                        backgroundColor: color,
                                    }}
                                />
                            </div>
                            <span
                                className="text-[10px] text-text-tertiary text-center leading-tight line-clamp-2 w-full"
                                title={name}
                            >
                                {name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendeesReportBarChart;
