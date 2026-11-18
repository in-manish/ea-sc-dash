import { X, Contact, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { describeRecipients } from '../domain/cardExportRequest';
import { DateRangePicker, FormatPicker, ModePicker, RecipientFields } from './CardExportFields';

const Result = ({ result }) => (
    <div className="flex items-start gap-2 text-sm text-text-primary">
        <CheckCircle2 size={18} className="text-status-success shrink-0 mt-0.5" />
        <span>
            {result.downloaded
                ? `Downloaded ${result.filename}. Attendees with no cards in the date range are left out.`
                : `Sending cards for ${result.attendees} attendee${result.attendees === 1 ? '' : 's'} to ${describeRecipients({
                    sendToAttendee: result.send_to_attendee,
                    emailsText: (result.emails || []).join(','),
                })}. Attendees with no cards in the date range get no email.`}
        </span>
    </div>
);

const Form = ({ report }) => {
    const { form, update, toggleFormat, dateWindow, target } = report;
    return (
        <div className="flex flex-col gap-5">
            <ModePicker form={form} update={update} />
            <FormatPicker form={form} toggleFormat={toggleFormat} />
            <DateRangePicker form={form} update={update} dateWindow={dateWindow} />
            {form.mode === 'email' && <RecipientFields form={form} update={update} />}
            {form.mode === 'email' && (
                <p className="text-sm text-text-secondary">Will send to {describeRecipients(form)}.</p>
            )}
            {target.missing > 0 && (
                <p className="text-xs text-text-tertiary">{target.missing} selected attendee(s) without a Reg ID are left out.</p>
            )}
        </div>
    );
};

const CardExportDialog = ({ report }) => {
    const { target, busy, error, result, close, run, form } = report;
    const count = target.count;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <Contact size={20} />
                            <h2 className="text-lg font-bold">Business cards</h2>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                            Cards exchanged on SnapCard by {count} selected attendee{count === 1 ? '' : 's'}.
                        </p>
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
                            {result.emailed && (
                                <button type="button" className="btn btn-secondary" onClick={report.viewLog}>View email log</button>
                            )}
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

const CardExportModal = ({ report }) => (report.isOpen ? <CardExportDialog report={report} /> : null);

export default CardExportModal;
