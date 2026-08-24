import { useEffect, useMemo, useState } from 'react';
import { eventService } from '../../../services/eventService';
import { normalizeOrganizerEvents, parseEventsPayload } from '../domain/organizerEvents';

export function useOrganizerEvents({ token, user, selectedEvent, recentEvents, currentEventId }) {
  const [fetched, setFetched] = useState([]);
  const [loading, setLoading] = useState(false);

  const fromUser = user?.events;

  useEffect(() => {
    if (!token || (Array.isArray(fromUser) && fromUser.length > 0)) {
      setFetched([]);
      return undefined;
    }
    let active = true;
    setLoading(true);
    eventService
      .getEvents(token)
      .then((data) => {
        if (active) setFetched(parseEventsPayload(data));
      })
      .catch(() => {
        if (active) setFetched([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, fromUser]);

  const events = useMemo(
    () =>
      normalizeOrganizerEvents(
        fromUser,
        fetched,
        recentEvents,
        selectedEvent ? [selectedEvent] : [],
        currentEventId ? [{ id: currentEventId, name: selectedEvent?.name }] : [],
      ),
    [fromUser, fetched, recentEvents, selectedEvent, currentEventId],
  );

  return { events, loading };
}
