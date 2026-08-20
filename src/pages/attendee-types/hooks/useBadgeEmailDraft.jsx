import { createContext, useContext, useRef } from 'react';
import usePlaceholderHighlight from '../../../components/email/templates/hooks/usePlaceholderHighlight';
import {
    BADGE_EMAIL_TOKEN_RE,
    appendBadgeEmailToken,
    extractBadgeEmailTokens,
    tokenForInsert,
} from '../domain/badgeEmailVariables';

const BadgeEmailDraftContext = createContext(null);

function useBadgeEmailDraftState({ emailDraft, setEmailDraft, isPreviewMode }) {
    const highlight = usePlaceholderHighlight();
    const insertRef = useRef(null);
    const usedNames = extractBadgeEmailTokens(emailDraft.email, emailDraft.subject);
    const highlightProps = {
        highlightName: highlight.highlightName,
        onHover: highlight.onHover,
        onLeave: highlight.onLeave,
        onToggle: highlight.onToggle,
        tokenRe: BADGE_EMAIL_TOKEN_RE,
    };

    const insertVariable = (name) => {
        if (isPreviewMode) {
            highlight.onToggle(name);
            return;
        }
        const token = tokenForInsert(name);
        const inserted = insertRef.current?.(token);
        if (!inserted) {
            setEmailDraft((prev) => ({
                ...prev,
                email: appendBadgeEmailToken(prev.email, token),
            }));
        }
        highlight.onPin(name);
    };

    return {
        insertRef,
        usedNames,
        highlightProps,
        insertVariable,
        isPreviewMode,
        highlight,
    };
}

export function BadgeEmailDraftProvider({ emailDraft, setEmailDraft, isPreviewMode, children }) {
    const value = useBadgeEmailDraftState({ emailDraft, setEmailDraft, isPreviewMode });
    return (
        <BadgeEmailDraftContext.Provider value={value}>
            {children}
        </BadgeEmailDraftContext.Provider>
    );
}

export function useBadgeEmailDraft() {
    return useContext(BadgeEmailDraftContext);
}
