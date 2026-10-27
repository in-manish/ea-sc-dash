import { X, FileText, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const FORMATS = [
    { value: true, title: 'One combined PDF', text: 'All selected attendees in a single file.' },
    { value: false, title: 'One PDF per attendee', text: 'A separate file for each attendee.' },
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

const Body = ({ report }) => {
    const { isSingle, target, cumulative, setCumulative, result } = report;
    if (result) {
        return (
            <div className="flex items-start gap-2 text-sm text-text-primary">
                <CheckCircle2 size={18} className="text-status-success shrink-0 mt-0.5" />
                <span>
                    {result.downloaded
                        ? `Downloaded ${result.filename}.`
                        : `${result.message || 'Meeting report is being generated.'} Large selections (over 20) arrive as download links.`}
                </span>
            </div>
        );
    }
    if (isSingle) {
        return <p className="text-sm text-text-secondary">Downloads the PDF of this attendee's meetings.</p>;
    }
    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm text-text-secondary">
                The PDFs are generated in the background and emailed to your organizer login email.
                Attendees without an active badge are skipped.
            </p>
            {FORMATS.map((f) => (
                <Choice
                    key={f.title}
                    checked={cumulative === f.value}
                    onChange={() => setCumulative(f.value)}
                    title={f.title}
                    text={f.text}
                />
            ))}
            {target.missing > 0 && (
                <p className="text-xs text-text-tertiary">{target.missing} selected attendee(s) without a Reg ID are left out.</p>
            )}
        </div>
    );
};

const MeetingReportDialog = ({ report }) => {
    const { isSingle, target, busy, error, result, close, run } = report;
    const count = target.count;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <FileText size={20} />
                            <h2 className="text-lg font-bold">Meeting report</h2>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                            {count} attendee{count === 1 ? '' : 's'} selected.
                        </p>
                    </div>
                    <button onClick={close} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6">
                    <Body report={report} />
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 text-red-800 p-3 border border-red-200 rounded-md mt-4 text-sm">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
                <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
                    {result ? (
                        <button type="button" className="btn btn-primary" onClick={close}>Done</button>
                    ) : (
                        <>
                            <button type="button" className="btn btn-secondary" onClick={close} disabled={busy}>Cancel</button>
                            <button type="button" onClick={run} disabled={busy} className="btn btn-primary flex items-center gap-2 disabled:opacity-50">
                                {busy && <Loader2 size={16} className="animate-spin" />}
                                {isSingle ? 'Download PDF' : 'Email PDF'}
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
