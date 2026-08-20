export function parseAttendeeTypeEmails(data) {
    const rows = Array.isArray(data?.attendee_types) ? data.attendee_types : [];
    return rows
        .filter((row) => row && row.email)
        .map((row) => ({
            id: row.id,
            name: row.name || 'Untitled type',
            email: row.email,
            subject: row.subject ?? null,
        }));
}

export function emailBodyPreview(html, max = 140) {
    const text = String(html || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= max) return text;
    return `${text.slice(0, max)}…`;
}

export function parseAttendeeTypeEmailsError(result, status, fallback) {
    if (status === 401) return 'Authentication required. Please sign in again.';
    if (status === 403) return 'Organizer access required.';
    if (typeof result?.detail === 'string' && result.detail) return result.detail;
    if (typeof result?.msg === 'string' && result.msg) return result.msg;
    if (typeof result?.message === 'string' && result.message) return result.message;
    return fallback || `Failed to load email drafts (${status}).`;
}
