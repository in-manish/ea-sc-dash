import { PAGE_SIZE } from '../constants';

export const EMPTY_LOOKUP = { mode: 'badge_uuid', value: '', thisEventOnly: false };
export const EMPTY_RESULT_FILTERS = { category: '', ratingType: '', sortBy: 'created_at', sortOrder: 'desc' };

export function validateLookup({ mode, value }) {
  const text = value.trim();
  if (!text) return mode === 'evc_id' ? 'Enter a SnapCard (EVC) ID.' : 'Enter a badge UUID.';
  if (mode === 'evc_id' && !/^[1-9]\d*$/.test(text)) return 'The SnapCard ID must be a positive whole number.';
  return '';
}

function identity({ mode, value }) {
  return { [mode]: value.trim() };
}

/** Summary covers every event unless the lookup is limited to the open event. */
export function buildSummaryQuery(lookup, eventId) {
  return {
    ...identity(lookup),
    ...(lookup.thisEventOnly && eventId ? { event_ids: eventId } : {}),
    limit: 20,
  };
}

export function buildDetailQuery(lookup, filters, page, eventId) {
  return {
    ...identity(lookup),
    ...(lookup.thisEventOnly && eventId ? { event_id: eventId } : {}),
    rating_category: filters.category,
    rating_type: filters.ratingType,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
    page,
    page_size: PAGE_SIZE,
  };
}
