import AttendeeBadgeEmailRow from './AttendeeBadgeEmailRow';
import AttendeeCategoryEmailSection from './AttendeeCategoryEmailSection';

const EMPTY_CATEGORY = {
    emails: [],
    loading: false,
    error: '',
    selectedIds: [],
    toggle: () => {},
    expandedId: null,
    toggleExpand: () => {},
};

export default function AttendeeEmailPicker({
    badgeEmailSelected,
    onToggleBadgeEmail,
    onViewDrafts,
    categoryEmails = EMPTY_CATEGORY,
    templateEmails = EMPTY_CATEGORY,
    sending,
}) {
    return (
        <div>
            <AttendeeBadgeEmailRow
                selected={badgeEmailSelected}
                onToggle={onToggleBadgeEmail}
                onViewDrafts={onViewDrafts}
                disabled={sending}
            />
            <div className="border-t border-border" />
            <AttendeeCategoryEmailSection
                emails={categoryEmails.emails}
                loading={categoryEmails.loading}
                error={categoryEmails.error}
                selectedIds={categoryEmails.selectedIds}
                expandedId={categoryEmails.expandedId}
                onToggle={categoryEmails.toggle}
                onToggleExpand={categoryEmails.toggleExpand}
                disabled={sending}
            />
            <div className="border-t border-border mt-2" />
            <AttendeeCategoryEmailSection
                title="Email Templates"
                loadingText="Loading email templates..."
                emptyText="No email templates for this event. Create one in Communication, Email, Templates."
                emails={templateEmails.emails}
                loading={templateEmails.loading}
                error={templateEmails.error}
                selectedIds={templateEmails.selectedIds}
                expandedId={templateEmails.expandedId}
                onToggle={templateEmails.toggle}
                onToggleExpand={templateEmails.toggleExpand}
                disabled={sending}
            />
        </div>
    );
}
