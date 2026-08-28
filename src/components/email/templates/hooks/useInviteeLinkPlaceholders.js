import { useEffect, useState } from 'react';
import { buildInviteeLinkPlaceholder } from '../domain/inviteeLinkPlaceholder';
import {
  readInviteeLinkPlaceholders,
  writeInviteeLinkPlaceholders,
} from '../domain/sessionInviteeLinkPlaceholders';

/** Session-persisted invitee_<title_slug>_link tokens for this event. */
export default function useInviteeLinkPlaceholders(eventId) {
  const [items, setItems] = useState(() => readInviteeLinkPlaceholders(eventId));

  useEffect(() => {
    setItems(readInviteeLinkPlaceholders(eventId));
  }, [eventId]);

  const addFromTitle = (title) => {
    const item = buildInviteeLinkPlaceholder(title);
    if (!item) return null;
    const prev = readInviteeLinkPlaceholders(eventId);
    const next = prev.some((row) => row.name === item.name) ? prev : [...prev, item];
    writeInviteeLinkPlaceholders(eventId, next);
    setItems(next);
    return item;
  };

  return { items, addFromTitle };
}
