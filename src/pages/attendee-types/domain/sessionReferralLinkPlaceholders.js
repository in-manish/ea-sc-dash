import { storageGet, storageSet } from '../../../storage/webStorage';

function storageKey(eventId) {
    return `ea_badge_referral_link_placeholders_${eventId || 'all'}`;
}

function asList(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((item) => item && typeof item.name === 'string' && item.name);
}

export function readReferralLinkPlaceholders(eventId) {
    try {
        return asList(JSON.parse(storageGet(storageKey(eventId)) || '[]'));
    } catch {
        return [];
    }
}

export function writeReferralLinkPlaceholders(eventId, items) {
    storageSet(storageKey(eventId), JSON.stringify(asList(items)));
}
