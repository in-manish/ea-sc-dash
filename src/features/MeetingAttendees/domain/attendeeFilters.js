import { COUNT_FILTERS, PAGE_SIZE } from '../constants';

function countOrNull(value) {
  if (value === '' || value == null) return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

/** Filters shared by the list (GET query) and the send (POST body), so both pick the same people. */
export function buildFilterBody(filters) {
  const body = { attendee_type_ids: filters.attendeeTypeIds };
  COUNT_FILTERS.forEach(({ key, apiPrefix }) => {
    const min = countOrNull(filters[`${key}Min`]);
    const max = countOrNull(filters[`${key}Max`]);
    if (min !== null) body[`${apiPrefix}_min`] = min;
    if (max !== null) body[`${apiPrefix}_max`] = max;
  });
  if (filters.hasEmail) body.has_email = true;
  return body;
}

export function buildListQuery(filters, page) {
  const { attendee_type_ids: typeIds, ...rest } = buildFilterBody(filters);
  const params = new URLSearchParams();
  params.set('attendee_type_ids', typeIds.join(','));
  Object.entries(rest).forEach(([name, value]) => params.set(name, value === true ? 'true' : value));
  params.set('page', page);
  params.set('page_size', PAGE_SIZE);
  return params.toString();
}

export function validateFilters(filters) {
  if (filters.attendeeTypeIds.length === 0) return 'Select at least one attendee type.';
  for (const { key, label } of COUNT_FILTERS) {
    const min = countOrNull(filters[`${key}Min`]);
    const max = countOrNull(filters[`${key}Max`]);
    if (min !== null && max !== null && min > max) {
      return `${label}: "at least" cannot be bigger than "at most".`;
    }
  }
  return '';
}

export function toggleId(list, id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
