import { useEffect, useState } from 'react';
import { Check, Copy, MapPin } from 'lucide-react';
import { chartColorAt, formatReportNumber } from '../../features/Attendees/domain/reportChart';

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 88;

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

export function gateScanRows(counts) {
    return Object.entries(counts || {})
        .map(([name, count]) => ({ name: String(name), count: Number(count) || 0 }))
        .filter((row) => row.name)
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function formatGateScanStats(counts, nameHeader = 'Gate', countHeader = 'Scanned') {
    const rows = gateScanRows(counts);
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const lines = [`${nameHeader}\t${countHeader}\tShare`];
    rows.forEach((row) => {
        const percent = total > 0 ? Math.round((row.count / total) * 100) : 0;
        lines.push(`${row.name}\t${row.count}\t${percent}%`);
    });
    lines.push(`Total\t${total}\t100%`);
    return lines.join('\n');
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const done = document.execCommand('copy');
        document.body.removeChild(area);
        return done;
    }
}

/** Pie plus a full-name legend for a `{ name: count }` map. */
const GateScanPieChart = ({
    counts,
    title = 'Attendees scanned by gate',
    nameHeader = 'Gate',
    countHeader = 'Scanned',
    icon: Icon = MapPin,
}) => {
    const rows = gateScanRows(counts);
    const total = rows.reduce((sum, row) => sum + row.count, 0);
    const maxCount = rows.reduce((max, row) => Math.max(max, row.count), 0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    if (rows.length === 0) return null;

    let angle = 0;
    const arcs = rows.flatMap((row) => {
        if (row.count <= 0 || total <= 0) return [];
        const sweep = (row.count / total) * 360;
        const start = angle;
        const end = angle + sweep;
        angle = end;
        return [{ ...row, start, end }];
    });

    const copyStats = async () => {
        const ok = await copyText(formatGateScanStats(counts, nameHeader, countHeader));
        if (ok) setCopied(true);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-text-primary m-0 flex items-center gap-2 min-w-0">
                    <Icon size={16} className="text-accent shrink-0" />
                    <span>{title}</span>
                </h3>
                <button
                    type="button"
                    onClick={copyStats}
                    className="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border border-border text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                >
                    {copied ? <Check size={13} className="text-green-700" /> : <Copy size={13} />}
                    {copied ? 'Copied' : 'Copy stats'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-6">
                <svg
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    role="img"
                    aria-label={title}
                    className="shrink-0 mx-auto lg:mx-0"
                >
                    {arcs.length === 0 ? (
                        <circle cx={CX} cy={CY} r={R} fill="var(--color-bg-tertiary, #f1f5f9)" />
                    ) : (
                        arcs.map((arc) => {
                            const index = rows.findIndex((row) => row.name === arc.name);
                            const percent = total > 0 ? Math.round((arc.count / total) * 100) : 0;
                            return (
                                <path
                                    key={arc.name}
                                    d={slicePath(CX, CY, R, arc.start, arc.end)}
                                    fill={chartColorAt(index)}
                                    className="transition-opacity hover:opacity-90"
                                >
                                    <title>
                                        {arc.name}: {formatReportNumber(arc.count)} ({percent}%)
                                    </title>
                                </path>
                            );
                        })
                    )}
                </svg>

                <ul className="m-0 p-0 list-none flex flex-col gap-3 min-w-0 flex-1 w-full">
                    {rows.map((row, index) => {
                        const percent = total > 0 ? Math.round((row.count / total) * 100) : 0;
                        const bar = maxCount > 0 ? (row.count / maxCount) * 100 : 0;
                        return (
                            <li key={row.name} className="min-w-0">
                                <div className="flex items-start gap-2">
                                    <span
                                        className="w-2.5 h-2.5 rounded-sm shrink-0 mt-1"
                                        style={{ backgroundColor: chartColorAt(index) }}
                                        aria-hidden
                                    />
                                    <span className="text-sm font-medium text-text-primary break-words flex-1 min-w-0 leading-snug">
                                        {row.name}
                                    </span>
                                    <span className="tabular-nums text-sm text-text-primary font-semibold shrink-0">
                                        {formatReportNumber(row.count)}
                                    </span>
                                    <span className="tabular-nums text-xs text-text-tertiary w-10 text-right shrink-0 pt-0.5">
                                        {percent}%
                                    </span>
                                </div>
                                <div className="mt-1.5 ml-4 h-1.5 rounded-full bg-bg-secondary overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${bar}%`, backgroundColor: chartColorAt(index) }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                    <li className="flex items-center gap-2 text-sm pt-2 mt-1 border-t border-border">
                        <span className="text-text-primary font-medium flex-1">Total</span>
                        <span className="tabular-nums text-text-primary font-bold shrink-0">
                            {formatReportNumber(total)}
                        </span>
                        <span className="w-10 shrink-0" aria-hidden />
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default GateScanPieChart;
