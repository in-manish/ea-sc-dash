export const EXHIBITOR_LIST_FILTER_KEYS = [
  'country',
  'location',
  'category',
  'product',
  'parent_exhibitor_id',
  'parent_exhibitor_only',
  'is_badge_printed',
  'registered_co_exhibitor_count',
  'is_featured',
  'boosted',
  'is_company_submit_locked',
  'hand_over',
];

const FILTER_CHIP_LABELS = {
  country: 'Country',
  location: 'Location',
  category: 'Category',
  product: 'Product',
  parent_exhibitor_id: 'Parent ID',
  parent_exhibitor_only: 'Parents only',
  is_badge_printed: 'Badge',
  registered_co_exhibitor_count: 'Co-exhibitors',
  is_featured: 'Featured',
  boosted: 'Boosted',
  is_company_submit_locked: 'Submit',
  hand_over: 'Handover',
};

const FILTER_CHIP_VALUES = {
  parent_exhibitor_only: { true: 'Yes' },
  is_badge_printed: { true: 'Printed', false: 'Not printed' },
  registered_co_exhibitor_count: { lt1: 'None', gt1: 'Has co-exhibitors' },
  is_featured: { true: 'Yes', false: 'No' },
  boosted: { true: 'Yes', false: 'No' },
  is_company_submit_locked: { true: 'Locked', false: 'Unlocked' },
  hand_over: { true: 'Handed over', false: 'Not handed over' },
};

// Filters that hold several values: one URL/API param per value (names can contain commas).
export const MULTI_VALUE_FILTER_KEYS = ['product'];

export function parseExhibitorListFilters(searchParams) {
  const filters = {};
  EXHIBITOR_LIST_FILTER_KEYS.forEach((key) => {
    if (MULTI_VALUE_FILTER_KEYS.includes(key)) {
      const vals = searchParams.getAll(key).filter(Boolean);
      if (vals.length) filters[key] = vals;
      return;
    }
    const val = searchParams.get(key);
    if (val) filters[key] = val;
  });
  return filters;
}

export function applyExhibitorListFilters(params, filters) {
  EXHIBITOR_LIST_FILTER_KEYS.forEach((key) => {
    params.delete(key);
    const val = filters[key];
    if (MULTI_VALUE_FILTER_KEYS.includes(key)) {
      (val || []).forEach((v) => params.append(key, v));
    } else if (val) {
      params.set(key, val);
    }
  });
}

export function removeExhibitorListFilter(filters, key) {
  const next = { ...filters };
  delete next[key];
  return next;
}

/** Active filters as chip rows: { key, label, value }. */
export function buildExhibitorFilterChips(filters) {
  return EXHIBITOR_LIST_FILTER_KEYS.filter((key) => filters[key] && filters[key].length).map((key) => {
    const raw = Array.isArray(filters[key]) ? filters[key].join(', ') : String(filters[key]);
    return {
      key,
      label: FILTER_CHIP_LABELS[key] || key,
      value: FILTER_CHIP_VALUES[key]?.[raw] || raw,
    };
  });
}
