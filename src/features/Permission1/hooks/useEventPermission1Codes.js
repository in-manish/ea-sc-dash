import { useEffect, useState } from 'react';
import { eventService } from '../../../services/eventService';
import { permission1CodeMap } from '../domain/permission1Codes';

/** Load the event's permission1 code map for attendee create and edit. */
export default function useEventPermission1Codes(eventId, token) {
  const [loaded, setLoaded] = useState({ id: null, codeMap: {} });

  useEffect(() => {
    if (!eventId || !token) return undefined;
    let active = true;
    eventService
      .getEventDetails(eventId, token)
      .then((data) => {
        if (!active) return;
        setLoaded({ id: eventId, codeMap: permission1CodeMap(data?.permission1_codes) });
      })
      .catch(() => {
        if (!active) return;
        setLoaded({ id: eventId, codeMap: {} });
      });
    return () => {
      active = false;
    };
  }, [eventId, token]);

  const ready = loaded.id === eventId;
  return { codeMap: ready ? loaded.codeMap : {}, ready };
}
