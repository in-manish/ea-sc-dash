import { useEffect, useState } from 'react';
import { eventService } from '../../../services/eventService';

/** Attendee types of the event as [{ id, name }]. */
export function useAttendeeTypes({ eventId, token }) {
  const [loaded, setLoaded] = useState({ key: '', types: [] });
  const key = eventId && token ? String(eventId) : '';

  useEffect(() => {
    if (!key) return undefined;
    let active = true;
    eventService
      .getAttendeeTypes(eventId, token)
      .then((payload) => {
        const list = Array.isArray(payload?.attendee_types) ? payload.attendee_types : [];
        if (active) setLoaded({ key, types: list.map((item) => ({ id: item.id, name: item.name })) });
      })
      .catch(() => active && setLoaded({ key, types: [] }));
    return () => {
      active = false;
    };
  }, [key, eventId, token]);

  return { types: loaded.key === key ? loaded.types : [], loading: Boolean(key) && loaded.key !== key };
}
