function escapeRe(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const CALENDAR_LINKS_SNIPPET = 'calendar_links';

export const CALENDAR_LINK_LABELS = {
    calendar_link: 'Add to Calendar',
    calendar_link_google: 'Add to Google Calendar',
    calendar_link_outlook: 'Add to Outlook',
    calendar_link_ics: 'Download .ics',
};

export const CALENDAR_TOKEN_NAMES = Object.keys(CALENDAR_LINK_LABELS).sort(
    (a, b) => b.length - a.length,
);

export const CALENDAR_LINKS_HTML = `<p>
  <a href="calendar_link_google">Add to Google Calendar</a><br>
  <a href="calendar_link_outlook">Add to Outlook</a><br>
  <a href="calendar_link_ics">Download .ics</a>
</p>`;

export const CALENDAR_EMAIL_VARIABLES = [
    {
        name: 'calendar_link',
        description: 'One Add to Calendar button (Google default). Inserts href only.',
    },
    {
        name: CALENDAR_LINKS_SNIPPET,
        description: 'Insert Google, Outlook, and Download .ics links',
    },
    {
        name: 'calendar_link_google',
        description: 'Google Calendar add/subscribe URL. Use in href only.',
    },
    {
        name: 'calendar_link_outlook',
        description: 'Outlook.com add-from-web URL. Use in href only.',
    },
    {
        name: 'calendar_link_ics',
        description: 'Hosted .ics download URL. Use in href only.',
    },
];

export function calendarInsertHtml(name) {
    if (name === CALENDAR_LINKS_SNIPPET) return CALENDAR_LINKS_HTML;
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
