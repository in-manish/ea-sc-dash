const storageKey = (eventId) => `ea-attendee-upload-return:${eventId}`;

/** Remember the uploads list URL so Back still works after a refresh. */
export function rememberUploadsReturn(eventId, returnTo) {
    try {
        sessionStorage.setItem(storageKey(eventId), returnTo);
    } catch {
        // Private mode can block storage; location state still covers the first hop.
    }
}

export function readUploadsReturn(eventId) {
    if (!eventId) return '';
    try {
        return sessionStorage.getItem(storageKey(eventId)) || '';
    } catch {
        return '';
    }
}

/** Accept only this event's uploads page, keeping its list query. */
export function uploadsReturnPath(eventId, path) {
    if (!eventId || typeof path !== 'string' || !path.startsWith('/')) return '';
    const [pathname, query = ''] = path.split('?');
    if (pathname !== `/event/${eventId}/uploads`) return '';
    const params = new URLSearchParams(query);
    if (params.get('tab') === 'companies') return '';
    params.delete('tab');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}
