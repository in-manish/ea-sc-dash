import {
    CALENDAR_EMAIL_VARIABLES,
    CALENDAR_TOKEN_NAMES,
    calendarInsertHtml,
} from './badgeEmailCalendarLinks';

export const BADGE_EMAIL_VARIABLES = [
    { name: 'user_name', description: 'Badge name' },
    { name: 'att_type', description: 'Attendee type name' },
    { name: 'reg_id', description: 'Registration id' },
    { name: 'event_code', description: 'Event login code' },
    { name: 'event_name', description: 'Event name' },
    { name: 'user_email', description: 'Badge email' },
    {
        name: 'company_name',
        description: 'Exhibitor company name (empty if no exhibitor)',
    },
    {
        name: 'event_date',
        description: 'Event start_date as Month DD, YYYY (e.g. October 27, 2026)',
    },
    { name: 'event_venue', description: 'Event address' },
    ...CALENDAR_EMAIL_VARIABLES,
    { name: '\\n', description: 'Real newline (\\n\\n for a blank line)' },
];

const NEWLINE_TOKEN = '\\n';

function escapeRe(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const WORD_NAMES = [
    ...BADGE_EMAIL_VARIABLES
        .map((item) => item.name)
        .filter((name) => name !== NEWLINE_TOKEN),
    ...CALENDAR_TOKEN_NAMES,
]
    .filter((name, index, all) => all.indexOf(name) === index)
    .sort((a, b) => b.length - a.length);

export const BADGE_EMAIL_TOKEN_RE = new RegExp(
    `(\\\\n|\\b(?:${WORD_NAMES.map(escapeRe).join('|')})\\b)`,
    'g',
);

export function extractBadgeEmailTokens(...texts) {
    const names = [];
    const seen = new Set();
    texts.forEach((text) => {
        const src = String(text || '');
        const re = new RegExp(BADGE_EMAIL_TOKEN_RE.source, 'g');
        let match = re.exec(src);
        while (match) {
            const name = match[1] || match[0];
            if (name && !seen.has(name)) {
                seen.add(name);
                names.push(name);
            }
            match = re.exec(src);
        }
    });
    return names;
}

export function tokenForInsert(name) {
    if (name === NEWLINE_TOKEN || name === '\n') return NEWLINE_TOKEN;
    return calendarInsertHtml(name) || name;
}

export function appendBadgeEmailToken(content, token) {
    const html = String(content || '');
    if (!html.trim()) return token;
    return `${html}${token}`;
}

export function filterBadgeEmailVariables(variables, query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return variables;
    return variables.filter((item) => {
        const name = String(item.name || '').toLowerCase();
        const label = String(item.label || '').toLowerCase();
        const description = String(item.description || '').toLowerCase();
        return name.includes(q) || label.includes(q) || description.includes(q);
    });
}
