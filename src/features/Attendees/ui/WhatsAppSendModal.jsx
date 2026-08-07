import { X, Loader2, MessageCircle } from 'lucide-react';
import WhatsAppTemplatePicker from './WhatsAppTemplatePicker';

const WhatsAppSendModal = ({
    isOpen,
    onClose,
    selectedCount,
    selectionMode,
    selectedAttendees,
    templates,
    templatesLoading,
    templatesError,
    selectedTemplateId,
    setSelectedTemplateId,
    templateViewMode,
    setTemplateViewMode,
    expandedTemplateId,
    setExpandedTemplateId,
    previewContentMode,
    setPreviewContentMode,
    previewAttendee,
    isSending,
    onSend,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[92%] max-w-[920px] max-h-[88vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border flex items-start justify-between bg-bg-secondary">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">Send WhatsApp</h2>
                        <p className="text-sm text-text-secondary">
                            Choose one template for {selectedCount} attendee
                            {selectedCount === 1 ? '' : 's'}.
                        </p>
                    </div>
                    <button
                        className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-4 border-b border-border bg-bg-primary">
                    {selectionMode === 'selected' ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedAttendees.map((attendee) => (
                                <span
                                    key={attendee.uuid}
                                    className="inline-flex items-center rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold"
                                >
                                    {attendee.name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-text-secondary">
                            {selectionMode === 'filtered'
                                ? 'Applies to all attendees matching the current search and filters.'
                                : 'Applies to all attendees in this event.'}
                        </div>
                    )}
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {templatesLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-text-tertiary gap-3">
                            <Loader2 className="animate-spin text-accent" size={28} />
                            <p>Loading WhatsApp templates...</p>
                        </div>
                    ) : templatesError ? (
                        <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md">
                            {templatesError}
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="text-center p-10 border border-dashed border-border rounded-lg text-text-secondary">
                            No WhatsApp templates available for attendees.
                        </div>
                    ) : (
                        <WhatsAppTemplatePicker
                            templates={templates}
                            templateViewMode={templateViewMode}
                            setTemplateViewMode={setTemplateViewMode}
                            selectedTemplateId={selectedTemplateId}
                            setSelectedTemplateId={setSelectedTemplateId}
                            expandedTemplateId={expandedTemplateId}
                            setExpandedTemplateId={setExpandedTemplateId}
                            previewContentMode={previewContentMode}
                            setPreviewContentMode={setPreviewContentMode}
                            previewAttendee={previewAttendee}
                        />
                    )}
                </div>

                <div className="p-6 border-t border-border bg-bg-secondary flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="text-xs text-text-tertiary m-0">
                        The selected template will be sent to the attendee WhatsApp numbers directly.
                    </p>
                    <div className="flex items-center gap-3">
                        <button className="btn btn-secondary" onClick={onClose} disabled={isSending}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={onSend}
                            disabled={!selectedTemplateId || isSending || templatesLoading}
                        >
                            {isSending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
                            )}
                            {isSending ? 'Sending...' : 'Send WhatsApp'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppSendModal;
