import { attendeeSelectionService } from '../../../services/attendeeSelectionService';

/** Keys are the field names EA's POST /events/:id/user/export/ understands (badge/views/ExportUserData.py). */
export const EXPORT_FIELD_GROUPS = [
    {
        title: 'Contact',
        fields: [
            { key: 'reg_id', label: 'Reg ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone_number', label: 'Phone number' },
        ],
    },
    {
        title: 'Work',
        fields: [
            { key: 'designation', label: 'Designation' },
            { key: 'company', label: 'Company' },
            { key: 'company_address', label: 'Company address' },
            { key: 'website', label: 'Website' },
        ],
    },
    {
        title: 'Location',
        fields: [
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            { key: 'country', label: 'Country' },
        ],
    },
    {
        title: 'Registration',
        fields: [
            { key: 'attendee_type', label: 'Attendee type' },
            { key: 'reg_type', label: 'Registration type' },
            { key: 'created_at', label: 'Registered at' },
            { key: 'modified_at', label: 'Last updated' },
        ],
    },
    {
        title: 'Status',
        fields: [
            { key: 'email_sent', label: 'Email sent' },
            { key: 'sms_sent', label: 'SMS sent' },
            { key: 'check_in', label: 'Checked in' },
        ],
    },
];

export const ALL_EXPORT_FIELD_KEYS = EXPORT_FIELD_GROUPS.flatMap((group) =>
    group.fields.map((field) => field.key)
);

export const EXPORT_PRESETS = [
    {
        id: 'essentials',
        label: 'Essentials',
        fields: ['reg_id', 'name', 'email', 'phone_number', 'company', 'designation', 'attendee_type'],
    },
    { id: 'all', label: 'All fields', fields: ALL_EXPORT_FIELD_KEYS },
    { id: 'none', label: 'Clear', fields: [] },
];

export const EXPORT_FILE_TYPES = [
    { value: 'csv', label: 'CSV', hint: 'Opens in Excel and Google Sheets' },
    { value: 'xlsx', label: 'Excel', hint: '.xlsx workbook' },
    { value: 'pdf', label: 'PDF', hint: 'Printable list' },
];

/** EA emails the file instead of returning a link above this many rows. */
export const EXPORT_INLINE_LIMIT = 50;

export const DEFAULT_EXPORT_PREFS = {
    fields: EXPORT_PRESETS[0].fields,
    type: 'csv',
};

const PREFS_KEY = 'ea_dash_attendee_export_prefs';

/** Saved choices, validated against the known keys. Falls back to defaults when storage is unavailable. */
export function loadExportPrefs() {
    try {
        const saved = JSON.parse(window.localStorage.getItem(PREFS_KEY) || 'null');
        const fields = (saved?.fields || []).filter((key) => ALL_EXPORT_FIELD_KEYS.includes(key));
        const type = EXPORT_FILE_TYPES.some((t) => t.value === saved?.type) ? saved.type : 'csv';
        return fields.length ? { fields, type } : DEFAULT_EXPORT_PREFS;
    } catch {
        return DEFAULT_EXPORT_PREFS;
    }
}

export function saveExportPrefs(prefs) {
    try {
        window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
        // Private mode or blocked storage: the choice just isn't remembered.
    }
}

/**
 * Who gets exported: the ticked rows, otherwise everything matching the current search and filters.
 * Returns { count, scope: { uuids } | { search_queries } }.
 */
export function buildExportScope({ selectionMode, selectedAttendeeUuids, search, searchType, filters, total, hasActiveSearchOrFilters }) {
    if (selectionMode === 'selected' && selectedAttendeeUuids.length) {
        return { count: selectedAttendeeUuids.length, scope: { uuids: selectedAttendeeUuids } };
    }
    const { payload } = attendeeSelectionService.buildSelection({
        mode: hasActiveSearchOrFilters ? 'filtered' : 'all',
        search,
        searchType,
        filters,
    });
    return { count: total, scope: { search_queries: payload.search_queries } };
}

/** Keep the checkbox order from the picker groups so the request is stable. */
export function orderFields(fields) {
    return ALL_EXPORT_FIELD_KEYS.filter((key) => fields.includes(key));
}
