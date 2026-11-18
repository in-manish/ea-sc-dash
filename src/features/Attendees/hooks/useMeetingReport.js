import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { meetingReportApi } from '../api/meetingReportApi';
import { DEFAULT_RECIPIENTS, myAddress, recipientFields, validateRecipients } from '../domain/reportRecipients';
import { downloadBlob } from '../../../utils/downloadBlob';
export const MAX_DOWNLOAD_ATTENDEES = 50; // same limit as EA; bigger selections go by email

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

const initialForm = (count) => ({
    mode: count > MAX_DOWNLOAD_ATTENDEES ? 'email' : 'download',
    cumulative: true,
    ...DEFAULT_RECIPIENTS,
});

/** What still blocks the action ('' = ready). Shown in the dialog before clicking. */
export function meetingReportProblem(form, count, me) {
    if (form.mode === 'download' && count > MAX_DOWNLOAD_ATTENDEES) {
        return `Download works for up to ${MAX_DOWNLOAD_ATTENDEES} attendees at a time. Choose "Send by email" for these ${count}.`;
    }
    return form.mode === 'email' ? validateRecipients(form, me) : '';
}

/**
 * "Meeting report" for the selection: download the PDFs (one attendee → PDF, more → zip or one combined PDF),
 * or email them — each attendee their own PDF and/or custom addresses everyone's (default: your login email).
 * Includes confirmed meetings, agenda and pending requests; attendees with no meetings get a PDF saying so.
 */
export default function useMeetingReport({ eventId, token, selection }) {
    const { user } = useAuth();
    const me = myAddress(user);
    const [, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const target = meetingReportTarget(selection);
    const [form, setForm] = useState(() => initialForm(target.count));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const isSingle = selection.selectionMode === 'selected' && target.regIds.length === 1;
    const update = (changes) => setForm((current) => ({ ...current, ...changes }));

    const open = () => {
        setForm(initialForm(target.count));
        setError('');
        setResult(null);
        setIsOpen(true);
    };
    const close = () => {
        if (!busy) setIsOpen(false);
    };

    const download = async () => {
        const { blob, filename } = isSingle
            ? await meetingReportApi.downloadSingle(eventId, token, target.regIds[0])
            : await meetingReportApi.download(eventId, token, { regIds: target.regIds, cumulative: form.cumulative });
        downloadBlob(blob, filename);
        setResult({ downloaded: true, filename });
    };

    const email = async () => {
        const fields = recipientFields(form, me);
        const data = await meetingReportApi.email(eventId, token, {
            regIds: target.regIds, cumulative: form.cumulative,
            sendToAttendee: fields.send_to_attendee, emails: fields.emails || [],
        });
        setResult({ emailed: true, ...data });
    };

    const run = async () => {
        const problem = meetingReportProblem(form, target.count, me);
        if (problem) return setError(problem);
        if (!eventId || !token || !target.regIds.length) return;
        setBusy(true);
        setError('');
        try {
            await (form.mode === 'download' ? download() : email());
        } catch (err) {
            setError(err.message || 'Failed to generate the meeting report.');
        } finally {
            setBusy(false);
        }
    };

    /** Close and show this send on the Attendees "Email log" tab, meeting reports. */
    const viewLog = () => {
        setIsOpen(false);
        setSearchParams((params) => {
            const next = new URLSearchParams(params);
            next.set('tab', 'card-emails');
            next.set('log_type', 'meetings');
            if (result?.batch_id) next.set('send', String(result.batch_id));
            ['status', 'log_search'].forEach((key) => next.delete(key));
            return next;
        });
    };

    const selectedAttendees = selection.selectionMode === 'selected' ? selection.selectedAttendees || [] : null;
    const problem = meetingReportProblem(form, target.count, me);

    return {
        isOpen, open, close, run, busy, error, result, form, update, target, isSingle, viewLog, me, selectedAttendees,
        problem,
    };
}
