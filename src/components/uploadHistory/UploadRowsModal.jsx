import { Download, X } from 'lucide-react';
import { formatCsvValue } from '../../utils/csvExport';

/** Union of every field present across the rows, in first-seen order. */
function pickColumns(rows) {
    const seen = [];
    const present = new Set();
    rows.forEach((row) => {
        Object.keys(row).forEach((key) => {
            if (!present.has(key)) {
                present.add(key);
                seen.push(key);
            }
        });
    });
    return seen;
}

const formatColumnLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function formatCell(value) {
    if (value === null || value === undefined || value === '') return '-';
    const text = formatCsvValue(value);
    return text === '' ? '-' : text;
}

function rowKey(row, idx) {
    return row.reg_id ?? row.uuid ?? row.company_id ?? row.obf_number ?? idx;
}

/** Modal listing the rows behind a Total/Success/Error count, with CSV download. */
export default function UploadRowsModal({ title, rows, onClose, onDownload }) {
    const columns = pickColumns(rows);

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1300] animate-fade-in" onClick={onClose}>
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[94%] max-w-[900px] max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-border flex items-center justify-between bg-bg-secondary">
                    <div>
                        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
                        <p className="text-xs text-text-secondary mt-0.5">{rows.length} record{rows.length === 1 ? '' : 's'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={onDownload} className="btn btn-secondary btn-sm gap-1.5" disabled={rows.length === 0}>
                            <Download size={13} /> Download CSV
                        </button>
                        <button
                            type="button"
                            className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                            onClick={onClose}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-auto flex-1">
                    {rows.length === 0 ? (
                        <div className="text-center py-16 text-text-secondary text-sm">No records to show.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col}
                                            className="sticky top-0 bg-bg-secondary py-2.5 px-4 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border whitespace-nowrap"
                                        >
                                            {formatColumnLabel(col)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={rowKey(row, idx)} className="border-b border-border last:border-b-0 hover:bg-bg-secondary/40">
                                        {columns.map((col) => (
                                            <td key={col} className="py-2 px-4 text-sm text-text-primary max-w-[240px]">
                                                {formatCell(row[col])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
