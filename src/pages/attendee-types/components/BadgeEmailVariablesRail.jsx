import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import BadgeEmailVariables from './BadgeEmailVariables';
import ReferralLinkPlaceholderForm from './ReferralLinkPlaceholderForm';
import { useBadgeEmailDraft } from '../hooks/useBadgeEmailDraft.jsx';
import useBadgeReferralPlaceholders from '../hooks/useBadgeReferralPlaceholders';
import {
    BADGE_EMAIL_VARIABLES,
    mergeBadgeEmailVariables,
} from '../domain/badgeEmailVariables';

export default function BadgeEmailVariablesRail() {
    const draft = useBadgeEmailDraft();
    const { id } = useParams();
    const { token } = useAuth();
    const referral = useBadgeReferralPlaceholders(id, token);
    if (!draft) return null;

    const variables = mergeBadgeEmailVariables(BADGE_EMAIL_VARIABLES, referral.items);

    const addReferral = (_item, title) => {
        const created = referral.addFromTitle(title);
        if (created) draft.insertVariable(created.name);
    };

    return (
        <div className="mt-4 pt-4 border-t border-border">
            {!draft.isPreviewMode ? (
                <ReferralLinkPlaceholderForm onAdd={addReferral} />
            ) : null}
            <BadgeEmailVariables
                variables={variables}
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
