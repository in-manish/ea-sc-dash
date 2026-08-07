import { chartColorAt, formatReportNumber } from '../domain/reportChart';

const SIZE = 168;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 72;

const polar = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const slicePath = (cx, cy, r, startAngle, endAngle) => {
    const sweep = endAngle - startAngle;
    if (sweep >= 359.99) {
        return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
    }
    const start = polar(cx, cy, r, endAngle);
    const end = polar(cx, cy, r, startAngle);
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
};

const AttendeesReportPieChart = ({ report }) => {
    const types = report?.attendee_types || [];
    const total = Number(report?.total) || types.reduce((s, t) => s + (Number(t.count) || 0), 0);

    if (types.length === 0) return null;

    let angle = 0;
    const arcs = [];
    types.forEach((row, i) => {
        const count = Number(row.count) || 0;
        if (count <= 0) return;
        const sweep = total > 0 ? (count / total) * 360 : 0;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        arcs.push({
            ...row,
            count,
            start,
            end,
            color: chartColorAt(i),
            percent: total > 0 ? Math.round((count / total) * 100) : 0,
        });
    });

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 py-2">
            <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label="Attendee type share pie chart"
                className="shrink-0"
            >
                {total <= 0 || arcs.length === 0 ? (
                    <circle cx={CX} cy={CY} r={R} fill="var(--color-bg-tertiary, #f1f5f9)" />
                ) : (
                    arcs.map((arc) => (
                        <path
                            key={arc.attendee_type_id ?? arc.attendee_type_name}
                            d={slicePath(CX, CY, R, arc.start, arc.end)}
                            fill={arc.color}
                            className="transition-opacity hover:opacity-90"
                        >
                            <title>
                                {arc.attendee_type_name}: {formatReportNumber(arc.count)} ({arc.percent}%)
                            </title>
                        </path>
                    ))
                )}
            </svg>

            <ul className="m-0 p-0 list-none flex flex-col gap-1.5 min-w-0 flex-1">
                {types.map((row, i) => {
                    const count = Number(row.count) || 0;
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    const name = row.attendee_type_name || '—';
                    return (
                        <li
                            key={row.attendee_type_id ?? name}
                            className="flex items-center gap-2 text-xs min-w-0"
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-sm shrink-0"
                                style={{ backgroundColor: chartColorAt(i) }}
                                aria-hidden
                            />
                            <span className="text-text-secondary truncate flex-1" title={name}>
                                {name}
                            </span>
                            <span className="tabular-nums text-text-primary font-medium shrink-0">
                                {formatReportNumber(count)}
                            </span>
                            <span className="tabular-nums text-text-tertiary w-8 text-right shrink-0">
                                {percent}%
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AttendeesReportPieChart;
