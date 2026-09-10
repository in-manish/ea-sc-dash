import { AlertCircle, ArrowUpDown, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { downloadCsv } from '../../utils/csvExport';
import ListPagination from '../../features/Attendees/ui/ListPagination';
import UploadHistoryTableRow from './UploadHistoryTableRow';
import UploadRowsModal from './UploadRowsModal';

const THEAD_CLASS = 'bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border';

function Toolbar({ total, loading, onRefresh }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{total} upload{total === 1 ? '' : 's'}</span>
            <button type="button" onClick={onRefresh} disabled={loading} className="btn btn-secondary btn-sm gap-2">
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
            </button>
        </div>
    );
}

function TableBody({ loading, uploads, filenamePrefix, getRowId, getType, onView }) {
    if (loading) {
        return (
            <tr>
                <td colSpan={7} className="text-center p-12">
                    <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                </td>
            </tr>
        );
    }
    if (uploads.length === 0) {
        return (
            <tr>
                <td colSpan={7} className="text-center p-12 text-text-secondary">
                    No uploads found for this event yet.
                </td>
            </tr>
        );
    }
    return uploads.map((rec) => {
        const rowId = getRowId(rec);
        return (
            <UploadHistoryTableRow
                key={rowId}
                rec={rec}
                rowId={rowId}
                typeLabel={getType(rec)}
                filenamePrefix={filenamePrefix}
                onView={onView}
            />
        );
    });
}

/** Shared paginated CSV upload history table (attendee or company). */
export default function UploadHistoryTable({
    uploads,
    loading,
    error,
    total,
    page,
    hasNext,
    onRefresh,
    onPrev,
    onNext,
    onSortDate,
    typeColumnLabel,
    typeHeader,
    filenamePrefix,
    getRowId,
    getType,
}) {
    const [viewing, setViewing] = useState(null);

    return (
        <div className="space-y-4">
            <Toolbar total={total} loading={loading} onRefresh={onRefresh} />
            {error && (
                <div className="p-4 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-3 text-status-danger text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}
            <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className={THEAD_CLASS}>{typeHeader || typeColumnLabel}</th>
                            <th className={THEAD_CLASS}>Upload ID</th>
                            <th className={THEAD_CLASS}>Total Count</th>
                            <th className={THEAD_CLASS}>Success Count</th>
                            <th className={THEAD_CLASS}>Error</th>
                            <th className={THEAD_CLASS}>
                                <button
                                    type="button"
                                    onClick={onSortDate}
                                    className="flex items-center gap-1 bg-transparent border-none p-0 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                                >
                                    Date &amp; Time
                                    <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className={THEAD_CLASS}>Processing Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TableBody
                            loading={loading}
                            uploads={uploads}
                            filenamePrefix={filenamePrefix}
                            getRowId={getRowId}
                            getType={getType}
                            onView={setViewing}
                        />
                    </tbody>
                </table>
            </div>
            <ListPagination
                page={page}
                loading={loading}
                hasNext={hasNext}
                onPrev={onPrev}
                onNext={onNext}
            />
            {viewing && (
                <UploadRowsModal
                    title={viewing.title}
                    rows={viewing.rows}
                    onClose={() => setViewing(null)}
                    onDownload={() => downloadCsv(viewing.rows, `${viewing.title.replace(/[^a-z0-9]+/gi, '_')}.csv`)}
                />
            )}
        </div>
    );
}
