import { X, KeyRound, Loader2, AlertTriangle } from 'lucide-react';

const AUDIENCE = [
    {
        value: false,
        title: 'New only',
        text: 'Skips anyone who already got it for this event. Their password stays the same.',
    },
    {
        value: true,
        title: 'Everyone (reset password)',
        text: 'Creates a new password for everyone selected and emails it. Their current password stops working, in the app too.',
    },
];

const Choice = ({ type, checked, onChange, title, text, danger }) => (
    <label className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer ${checked ? (danger ? 'border-status-danger bg-red-50' : 'border-accent bg-bg-secondary') : 'border-border'}`}>
        <input type={type} className="mt-1" checked={checked} onChange={onChange} />
        <span className="text-sm">
            <span className="font-semibold text-text-primary block">{title}</span>
            <span className="text-text-secondary">{text}</span>
        </span>
    </label>
);

const InviteForm = ({ options, setOption }) => (
    <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Who gets it</div>
            {AUDIENCE.map((a) => (
                <Choice
                    key={a.title}
                    type="radio"
                    checked={options.resetExisting === a.value}
                    onChange={() => setOption('resetExisting', a.value)}
                    title={a.title}
                    text={a.text}
                    danger={a.value}
                />
            ))}
        </div>
        <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Send by</div>
            <Choice
                type="checkbox"
                checked={options.email}
                onChange={(e) => setOption('email', e.target.checked)}
                title="Email"
                text="Login email with the new password."
            />
            <Choice
                type="checkbox"
                checked={options.whatsapp}
                onChange={(e) => setOption('whatsapp', e.target.checked)}
                title="WhatsApp"
                text="Meeting diary message only, no password. The text is currently fixed to BLTM 2026."
            />
        </div>
    </div>
);

const InviteResult = ({ result }) => {
    const requested = result.sc_email_requested_count ?? 0;
    const queued = result.sc_email_queued_count ?? 0;
    const skipped = Math.max(requested - queued, 0);
    return (
        <div className="flex flex-col gap-2 text-sm text-text-primary">
            {result.sendMode.includes('email') && (
                <p><b>Email:</b> {queued} of {requested} queued.</p>
            )}
            {result.sendMode.includes('email') && !result.resetExisting && skipped > 0 && (
                <p className="text-text-secondary">{skipped} skipped: already sent for this event.</p>
            )}
            {result.sendMode.includes('whatsapp') && (
                <p><b>WhatsApp:</b> queued for attendees with a phone number.</p>
            )}
            <p className="text-text-secondary">Sending runs in the background and can take a few minutes.</p>
        </div>
    );
};

const ScInviteDialog = ({ count, invite }) => {
    const { options, setOption, sending, error, result, close, send } = invite;
    const resetting = options.resetExisting;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in" onClick={close}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-modal-smooth" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-text-primary">
                            <KeyRound size={20} />
                            <h2 className="text-lg font-bold">{result ? 'SnapCard login queued' : 'Send SnapCard login'}</h2>
                        </div>
                        {!result && (
                            <p className="text-sm text-text-secondary mt-1">
                                {count} attendee{count === 1 ? '' : 's'} selected. Only attendees linked to SnapCard are included.
                            </p>
                        )}
                    </div>
                    <button onClick={close} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button>
                </div>
                <div className="p-6">
                    {result ? <InviteResult result={result} /> : <InviteForm options={options} setOption={setOption} />}
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
                            <button type="button" className="btn btn-secondary" onClick={close} disabled={sending}>Cancel</button>
                            <button
                                type="button"
                                onClick={send}
                                disabled={sending}
                                className={`btn flex items-center gap-2 disabled:opacity-50 ${resetting ? 'bg-status-danger hover:opacity-90 text-white border-none' : 'btn-primary'}`}
                            >
                                {sending && <Loader2 size={16} className="animate-spin" />}
                                {resetting ? 'Reset & send' : 'Send'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const ScInviteModal = ({ count, invite }) =>
    invite.isOpen ? <ScInviteDialog count={count} invite={invite} /> : null;

export default ScInviteModal;
