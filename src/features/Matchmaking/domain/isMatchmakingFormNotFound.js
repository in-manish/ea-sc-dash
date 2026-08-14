export function isMatchmakingFormNotFound(error) {
    const message = String(error?.message || '').toLowerCase();
    if (/event not found/i.test(message)) return false;
    if (error?.status === 404) return true;
    return /match making form not found/i.test(message);
}

export function isEventNotFound(error) {
    return /event not found/i.test(String(error?.message || ''));
}
