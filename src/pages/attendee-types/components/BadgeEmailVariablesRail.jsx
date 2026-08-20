import BadgeEmailVariables from './BadgeEmailVariables';
import { useBadgeEmailDraft } from '../hooks/useBadgeEmailDraft.jsx';
import { BADGE_EMAIL_VARIABLES } from '../domain/badgeEmailVariables';

export default function BadgeEmailVariablesRail() {
    const draft = useBadgeEmailDraft();
    if (!draft) return null;

    return (
        <div className="mt-4 pt-4 border-t border-border">
            <BadgeEmailVariables
                variables={BADGE_EMAIL_VARIABLES}
                usedNames={draft.usedNames}
                isEditing={!draft.isPreviewMode}
                highlightName={draft.highlightProps.highlightName}
                onHover={draft.highlight.onHover}
                onLeave={draft.highlight.onLeave}
                onToggle={draft.highlight.onToggle}
                onInsert={draft.insertVariable}
            />
        </div>
    );
}
