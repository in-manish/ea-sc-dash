import { normalizeCalendarHrefs } from './domain/badgeEmailCalendarLinks';

function firstRow(data) {
    if (!data) return null;
    if (Array.isArray(data)) return data[0] || null;
    if (Array.isArray(data.attendee_types)) return data.attendee_types[0] || null;
    return data;
}

export function parseEmailDraft(data) {
    const row = firstRow(data);
    return {
        subject: row?.subject || '',
        email: normalizeCalendarHrefs(row?.email || ''),
    };
}

export function parseSmsDraft(data) {
    const row = firstRow(data);
    return { sms_body: row?.sms_body || row?.sms || '' };
}
