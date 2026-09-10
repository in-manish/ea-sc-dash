import { Download, Eye } from 'lucide-react';
import { downloadCsv } from '../../utils/csvExport';

/** Count plus hover View / Download actions for an upload history column. */
export default function UploadCountCell({ count, rows, filenamePrefix, colorClass, onView }) {
    return (
        <td className="py-3 px-6 text-sm text-text-primary">
            <div className="flex items-center gap-2">
                <span>{count}</span>
                {rows.length > 0 && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={onView}
                            className="inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-medium bg-bg-tertiary text-text-secondary hover:bg-border"
                        >
                            <Eye size={11} /> View
                        </button>
                        <button
                            type="button"
                            onClick={() => downloadCsv(rows, `${filenamePrefix}.csv`)}
                            className={`inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-medium text-white ${colorClass}`}
                        >
                            <Download size={11} /> Download
                        </button>
                    </div>
                )}
            </div>
        </td>
    );
}
