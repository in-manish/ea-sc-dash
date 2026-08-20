import { stripPlaceholderMarks } from '../../../components/email/shared/placeholderHighlight';
import EmailBodyEditor from '../../../components/email/shared/EmailBodyEditor';
import EmailPreviewFrame from '../../../components/email/shared/EmailPreviewFrame';
import { normalizeCalendarHrefs } from '../domain/badgeEmailCalendarLinks';
import { useBadgeEmailDraft } from '../hooks/useBadgeEmailDraft.jsx';

export default function EmailInvitationDraft({ emailDraft, setEmailDraft, isPreviewMode }) {
    const draft = useBadgeEmailDraft();
    const highlightProps = draft?.highlightProps || {};
    const insertRef = draft?.insertRef;

    return (
        <div className="space-y-3 w-full">
            <input
                type="text"
                placeholder="Email Subject"
                value={emailDraft.subject}
                onChange={(e) =>
                    setEmailDraft({ ...emailDraft, subject: e.target.value })
                }
                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={isPreviewMode}
            />
            {isPreviewMode ? (
                <div className="border border-border rounded-2xl overflow-hidden bg-white min-h-[400px]">
                    <div className="p-4 border-b border-border bg-bg-secondary/50 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase">
                            Subject
                        </span>
                        <span className="text-sm font-medium">
                            {emailDraft.subject || '(No subject)'}
                        </span>
                    </div>
                    <EmailPreviewFrame
                        html={emailDraft.email || '<p>No content yet...</p>'}
                        {...highlightProps}
                    />
                </div>
            ) : (
                <div className="border border-border rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
                    <EmailBodyEditor
                        value={emailDraft.email}
                        onChange={(email) =>
                            setEmailDraft((prev) => ({
                                ...prev,
                                email: normalizeCalendarHrefs(stripPlaceholderMarks(email)),
                            }))
                        }
                        insertRef={insertRef}
                        {...highlightProps}
                    />
                </div>
            )}
        </div>
    );
}
