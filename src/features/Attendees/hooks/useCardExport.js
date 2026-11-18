import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cardExportApi } from '../api/cardExportApi';
import {
    buildCardExportBody,
    eventDateWindow,
    loadCardFormats,
    saveCardFormats,
    validateCardExportForm,
} from '../domain/cardExportRequest';
import { meetingReportTarget } from './useMeetingReport';
import { downloadBlob } from '../../../utils/downloadBlob';

function initialForm(dateWindow) {
    return {
        mode: 'download',
        formats: loadCardFormats(),
        start: dateWindow.min,
        end: dateWindow.max,
        sendToAttendee: false,
        emailsText: '',
    };
}

/**
 * "Business cards" for the selection: download the cards each attendee exchanged (CSV / XLSX),
 * or email them to each attendee and/or custom addresses (default: your login email).
 * Uses reg ids like the meeting report: selected rows, or every attendee ('*').
 */
export default function useCardExport({ eventId, token, selection, event }) {
    const dateWindow = eventDateWindow(event);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(() => initialForm(dateWindow));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const [, setSearchParams] = useSearchParams();
    const target = meetingReportTarget(selection);
    const update = (changes) => setForm((current) => ({ ...current, ...changes }));
    const toggleFormat = (value) => {
        const formats = form.formats.includes(value)
            ? form.formats.filter((f) => f !== value)
            : [...form.formats, value];
        update({ formats });
        saveCardFormats(formats); // remembered for the next export (an empty pick is not saved)
    };

    const open = () => {
        setForm(initialForm(dateWindow));
        setError('');
        setResult(null);
        setIsOpen(true);
    };
    const close = () => {
        if (!busy) setIsOpen(false);
    };

    const run = async () => {
        const problem = validateCardExportForm({ ...form, dateWindow });
        if (problem) return setError(problem);
        if (!eventId || !token || !target.regIds.length) return;
        setBusy(true);
        setError('');
        try {
            const body = buildCardExportBody({ ...form, regIds: target.regIds });
            if (form.mode === 'download') {
                const { blob, filename } = await cardExportApi.download(eventId, token, body);
                downloadBlob(blob, filename);
                setResult({ downloaded: true, filename });
            } else {
                setResult({ emailed: true, ...(await cardExportApi.email(eventId, token, body)) });
            }
        } catch (err) {
            setError(err.message || 'Failed to export the business cards.');
        } finally {
            setBusy(false);
        }
    };

    /** Close and show this send on the Attendees "Card email log" tab (?tab=card-emails&send=<batch_id>). */
    const viewLog = () => {
        setIsOpen(false);
        setSearchParams((params) => {
            const next = new URLSearchParams(params);
            next.set('tab', 'card-emails');
            if (result?.batch_id) next.set('send', String(result.batch_id));
            next.delete('status');
            return next;
        });
    };

    return { isOpen, open, close, run, busy, error, result, form, update, toggleFormat, target, dateWindow, viewLog };
}
