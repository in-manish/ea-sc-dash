import React from 'react';
import { Mail, MessageSquare, Loader2, Save } from 'lucide-react';

const DraftsTab = ({
    emailDraft,
    setEmailDraft,
    smsDraft,
    setSmsDraft,
    isPreviewMode,
    setIsPreviewMode,
    handleSaveDrafts,
    isActionLoading
}) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Mail size={18} className="text-accent" /> Email Invitation Draft
                    </h4>
                    <div className="flex items-center gap-2">
                        <button
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${!isPreviewMode ? 'bg-accent text-white shadow-md' : 'bg-bg-secondary text-text-tertiary'}`}
                            onClick={() => setIsPreviewMode(false)}
                        >
                            Edit
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${isPreviewMode ? 'bg-accent text-white shadow-md' : 'bg-bg-secondary text-text-tertiary'}`}
                            onClick={() => setIsPreviewMode(true)}
                        >
                            Preview
                        </button>
                    </div>
                </div>

                {isPreviewMode ? (
                    <div className="border border-border rounded-2xl overflow-hidden bg-white min-h-[400px]">
                        <div className="p-4 border-b border-border bg-bg-secondary/50 flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase">Subject</span>
                            <span className="text-sm font-medium">{emailDraft.subject || '(No subject)'}</span>
                        </div>
                        <div className="p-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: emailDraft.email || '<p class="text-text-tertiary italic">No content yet...</p>' }} />
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Email Subject"
                            value={emailDraft.subject}
                            onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <textarea
                            rows={12}
                            placeholder="Email Content (HTML supported)"
                            value={emailDraft.email}
                            onChange={(e) => setEmailDraft({ ...emailDraft, email: e.target.value })}
                            className="w-full p-4 bg-bg-secondary border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <MessageSquare size={18} className="text-accent" /> SMS Template
                    </h4>
                    <p className="text-[10px] text-text-tertiary">Confirmation SMS</p>
                </div>
                <textarea
                    rows={4}
                    placeholder="SMS Content"
                    value={smsDraft.sms_body}
                    onChange={(e) => setSmsDraft({ ...smsDraft, sms_body: e.target.value })}
                    className="w-full p-4 bg-bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-3">
                <button
                    className="btn btn-primary px-8 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    onClick={handleSaveDrafts}
                    disabled={isActionLoading}
                >
                    {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Drafts
                </button>
            </div>
        </div>
    );
};

export default DraftsTab;
