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
        </div>
    );
}
