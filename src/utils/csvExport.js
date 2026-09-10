import { downloadBlob } from './downloadBlob';

const escapeCsv = (value) => {
    const s = value === null || value === undefined ? '' : formatCsvValue(value);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function formatCsvValue(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

export function objectsToCsv(rows) {
    if (!rows.length) return '';
    const cols = Array.from(rows.reduce((set, row) => {
        Object.keys(row).forEach((k) => set.add(k));
        return set;
    }, new Set()));
    const header = cols.join(',');
    const body = rows.map((row) => cols.map((c) => escapeCsv(row[c])).join(',')).join('\n');
    return `${header}\n${body}`;
}

export function downloadCsv(rows, filename) {
    const content = objectsToCsv(rows);
    if (!content) return;
    downloadBlob(new Blob([content], { type: 'text/csv;charset=utf-8;' }), filename);
}
