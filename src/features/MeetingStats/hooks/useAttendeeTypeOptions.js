import { useEffect, useRef, useState } from 'react';
import { eventService } from '../../../services/eventService';
import { mergeAttendeeTypeNames } from '../domain/attendeeTypeNames';
import { uniqueIds } from '../domain/meetingStatsQuery';

function typesFromPayload(data) {
  return Array.isArray(data?.attendee_types) ? data.attendee_types : [];
}

export function useAttendeeTypeOptions({ eventIds, token }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const idsKey = uniqueIds(eventIds).join(',');

  useEffect(() => {
    const ids = idsKey ? uniqueIds(idsKey.split(',')) : [];
    const id = ++requestId.current;
    if (!token || ids.length === 0) {
      setTypes([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    Promise.all(
      ids.map((eventId) =>
        eventService.getAttendeeTypes(eventId, token).catch(() => ({ attendee_types: [] })),
      ),
    )
      .then((results) => {
        if (id !== requestId.current) return;
        setTypes(mergeAttendeeTypeNames(results.map(typesFromPayload)));
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });

    return () => {
      requestId.current += 1;
    };
  }, [idsKey, token]);

  return { types, loading };
}
