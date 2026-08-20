import { ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { emailBodyPreview } from '../domain/parseAttendeeTypeEmails';

export default function AttendeeEmailDraftsList({ drafts, expandedId, onToggleExpand }) {
    return (
        <div className="space-y-3">
            {drafts.map((draft) => {
                const isExpanded = expandedId === draft.id;
                return (
                    <div
                        key={draft.id}
                        className={`rounded-xl border transition-all ${
                            isExpanded
                                ? 'border-accent bg-accent/5 shadow-md'
                                : 'border-border bg-bg-primary'
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => onToggleExpand(draft.id)}
                            className="w-full text-left p-5 flex items-start justify-between gap-4 bg-transparent border-none cursor-pointer"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Mail size={15} className="text-accent shrink-0" />
                                    <div className="text-sm font-bold text-text-primary truncate">
                                        {draft.name}
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary mt-1 truncate">
                                    <span className="text-text-tertiary">Subject: </span>
                                    {draft.subject || '(No subject)'}
                                </p>
                                {!isExpanded && (
                                    <p className="text-xs text-text-tertiary mt-2 line-clamp-2">
                                        {emailBodyPreview(draft.email)}
                                    </p>
                                )}
                            </div>
                            {isExpanded ? (
                                <ChevronUp size={16} className="text-accent shrink-0 mt-0.5" />
                            ) : (
                                <ChevronDown size={16} className="text-text-tertiary shrink-0 mt-0.5" />
                            )}
                        </button>
                        {isExpanded && (
                            <div className="px-5 pb-5">
                                <div
                                    className="rounded-md border border-border bg-white p-3 text-sm max-h-56 overflow-auto text-text-primary"
                                    dangerouslySetInnerHTML={{ __html: draft.email }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
