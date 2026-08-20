import { X, Loader2, Mail, ArrowLeft } from 'lucide-react';
import AttendeeEmailPicker from './AttendeeEmailPicker';
import AttendeeEmailDraftsPane from './AttendeeEmailDraftsPane';

export default function AttendeeEmailDraftsModal({
    isOpen,
    onClose,
    selectedCount,
    viewingDrafts,
    onViewDrafts,
    onBackToPicker,
    badgeEmailSelected,
    onToggleBadgeEmail,
    categoryEmails,
    drafts,
    loading,
    error,
    expandedId,
    onToggleExpand,
    sending,
    sendError,
    onSend,
}) {
    if (!isOpen) return null;

    const countLabel = `${selectedCount} attendee${selectedCount === 1 ? '' : 's'} selected`;
    const hasCategory = (categoryEmails?.selectedIds?.length || 0) > 0;
    const canSend = !sending && (badgeEmailSelected || hasCategory) && !viewingDrafts;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in"
            onClick={sending ? undefined : onClose}
        >
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[92%] max-w-4xl max-h-[88vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="attendee-send-mail-title"
            >
                <Header
                    viewingDrafts={viewingDrafts}
                    countLabel={countLabel}
                    sending={sending}
                    onBack={onBackToPicker}
                    onClose={onClose}
                />

                <div className="p-5 overflow-y-auto flex-1">
                    {viewingDrafts ? (
                        <AttendeeEmailDraftsPane
                            loading={loading}
                            error={error}
                            drafts={drafts}
                            expandedId={expandedId}
                            onToggleExpand={onToggleExpand}
                        />
                    ) : (
                        <AttendeeEmailPicker
                            badgeEmailSelected={badgeEmailSelected}
                            onToggleBadgeEmail={onToggleBadgeEmail}
                            onViewDrafts={onViewDrafts}
                            categoryEmails={categoryEmails}
                            sending={sending}
                        />
                    )}
                    {sendError && (
                        <div
                            className="mt-4 bg-red-50 text-red-800 p-4 border border-red-200 rounded-md"
                            role="alert"
                        >
                            {sendError}
                        </div>
                    )}
                </div>

                {!viewingDrafts && (
                    <Footer sending={sending} canSend={canSend} onClose={onClose} onSend={onSend} />
                )}
            </div>
        </div>
    );
}

function Header({ viewingDrafts, countLabel, sending, onBack, onClose }) {
    return (
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 bg-bg-secondary">
            <div className="flex items-center gap-2 min-w-0">
                {viewingDrafts && (
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={sending}
                        className="bg-transparent border-none text-text-secondary cursor-pointer p-1 rounded-sm hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50"
                        aria-label="Back to Send Mail"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}
                <h2
                    id="attendee-send-mail-title"
                    className="text-base font-bold text-text-primary m-0 truncate"
                >
                    {viewingDrafts ? 'Attendee type emails' : `Send Mail | ${countLabel}`}
                </h2>
            </div>
            <button
                type="button"
                className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm hover:bg-bg-tertiary hover:text-text-primary disabled:opacity-50"
                onClick={onClose}
                disabled={sending}
                aria-label="Close"
            >
                <X size={18} />
            </button>
        </div>
    );
}

function Footer({ sending, canSend, onClose, onSend }) {
    return (
        <div className="px-5 py-4 border-t border-border bg-bg-secondary flex items-center justify-end gap-3">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={sending}>
                Cancel
            </button>
            <button
                type="button"
                className="btn btn-primary inline-flex items-center"
                onClick={onSend}
                disabled={!canSend}
            >
                {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Mail size={16} style={{ marginRight: '0.5rem' }} />
                )}
                {sending ? 'Sending...' : 'Send'}
            </button>
        </div>
    );
}
