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
