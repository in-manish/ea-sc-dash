/** Extra attendee-list columns. The built-in columns stay; these are optional. */
export const EXTRA_COLUMN_GROUPS = [
    {
        title: 'Work',
        fields: [
            { key: 'designation', label: 'Designation' },
            { key: 'company_address', label: 'Address' },
            { key: 'website', label: 'Website', kind: 'link' },
        ],
    },
    {
        title: 'Place',
        fields: [
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'country', label: 'Country' },
        ],
    },
    {
        title: 'IDs',
        fields: [
            { key: 'upload_id', label: 'Upload ID' },
            { key: 'obf_number', label: 'Booth' },
            { key: 'event_login_code', label: 'Login code' },
            { key: 'exhibitor_id', label: 'Exhibitor', kind: 'company' },
            { key: 'parent_exhibitor_id', label: 'Parent exhibitor', kind: 'company' },
        ],
    },
    {
        title: 'Status',
        fields: [
            { key: 'check_in', label: 'Checked in', kind: 'bool' },
            { key: 'email_sent', label: 'Email sent', kind: 'bool' },
            { key: 'sms_sent', label: 'SMS sent', kind: 'bool' },
            { key: 'wa_sent', label: 'WhatsApp sent', kind: 'bool' },
            { key: 'is_meeting_enabled', label: 'Meetings', kind: 'bool' },
            { key: 'is_poc', label: 'POC', kind: 'bool' },
        ],
    },
    {
        title: 'Dates',
        fields: [
            { key: 'created_at', label: 'Registered', kind: 'date' },
            { key: 'modified_at', label: 'Updated', kind: 'date' },
        ],
    },
];

export const EXTRA_COLUMNS = EXTRA_COLUMN_GROUPS.flatMap((group) => group.fields);

const EXTRA_COLUMN_KEYS = EXTRA_COLUMNS.map((column) => column.key);
const STORAGE_KEY = 'ea_dash_attendee_table_columns';

const COLUMN_TONES = [
    {
        header: 'bg-amber-100 text-amber-950',
        cell: 'bg-amber-50 group-hover:bg-amber-100',
        chip: 'bg-amber-100 text-amber-950 border-amber-300',
        edge: 'border-l-amber-400',
        mark: 'bg-amber-400',
    },
    {
        header: 'bg-sky-100 text-sky-950',
        cell: 'bg-sky-50 group-hover:bg-sky-100',
        chip: 'bg-sky-100 text-sky-950 border-sky-300',
        edge: 'border-l-sky-400',
        mark: 'bg-sky-400',
    },
    {
        header: 'bg-violet-100 text-violet-950',
        cell: 'bg-violet-50 group-hover:bg-violet-100',
        chip: 'bg-violet-100 text-violet-950 border-violet-300',
        edge: 'border-l-violet-400',
        mark: 'bg-violet-400',
    },
    {
        header: 'bg-emerald-100 text-emerald-950',
        cell: 'bg-emerald-50 group-hover:bg-emerald-100',
        chip: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        edge: 'border-l-emerald-400',
        mark: 'bg-emerald-400',
    },
    {
        header: 'bg-rose-100 text-rose-950',
        cell: 'bg-rose-50 group-hover:bg-rose-100',
        chip: 'bg-rose-100 text-rose-950 border-rose-300',
        edge: 'border-l-rose-400',
        mark: 'bg-rose-400',
    },
];

export function columnTone(index) {
    return COLUMN_TONES[index % COLUMN_TONES.length];
}

/** Saved keys, kept in catalog order. Empty means the default table only. */
export function loadTableColumns() {
    try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(saved)) return [];
        return EXTRA_COLUMN_KEYS.filter((key) => saved.includes(key));
    } catch {
        return [];
    }
}

export function saveTableColumns(keys) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(EXTRA_COLUMN_KEYS.filter((key) => keys.includes(key))),
        );
    } catch {
        // Private mode: the choice lasts for this visit only.
    }
}

export function formatColumnValue(column, attendee) {
    const raw = attendee?.[column.key];
    if (column.kind === 'bool') {
        if (raw == null || raw === '') return { empty: true, text: '—' };
        const on = raw === true || raw === 'true' || raw === 1 || raw === '1';
        return { text: on ? 'Yes' : 'No', on };
    }
    if (raw == null || raw === '') return { empty: true, text: '—' };
    if (column.kind === 'date') {
        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) return { text: String(raw), copy: String(raw) };
        const text = date.toLocaleString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
        });
        return { text, copy: text };
    }
    const text = String(raw);
    return { text, copy: text };
}
