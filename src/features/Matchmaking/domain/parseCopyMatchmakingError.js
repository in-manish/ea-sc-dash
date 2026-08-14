export const COPY_ERROR = {
    DEST_EXISTS: 'DEST_EXISTS',
    SOURCE_NOT_FOUND: 'SOURCE_NOT_FOUND',
    EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
    UNKNOWN: 'UNKNOWN',
};

export function parseCopyMatchmakingError(error) {
    const message = String(error?.message || error?.body?.msg || '').toLowerCase();
    if (message.includes('already exists') && message.includes('destination')) {
        return COPY_ERROR.DEST_EXISTS;
    }
    if (message.includes('not found') && message.includes('source')) {
        return COPY_ERROR.SOURCE_NOT_FOUND;
    }
    if (message.includes('event not found')) return COPY_ERROR.EVENT_NOT_FOUND;
    return COPY_ERROR.UNKNOWN;
}

export function copyMatchmakingErrorMessage(code, fallback) {
    if (code === COPY_ERROR.DEST_EXISTS) {
        return fallback || 'Matchmaking form already exists for the destination event.';
    }
    if (code === COPY_ERROR.SOURCE_NOT_FOUND) {
        return 'Matchmaking form not found for the source event. Pick another source.';
    }
    if (code === COPY_ERROR.EVENT_NOT_FOUND) {
        return 'Event not found. Check the event id.';
    }
    return fallback || 'Failed to copy matchmaking.';
}
