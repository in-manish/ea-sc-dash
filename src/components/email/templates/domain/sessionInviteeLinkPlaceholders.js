import { storageGet, storageSet } from '../../../../storage/webStorage';

function storageKey(eventId) {
  return `ea_email_invitee_link_placeholders_${eventId || 'all'}`;
}

function asList(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item.name === 'string' && item.name);
}

export function readInviteeLinkPlaceholders(eventId) {
  try {
    return asList(JSON.parse(storageGet(storageKey(eventId)) || '[]'));
  } catch {
    return [];
  }
}

export function writeInviteeLinkPlaceholders(eventId, items) {
  storageSet(storageKey(eventId), JSON.stringify(asList(items)));
}
