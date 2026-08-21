function escapeRe(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const CALENDAR_LINK_LABELS = {
    calendar_link_google: 'Add to Google Calendar',
    calendar_link_outlook: 'Add to Outlook',
};

const LEGACY_CALENDAR_TOKENS = ['calendar_link', 'calendar_link_ics'];

export const CALENDAR_TOKEN_NAMES = [
    ...Object.keys(CALENDAR_LINK_LABELS),
    ...LEGACY_CALENDAR_TOKENS,
].sort((a, b) => b.length - a.length);

export const CALENDAR_EMAIL_VARIABLES = [
    {
        name: 'calendar_link_google',
        label: 'Google Calendar',
        description:
            'Puts event information into Google Calendar. Inserts as an href token.',
    },
    {
        name: 'calendar_link_outlook',
        label: 'Outlook Calendar',
        description:
            'Puts event information into Outlook. Inserts as an href token.',
    },
];

export function calendarInsertHtml(name) {
    const label = CALENDAR_LINK_LABELS[name];
    if (!label) return null;
    return `<a href="${name}">${label}</a>`;
}

/** Keep href values as bare tokens if the visual editor prefixes a protocol or path. */
export function normalizeCalendarHrefs(html) {
    let out = String(html || '');
    CALENDAR_TOKEN_NAMES.forEach((name) => {
        const re = new RegExp(
            `href\\s*=\\s*(["'])(?:[^"']*?)${escapeRe(name)}\\1`,
            'gi',
        );
        out = out.replace(re, `href=$1${name}$1`);
    });
    return out;
}
