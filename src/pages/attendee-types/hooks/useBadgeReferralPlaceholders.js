import { useEffect, useMemo, useState } from 'react';
import { eventService } from '../../../services/eventService';
import {
    buildReferralLinkPlaceholder,
    referralPlaceholdersFromInviteeLinks,
} from '../domain/badgeEmailReferralLinks';
import { mergeBadgeEmailVariables } from '../domain/badgeEmailVariables';
import {
    readReferralLinkPlaceholders,
    writeReferralLinkPlaceholders,
} from '../domain/sessionReferralLinkPlaceholders';

/** Event complimentary titles + session-typed {title_slug}_referral_link tokens. */
export default function useBadgeReferralPlaceholders(eventId, token) {
    const [sessionItems, setSessionItems] = useState(() =>
        readReferralLinkPlaceholders(eventId),
    );
    const [eventItems, setEventItems] = useState([]);

    useEffect(() => {
        setSessionItems(readReferralLinkPlaceholders(eventId));
    }, [eventId]);

    useEffect(() => {
        if (!eventId || !token) return undefined;
        let cancelled = false;
        eventService
            .getEventDetails(eventId, token)
            .then((data) => {
                if (cancelled) return;
                const event = data?.event || data;
                setEventItems(
                    referralPlaceholdersFromInviteeLinks(event?.complimentary_invitee_links),
                );
            })
            .catch(() => {
                if (!cancelled) setEventItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, [eventId, token]);

    const items = useMemo(
        () => mergeBadgeEmailVariables(eventItems, sessionItems),
        [eventItems, sessionItems],
    );

    const addFromTitle = (title) => {
        const item = buildReferralLinkPlaceholder(title);
        if (!item) return null;
        const prev = readReferralLinkPlaceholders(eventId);
        if (!prev.some((row) => row.name === item.name)) {
            const next = [...prev, item];
            writeReferralLinkPlaceholders(eventId, next);
            setSessionItems(next);
        }
        return item;
    };

    return { items, addFromTitle };
}
