import { Loader2, Mail } from 'lucide-react';
import AttendeeEmailDraftsList from './AttendeeEmailDraftsList';

export default function AttendeeEmailDraftsPane({
    loading,
    error,
    drafts,
    expandedId,
    onToggleExpand,
}) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-text-tertiary gap-3">
                <Loader2 className="animate-spin text-accent" size={28} />
                <p>Loading attendee type emails...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md" role="alert">
                {error}
            </div>
        );
    }
    if (drafts.length === 0) {
        return (
            <div className="text-center p-10 border border-dashed border-border rounded-lg text-text-secondary">
                <Mail size={24} className="mx-auto mb-3 text-text-tertiary" />
                <p className="m-0">No email drafts saved for this event.</p>
                <p className="text-xs text-text-tertiary mt-2 mb-0">
                    Save an email body on Attendee Types to see it here.
                </p>
            </div>
        );
    }
    return (
        <AttendeeEmailDraftsList
            drafts={drafts}
            expandedId={expandedId}
            onToggleExpand={onToggleExpand}
        />
    );
}
