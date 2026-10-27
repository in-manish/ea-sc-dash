import { useState } from 'react';
import { meetingReportApi } from '../api/meetingReportApi';
import { downloadBlob } from '../../../utils/downloadBlob';

/**
 * Which reg ids the EA meeting-report export can take for the current selection.
 * EA only knows reg ids (or '*' = whole event); it cannot apply our search, so "all matching" is unsupported.
 */
export function meetingReportTarget({ selectionMode, selectedAttendees = [], total }) {
    if (selectionMode === 'selected') {
        const regIds = selectedAttendees.map((a) => a.reg_id).filter((id) => id != null && id !== '');
        return { regIds, count: regIds.length, missing: selectedAttendees.length - regIds.length };
    }
    if (selectionMode === 'all') return { regIds: ['*'], count: total, missing: 0 };
    return { regIds: [], count: 0, missing: 0, unsupported: true };
}

/** "Meeting report" for the selection: one attendee → PDF download, more → PDFs emailed by EA. */
export default function useMeetingReport({ eventId, token, selection }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cumulative, setCumulative] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const target = meetingReportTarget(selection);
    const isSingle = selection.selectionMode === 'selected' && target.regIds.length === 1;

    const open = () => {
        setCumulative(true);
        setError('');
        setResult(null);
        setIsOpen(true);
    };

    const close = () => {
        if (!busy) setIsOpen(false);
    };

    const run = async () => {
        if (!eventId || !token || !target.regIds.length) return;
        setBusy(true);
        setError('');
        try {
            if (isSingle) {
                const { blob, filename } = await meetingReportApi.downloadSingle(eventId, token, target.regIds[0]);
                downloadBlob(blob, filename);
                setResult({ downloaded: true, filename });
            } else {
                const response = await meetingReportApi.emailMultiple(eventId, token, {
                    regIds: target.regIds,
                    cumulative,
                });
                setResult({ emailed: true, message: response?.msg });
            }
        } catch (err) {
            setError(err.message || 'Failed to generate the meeting report.');
        } finally {
            setBusy(false);
        }
    };

    return { isOpen, open, close, run, busy, error, result, cumulative, setCumulative, target, isSingle };
}
