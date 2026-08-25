export const EXHIBITOR_LIST_FILTER_KEYS = [
  'country',
  'location',
  'category',
  'parent_exhibitor_id',
  'parent_exhibitor_only',
  'is_badge_printed',
  'registered_co_exhibitor_count',
  'is_featured',
  'is_company_submit_locked',
  'hand_over',
];

const FILTER_CHIP_LABELS = {
  country: 'Country',
  location: 'Location',
  category: 'Category',
  parent_exhibitor_id: 'Parent ID',
  parent_exhibitor_only: 'Parents only',
  is_badge_printed: 'Badge',
  registered_co_exhibitor_count: 'Co-exhibitors',
  is_featured: 'Featured',
  is_company_submit_locked: 'Submit',
  hand_over: 'Handover',
};

const FILTER_CHIP_VALUES = {
  parent_exhibitor_only: { true: 'Yes' },
  is_badge_printed: { true: 'Printed', false: 'Not printed' },
  registered_co_exhibitor_count: { lt1: 'None', gt1: 'Has co-exhibitors' },
  is_featured: { true: 'Yes', false: 'No' },
  is_company_submit_locked: { true: 'Locked', false: 'Unlocked' },
  hand_over: { true: 'Handed over', false: 'Not handed over' },
};

export function parseExhibitorListFilters(searchParams) {
  const filters = {};
  EXHIBITOR_LIST_FILTER_KEYS.forEach((key) => {
    const val = searchParams.get(key);
    if (val) filters[key] = val;
  });
  return filters;
}

export function applyExhibitorListFilters(params, filters) {
  EXHIBITOR_LIST_FILTER_KEYS.forEach((key) => {
    if (filters[key]) params.set(key, filters[key]);
    else params.delete(key);
  });
}

export function removeExhibitorListFilter(filters, key) {
  const next = { ...filters };
  delete next[key];
  return next;
}

/** Active filters as chip rows: { key, label, value }. */
export function buildExhibitorFilterChips(filters) {
  return EXHIBITOR_LIST_FILTER_KEYS.filter((key) => filters[key]).map((key) => {
    const raw = String(filters[key]);
    return {
      key,
      label: FILTER_CHIP_LABELS[key] || key,
      value: FILTER_CHIP_VALUES[key]?.[raw] || raw,
    };
  });
}
