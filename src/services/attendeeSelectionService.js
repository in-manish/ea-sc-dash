const ALLOWED_SEARCH_QUERY_KEYS = new Set([
    'search_query',
    'search_type',
    'is_poc',
    'attendee_type',
    'reg_type',
    'city',
    'state',
    'country',
    'email_sent',
    'sms_sent',
    'check_in',
    'whatsapp_sent',
    'created_at',
    'modified_at',
    'created_at_start',
    'created_at_end',
    'modified_at_start',
    'modified_at_end',
    'sort_by',
    'sort_order'
]);

const BOOLEAN_KEYS = new Set([
    'is_poc',
    'email_sent',
    'sms_sent',
    'check_in',
    'whatsapp_sent'
]);

const DATE_START_KEYS = new Set(['created_at_start', 'modified_at_start']);
const DATE_END_KEYS = new Set(['created_at_end', 'modified_at_end']);

const getTimezoneOffsetSuffix = () => {
    const offsetMinutes = -new Date().getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absoluteMinutes = Math.abs(offsetMinutes);
    const hours = String(Math.floor(absoluteMinutes / 60)).padStart(2, '0');
    const minutes = String(absoluteMinutes % 60).padStart(2, '0');

    return `${sign}${hours}:${minutes}`;
};

const normalizeBooleanValue = (value) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
};

const normalizeDateValue = (key, value) => {
    if (typeof value !== 'string') return value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const suffix = getTimezoneOffsetSuffix();

    if (DATE_START_KEYS.has(key)) return `${value}T00:00:00${suffix}`;
    if (DATE_END_KEYS.has(key)) return `${value}T23:59:59${suffix}`;

    return `${value}T00:00:00${suffix}`;
};

export const attendeeSelectionService = {
    normalizeSearchQueries({ search = '', filters = {}, searchType = '', sortBy = '', sortOrder = '' } = {}) {
        const searchQueries = {
            search_query: search || ''
        };

        if (searchType) {
            searchQueries.search_type = searchType;
        }

        Object.entries(filters).forEach(([key, rawValue]) => {
            if (!ALLOWED_SEARCH_QUERY_KEYS.has(key)) return;
            if (rawValue === '' || rawValue === null || rawValue === undefined) return;
            if (Array.isArray(rawValue) && rawValue.length === 0) return;

            let value = Array.isArray(rawValue) ? rawValue.join(',') : rawValue;

            if (BOOLEAN_KEYS.has(key)) {
                value = normalizeBooleanValue(value);
            }

            if (typeof value === 'string') {
                value = value.trim();
            }

            if (value === '') return;

            if (key.includes('created_at') || key.includes('modified_at')) {
                value = normalizeDateValue(key, value);
            }

            searchQueries[key] = value;
        });

        if (sortBy) {
            searchQueries.sort_by = sortBy;
        }

        if (sortOrder) {
            searchQueries.sort_order = sortOrder;
        }

        return searchQueries;
    },

    buildSelection({ mode = 'none', attendeeUuids = [], search = '', filters = {}, searchType = '', sortBy = '', sortOrder = '' } = {}) {
        const uniqueUuids = [...new Set((attendeeUuids || []).filter(Boolean))];

        if (uniqueUuids.length > 0) {
            return {
                mode: 'selected',
                searchQueries: null,
                resolvedAttendeeUuids: uniqueUuids,
                payload: {
                    attendee_uuids: uniqueUuids
                }
            };
        }

        if (mode !== 'filtered' && mode !== 'all') {
            return {
                mode: 'none',
                searchQueries: null,
                resolvedAttendeeUuids: [],
                payload: null
            };
        }

        const searchQueries = this.normalizeSearchQueries({ search, filters, searchType, sortBy, sortOrder });
        const isAllSelection = mode === 'all' || (
            Object.keys(searchQueries).length === 1 &&
            searchQueries.search_query === ''
        );

        if (isAllSelection) {
            return {
                mode: 'all',
                searchQueries: { search_query: '' },
                resolvedAttendeeUuids: [],
                payload: {
                    search_queries: {
                        search_query: ''
                    }
                }
            };
        }

        return {
            mode: 'filtered',
            searchQueries,
            resolvedAttendeeUuids: [],
            payload: {
                search_queries: searchQueries
            }
        };
    }
};
