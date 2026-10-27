import { useEffect, useState } from 'react';
import { Check, Copy, Users } from 'lucide-react';
import { formatApiDateTime } from '../../utils/formatApiDateTime';
import { formatProcessingTime } from '../../utils/formatProcessingTime';
import UploadCountCell from './UploadCountCell';
import { uploadRowBuckets } from './uploadRowBuckets';

function CopyUploadIdButton({ uploadId }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;
        const timer = setTimeout(() => setCopied(false), 1500);
        return () => clearTimeout(timer);
    }, [copied]);

    const copy = async () => {
        const text = String(uploadId ?? '');
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const area = document.createElement('textarea');
            area.value = text;
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            document.body.removeChild(area);
        }
        setCopied(true);
    };

    return (
        <button
            type="button"
            onClick={copy}
            title={copied ? 'Copied' : 'Copy upload ID'}
            aria-label={copied ? `Copied ${uploadId}` : `Copy upload ID ${uploadId}`}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-bg-primary text-text-secondary cursor-pointer hover:bg-bg-secondary hover:text-accent"
        >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
        </button>
    );
}

/** One history table row: type, id, total/success/error counts, timestamps. */
export default function UploadHistoryTableRow({ rec, rowId, typeLabel, filenamePrefix, onView, onOpenAttendees }) {
    const { successRows, rejectedRows, allRows, totalCount } = uploadRowBuckets(rec);

    return (
        <tr className="group border-b border-border last:border-b-0 hover:bg-bg-secondary/40 transition-colors">
            <td className="py-3 px-6 text-sm text-text-primary">{typeLabel || '-'}</td>
            <td className="py-3 px-6 text-sm">
                {onOpenAttendees ? (
                    <span className="inline-flex items-center gap-2">
                        <button
                            type="button"
                            className="font-mono text-accent bg-transparent border-none p-0 cursor-pointer hover:underline"
                            title="View attendees from this upload"
                            onClick={() => onOpenAttendees(rowId)}
                        >
                            {rowId}
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-bg-primary text-accent cursor-pointer hover:bg-bg-secondary"
                            title="View attendees from this upload"
                            aria-label={`View attendees for upload ${rowId}`}
                            onClick={() => onOpenAttendees(rowId)}
                        >
                            <Users size={14} />
                        </button>
                        <CopyUploadIdButton uploadId={rowId} />
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2">
                        <span className="font-mono text-text-secondary">{rowId}</span>
                        <CopyUploadIdButton uploadId={rowId} />
                    </span>
                )}
            </td>
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
