import React from 'react';
import { Mail, MessageSquare, Loader2, Save } from 'lucide-react';
import EmailInvitationDraft from './EmailInvitationDraft';

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

                <EmailInvitationDraft
                    emailDraft={emailDraft}
                    setEmailDraft={setEmailDraft}
                    isPreviewMode={isPreviewMode}
                />
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
