import { useState, useEffect } from 'react';
import { eventService } from '../../../services/eventService';

export default function useAttendeeTypes(eventId, token) {
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!eventId || !token) {
            setAttendeeTypes([]);
            return;
        }

        let active = true;
        const load = async () => {
            setLoading(true);
            try {
                const data = await eventService.getAttendeeTypes(eventId, token);
                if (active) setAttendeeTypes(data.attendee_types || []);
            } catch {
                if (active) setAttendeeTypes([]);
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [eventId, token]);

    return { attendeeTypes, loading };
}
