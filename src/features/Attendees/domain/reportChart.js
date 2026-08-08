export const formatReportNumber = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    return Number(value).toLocaleString();
};

/** Distinct fills for pie / legend (works with light theme accent). */
export const REPORT_CHART_COLORS = [
    'var(--color-accent, #7c3aed)',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#6366f1',
    '#14b8a6',
    '#ec4899',
    '#84cc16',
    '#a855f7',
];

export const chartColorAt = (index) =>
    REPORT_CHART_COLORS[index % REPORT_CHART_COLORS.length];
