import { X, FileText, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { describeRecipients } from '../domain/cardExportRequest';
import { MAX_DOWNLOAD_ATTENDEES } from '../hooks/useMeetingReport';
import { ModePicker, RecipientFields } from './CardExportFields';

const LAYOUTS = [
    { value: true, title: 'One combined PDF', text: 'All selected attendees in a single file.' },
    { value: false, title: 'One PDF per attendee', text: 'A separate file for each attendee, in a zip.' },
];

const Choice = ({ checked, onChange, title, text }) => (
    <label className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer ${checked ? 'border-accent bg-bg-secondary' : 'border-border'}`}>
        <input type="radio" className="mt-1" checked={checked} onChange={onChange} />
        <span className="text-sm">
            <span className="font-semibold text-text-primary block">{title}</span>
            <span className="text-text-secondary">{text}</span>
        </span>
    </label>
);

const Result = ({ result }) => (
    <div className="flex items-start gap-2 text-sm text-text-primary">
        <CheckCircle2 size={18} className="text-status-success shrink-0 mt-0.5" />
        <span>
            {result.downloaded
                ? `Downloaded ${result.filename}.`
                : `Sending meeting reports for ${result.attendees} attendee${result.attendees === 1 ? '' : 's'} to ${describeRecipients({
                    sendToAttendee: result.send_to_attendee,
                    emailsText: (result.emails || []).join(','),
                })}. Attendees with no meetings get a report saying so.`}
        </span>
    </div>
);

const Form = ({ report }) => {
    const { form, update, isSingle, target } = report;
    const tooManyToDownload = target.count > MAX_DOWNLOAD_ATTENDEES;
    // Combined vs one-per-attendee matters for a download, and for email only when addresses get everyone's reports
    // (typed addresses, or your login email when not sending to attendees).
    const customGetsReports = Boolean(form.emailsText.trim()) || !form.sendToAttendee;
    const showLayout = !isSingle && (form.mode === 'download' || customGetsReports);
    return (
        <div className="flex flex-col gap-5">
            <ModePicker form={form} update={update} />
            {form.mode === 'download' && tooManyToDownload && (
                <p className="text-sm text-amber-700">Download works for up to {MAX_DOWNLOAD_ATTENDEES} attendees. Use Email for this selection.</p>
            )}
            {form.mode === 'email' && (
                <RecipientFields
                    form={form}
                    update={update}
                    ownLabel="meeting report"
                    customHint="These addresses get every selected attendee's meeting report."
                />
            )}
            {showLayout && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                        {form.mode === 'download' ? 'File' : 'File for these addresses'}
                    </span>
                    {LAYOUTS.map((layout) => (
                        <Choice
                            key={layout.title}
                            checked={form.cumulative === layout.value}
                            onChange={() => update({ cumulative: layout.value })}
                            title={layout.title}
                            text={layout.text}
                        />
                    ))}
                </div>
            )}
            {form.mode === 'email' && <p className="text-sm text-text-secondary">Will send to {describeRecipients(form)}.</p>}
            <p className="text-xs text-text-tertiary">
                The PDF lists confirmed meetings, agenda sessions and pending meeting requests. Attendees with no meetings are included and their report says so.
            </p>
            {target.missing > 0 && (
                <p className="text-xs text-text-tertiary">{target.missing} selected attendee(s) without a Reg ID are left out.</p>
            )}
        </div>
    );
};

const MeetingReportDialog = ({ report }) => {
    const { target, busy, error, result, close, run, form, viewLog } = report;
    const count = target.count;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <FileText size={20} />
                            <h2 className="text-lg font-bold">Meeting report</h2>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{count} attendee{count === 1 ? '' : 's'} selected.</p>
                    </div>
                    <button onClick={close} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {result ? <Result result={result} /> : <Form report={report} />}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 text-red-800 p-3 border border-red-200 rounded-md mt-4 text-sm">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                    {result ? (
                        <>
                            {result.emailed && <button type="button" className="btn btn-secondary" onClick={viewLog}>View email log</button>}
                            <button type="button" className="btn btn-primary" onClick={close}>Done</button>
                        </>
                    ) : (
                        <>
                            <button type="button" className="btn btn-secondary" onClick={close} disabled={busy}>Cancel</button>
                            <button type="button" onClick={run} disabled={busy} className="btn btn-primary flex items-center gap-2 disabled:opacity-50">
                                {busy && <Loader2 size={16} className="animate-spin" />}
                                {form.mode === 'download' ? 'Download' : 'Send email'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const MeetingReportModal = ({ report }) => (report.isOpen ? <MeetingReportDialog report={report} /> : null);

export default MeetingReportModal;
