import { X, FileText, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { emailCount, emailPlan, nameList } from '../domain/reportRecipients';
import { ModePicker } from './CardExportFields';
import ReportActionSummary from './ReportActionSummary';
import ReportRecipientPicker from './ReportRecipientPicker';

const REPORT = { one: 'meeting report', many: 'meeting reports' };
const CONTENT_NOTE = 'Each PDF lists confirmed meetings, agenda sessions and pending meeting requests. '
    + 'Attendees with no meetings are included and their PDF says so.';

const Choice = ({ checked, onChange, title, text }) => (
    <label className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer ${checked ? 'border-accent bg-bg-secondary' : 'border-border'}`}>
        <input type="radio" className="mt-1" checked={checked} onChange={onChange} />
        <span className="text-sm">
            <span className="font-semibold text-text-primary block">{title}</span>
            <span className="text-text-secondary">{text}</span>
        </span>
    </label>
);

const BundlePicker = ({ form, update, count, forEmail }) => (
    <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            {forEmail ? 'How should you / other people get the reports?' : 'How should the file look?'}
        </span>
        <Choice checked={form.cumulative} onChange={() => update({ cumulative: true })}
            title="One combined PDF" text={`All ${count} reports in one PDF, one attendee per page.`} />
        <Choice checked={!form.cumulative} onChange={() => update({ cumulative: false })}
            title="A ZIP with one PDF per attendee" text="Separate files, named by reg ID and name." />
    </div>
);

function plan(report) {
    const { form, target, isSingle, me, selectedAttendees } = report;
    const count = target.count;
    if (form.mode === 'download') {
        const who = isSingle ? nameList(selectedAttendees) || 'the attendee' : null;
        return [
            isSingle ? `Your browser downloads the meeting report of ${who} as a PDF.`
                : form.cumulative ? `Your browser downloads one PDF with all ${count} meeting reports.`
                    : `Your browser downloads a ZIP with ${count} PDFs, one per attendee.`,
            'No email is sent to anyone.',
        ];
    }
    const bundle = form.cumulative ? 'in one combined PDF' : 'as a ZIP of PDFs';
    return emailPlan({ form, me, count, attendees: selectedAttendees, report: REPORT, bundle });
}

function actionLabel(report) {
    const { form, isSingle, target, me } = report;
    if (form.mode === 'download') return isSingle || form.cumulative ? 'Download PDF' : 'Download ZIP';
    const n = emailCount(form, me, target.count);
    return n ? `Send ${n} email${n === 1 ? '' : 's'}` : 'Send email';
}

const Form = ({ report }) => {
    const { form, update, isSingle, target, me, selectedAttendees, problem } = report;
    const count = target.count;
    const peopleGetEveryone = form.sendToMe || form.sendToOthers;
    const showBundle = !isSingle && (form.mode === 'download' || peopleGetEveryone);
    return (
        <div className="flex flex-col gap-5">
            <ModePicker form={form} update={update} />
            {form.mode === 'email' && (
                <ReportRecipientPicker form={form} update={update} me={me} report={REPORT} count={count}
                    attendeeHint={isSingle ? nameList(selectedAttendees) : null} />
            )}
            {showBundle && <BundlePicker form={form} update={update} count={count} forEmail={form.mode === 'email'} />}
            <ReportActionSummary
                problem={problem}
                lines={plan(report)}
                notes={form.mode === 'email'
                    ? ['Emails are sent in the background, usually within a minute. Track each one in Attendees → Email log → Meeting reports.', CONTENT_NOTE]
                    : [CONTENT_NOTE]}
            />
            {target.missing > 0 && (
                <p className="text-xs text-text-tertiary">{target.missing} selected attendee(s) without a Reg ID are left out.</p>
            )}
        </div>
    );
};

const Result = ({ result }) => (
    <div className="flex items-start gap-2 text-sm text-text-primary">
        <CheckCircle2 size={18} className="text-status-success shrink-0 mt-0.5" />
        {result.downloaded ? (
            <span>Downloaded <b>{result.filename}</b>. No email was sent.</span>
        ) : (
            <span>
                Sending meeting reports for {result.attendees} attendee{result.attendees === 1 ? '' : 's'}
                {result.send_to_attendee && ' (each attendee gets only their own)'}
                {result.emails?.length > 0 && <> and all reports to <b>{result.emails.join(', ')}</b></>}.
                {' '}Check delivery in the Email log.
            </span>
        )}
    </div>
);

const MeetingReportDialog = ({ report }) => {
    const { target, busy, error, result, close, run, viewLog, problem, isSingle, selectedAttendees } = report;
    const count = target.count;
    const subtitle = isSingle && nameList(selectedAttendees) ? nameList(selectedAttendees) : `${count} attendee${count === 1 ? '' : 's'} selected`;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <FileText size={20} />
                            <h2 className="text-lg font-bold">Meeting report</h2>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
                    </div>
                    <button onClick={close} className="text-text-tertiary hover:text-text-primary" aria-label="Close"><X size={20} /></button>
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
                            <button type="button" onClick={run} disabled={busy || Boolean(problem)} title={problem || undefined}
                                className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {busy && <Loader2 size={16} className="animate-spin" />}
                                {actionLabel(report)}
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
