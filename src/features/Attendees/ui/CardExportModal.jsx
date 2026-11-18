import { X, Contact, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { emailCount, emailPlan, nameList } from '../domain/reportRecipients';
import { DateRangePicker, FormatPicker, ModePicker } from './CardExportFields';
import ReportActionSummary from './ReportActionSummary';
import ReportRecipientPicker from './ReportRecipientPicker';

const REPORT = { one: 'business cards', many: "attendees' business cards" };
const day = (value) => (value ? value.split('-').reverse().join('-') : '');

function rangeText(form, dateWindow) {
    const start = form.start || dateWindow.min;
    const end = form.end || dateWindow.max;
    return start || end ? `saved ${day(start) || 'any time'} to ${day(end) || 'any time'} (event time)` : 'saved at any time';
}

function plan(report) {
    const { form, target, me, selectedAttendees, dateWindow } = report;
    const count = target.count;
    const formats = form.formats.map((f) => f.toUpperCase()).join(' and ');
    if (form.mode === 'download') {
        const oneFile = count === 1 && form.formats.length === 1;
        const who = count === 1 ? nameList(selectedAttendees) || 'the attendee' : null;
        return [
            oneFile ? `Your browser downloads the business cards of ${who} as a ${formats} file.`
                : `Your browser downloads a ZIP with ${formats} file${form.formats.length > 1 ? 's' : ''} for each attendee.`,
            `Only cards ${rangeText(form, dateWindow)} are included. Attendees with no such cards are left out.`,
            'No email is sent to anyone.',
        ];
    }
    const bundle = `as a ZIP (${formats}, one file per attendee)`;
    return emailPlan({ form, me, count, attendees: selectedAttendees, report: REPORT, bundle });
}

function actionLabel(report) {
    const { form, target, me } = report;
    if (form.mode === 'download') {
        return target.count === 1 && form.formats.length === 1 ? `Download ${form.formats[0].toUpperCase()}` : 'Download ZIP';
    }
    const n = emailCount(form, me, target.count);
    return n ? `Send ${n} email${n === 1 ? '' : 's'}` : 'Send email';
}

const Form = ({ report }) => {
    const { form, update, toggleFormat, dateWindow, target, me, selectedAttendees, problem } = report;
    const emailNotes = [
        `Only cards ${rangeText(form, dateWindow)} are included. Attendees with no such cards get no email.`,
        'Emails are sent in the background, usually within a minute. Track each one in Attendees → Email log → Business cards.',
    ];
    return (
        <div className="flex flex-col gap-5">
            <ModePicker form={form} update={update} />
            <FormatPicker form={form} toggleFormat={toggleFormat} />
            <DateRangePicker form={form} update={update} dateWindow={dateWindow} />
            {form.mode === 'email' && (
                <ReportRecipientPicker form={form} update={update} me={me} report={REPORT} count={target.count}
                    attendeeHint={target.count === 1 ? nameList(selectedAttendees) : null} />
            )}
            <ReportActionSummary problem={problem} lines={plan(report)} notes={form.mode === 'email' ? emailNotes : []} />
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
                Sending business cards for {result.attendees} attendee{result.attendees === 1 ? '' : 's'}
                {result.send_to_attendee && ' (each attendee gets only their own)'}
                {result.emails?.length > 0 && <> and all cards to <b>{result.emails.join(', ')}</b></>}.
                {' '}Attendees with no cards in the date range get no email. Check delivery in the Email log.
            </span>
        )}
    </div>
);

const CardExportDialog = ({ report }) => {
    const { target, busy, error, result, close, run, viewLog, problem, selectedAttendees } = report;
    const count = target.count;
    const subtitle = count === 1 && nameList(selectedAttendees)
        ? `Cards ${nameList(selectedAttendees)} saved on SnapCard`
        : `Cards saved on SnapCard by ${count} selected attendee${count === 1 ? '' : 's'}`;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <Contact size={20} />
                            <h2 className="text-lg font-bold">Business cards</h2>
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

const CardExportModal = ({ report }) => (report.isOpen ? <CardExportDialog report={report} /> : null);

export default CardExportModal;
