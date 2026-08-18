/** GET /evc/events/:id/company_list/ sort_by values. Invalid → 404. */
export const COMPANY_LIST_SORT_FIELDS = [
  { value: 'space', label: 'Stall', defaultOrder: 'desc' },
  { value: 'space_num', label: 'Stall number', defaultOrder: 'desc' },
  { value: 'company_slug', label: 'Company name', defaultOrder: 'asc' },
  { value: 'obf_number', label: 'OBF number', defaultOrder: 'desc' },
  { value: 'obf_number_numeric', label: 'OBF (numeric)', defaultOrder: 'desc' },
  { value: 'obf_number_alphabet', label: 'OBF (letters) / slug', defaultOrder: 'asc' },
  { value: 'featured_rank', label: 'Featured rank', defaultOrder: 'asc' },
];

export const DEFAULT_COMPANY_SORT_BY = 'space';
export const DEFAULT_COMPANY_SORT_ORDER = 'desc';

const SORT_BY_VALUES = COMPANY_LIST_SORT_FIELDS.map((field) => field.value);

const HEADER_FIELDS = {
  company: ['company_slug', 'obf_number_alphabet'],
  obf: ['obf_number', 'obf_number_numeric'],
  stall: ['space', 'space_num'],
};

export function parseCompanySortBy(value) {
  return SORT_BY_VALUES.includes(value) ? value : DEFAULT_COMPANY_SORT_BY;
}

export function parseCompanySortOrder(value) {
  return value === 'asc' || value === 'desc' ? value : DEFAULT_COMPANY_SORT_ORDER;
}

export function defaultOrderForSortBy(sortBy) {
  const field = COMPANY_LIST_SORT_FIELDS.find((item) => item.value === sortBy);
  return field?.defaultOrder || DEFAULT_COMPANY_SORT_ORDER;
}

export function isHeaderSortActive(column, sortBy) {
  return Boolean(HEADER_FIELDS[column]?.includes(sortBy));
}

export function nextHeaderSort(column, sortBy, sortOrder) {
  const aliases = HEADER_FIELDS[column];
  if (!aliases) {
    return { sortBy, sortOrder };
  }
  if (aliases.includes(sortBy)) {
    return { sortBy, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' };
  }
  const nextBy = aliases[0];
  return { sortBy: nextBy, sortOrder: defaultOrderForSortBy(nextBy) };
}

/**
 * API ignores sort_by / sort_order when q is set, or featured-only with no q.
 * Organizer matchmaking-score override is not surfaced here.
 */
export function companyListSortOverride({ search, isFeatured }) {
  if (search) return 'Search uses relevance instead of this sort.';
  if (isFeatured === 'true') return 'Featured list is ordered by rank, then name.';
  return null;
}
