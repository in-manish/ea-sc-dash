export function otmEventCode(eventId) {
    if (eventId == null || eventId === '') return '';
    return `reconnect_${eventId}`;
}
