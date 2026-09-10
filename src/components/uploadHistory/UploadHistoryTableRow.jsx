import { formatApiDateTime } from '../../utils/formatApiDateTime';
import { formatProcessingTime } from '../../utils/formatProcessingTime';
import UploadCountCell from './UploadCountCell';
import { uploadRowBuckets } from './uploadRowBuckets';

/** One history table row: type, id, total/success/error counts, timestamps. */
export default function UploadHistoryTableRow({ rec, rowId, typeLabel, filenamePrefix, onView }) {
    const { successRows, rejectedRows, allRows, totalCount } = uploadRowBuckets(rec);

    return (
        <tr className="group border-b border-border last:border-b-0 hover:bg-bg-secondary/40 transition-colors">
            <td className="py-3 px-6 text-sm text-text-primary">{typeLabel || '-'}</td>
            <td className="py-3 px-6 text-sm font-mono text-text-secondary">{rowId}</td>
            <UploadCountCell
                count={totalCount}
                rows={allRows}
                filenamePrefix={`${filenamePrefix}_${rowId}_all`}
                colorClass="bg-blue-600 hover:bg-blue-700"
                onView={() => onView({ title: `Upload ${rowId} — All records`, rows: allRows })}
            />
            <UploadCountCell
                count={successRows.length}
                rows={successRows}
                filenamePrefix={`${filenamePrefix}_${rowId}_success`}
                colorClass="bg-emerald-600 hover:bg-emerald-700"
                onView={() => onView({ title: `Upload ${rowId} — Successful records`, rows: successRows })}
            />
            <UploadCountCell
                count={rejectedRows.length}
                rows={rejectedRows}
                filenamePrefix={`${filenamePrefix}_${rowId}_errors`}
                colorClass="bg-red-500 hover:bg-red-600"
                onView={() => onView({ title: `Upload ${rowId} — Rejected records`, rows: rejectedRows })}
            />
            <td className="py-3 px-6 text-sm text-text-secondary whitespace-nowrap">
                {formatApiDateTime(rec.uploaded_on)}
            </td>
            <td className="py-3 px-6 text-sm text-text-secondary">
                {formatProcessingTime(rec.processing_time)}
            </td>
        </tr>
    );
}
