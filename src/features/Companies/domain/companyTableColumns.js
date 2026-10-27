import { boostScopeToText } from './companyBoost';
import { positiveSponsorRank } from './sponsorRank';
import { formatColumnValue } from '../../Attendees/domain/tableColumns';

/** Extra company-list columns. Company, details, stall, category, products, and badges stay. */
export const COMPANY_COLUMN_GROUPS = [
    {
        title: 'Profile',
        fields: [
            { key: 'website', label: 'Website', kind: 'link' },
            { key: 'address', label: 'Address' },
            { key: 'location', label: 'Location' },
            { key: 'company_detail', label: 'About' },
        ],
    },
    {
        title: 'Sales',
        fields: [
            { key: 'sales_person', label: 'Sales person' },
            { key: 'sponsor_rank', label: 'Sponsor rank', kind: 'rank' },
            { key: 'boost_rank', label: 'Boost rank', kind: 'rank' },
            { key: 'boost_scope', label: 'Boost scope', kind: 'scope' },
        ],
    },
    {
        title: 'Limits',
        fields: [
            { key: 'meeting_diary_limit', label: 'Meeting limit' },
            { key: 'invitee_count', label: 'Invitees' },
            { key: 'badge_count', label: 'Badge count' },
            { key: 'remain_badge_limit_count', label: 'Badges left' },
        ],
    },
    {
        title: 'Status',
        fields: [
            { key: 'is_payment_made', label: 'Payment made', kind: 'bool' },
            { key: 'is_badge_printed', label: 'Badge printed', kind: 'bool' },
            { key: 'is_company_submit_locked', label: 'Submit locked', kind: 'bool' },
            { key: 'all_badges_handed_over', label: 'Handed over', kind: 'bool' },
        ],
    },
    {
        title: 'Ops',
        fields: [
            { key: 'bin_number', label: 'Bin' },
            { key: 'water_coupon', label: 'Water coupon' },
        ],
    },
];

export const COMPANY_COLUMNS = COMPANY_COLUMN_GROUPS.flatMap((group) => group.fields);

const COMPANY_COLUMN_KEYS = COMPANY_COLUMNS.map((column) => column.key);
const STORAGE_KEY = 'ea_dash_company_table_columns';

export function loadCompanyColumns() {
    try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
        if (!Array.isArray(saved)) return [];
        return COMPANY_COLUMN_KEYS.filter((key) => saved.includes(key));
    } catch {
        return [];
    }
}

export function saveCompanyColumns(keys) {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(COMPANY_COLUMN_KEYS.filter((key) => keys.includes(key))),
        );
    } catch {
        // Private mode: the choice lasts for this visit only.
    }
}

export function formatCompanyColumn(column, company) {
    if (column.kind === 'rank') {
        const rank = positiveSponsorRank(company?.[column.key]);
        if (rank == null) return { empty: true, text: '—' };
        return { text: String(rank), copy: String(rank) };
    }
    if (column.kind === 'scope') {
        const text = boostScopeToText(company?.boost_scope);
        if (!text) return { empty: true, text: '—' };
        return { text, copy: text };
    }
    return formatColumnValue(column, company);
}
