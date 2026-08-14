export const EMPTY_TEMPLATE_FILTERS = {
  search: '',
  name: '',
  template_type: '',
  event: '',
  is_active: '',
};

export const EMPTY_FILTER_OPTIONS = {
  names: [],
  template_types: [],
  events: [],
};

function asList(value) {
  return Array.isArray(value) ? value : [];
}

export function eventOptionId(item) {
  if (item == null || item === '') return '';
  if (typeof item === 'object') return String(item.id ?? '');
  return String(item);
}

export function parseTemplateFilterOptions(filters, prev = EMPTY_FILTER_OPTIONS) {
  const src = filters && typeof filters === 'object' ? filters : {};
  const names = asList(src.names).length ? asList(src.names) : asList(src.email_names);
  const templateTypes = asList(src.template_types);
  const events = asList(src.events).map(eventOptionId).filter(Boolean);

  return {
    names: names.length ? names : prev.names,
    template_types: templateTypes.length ? templateTypes : prev.template_types,
    events: events.length ? events : prev.events,
  };
}

export function hasActiveTemplateFilters(filters, eventId) {
  if (!filters) return false;
  if (filters.search || filters.name || filters.template_type || filters.is_active) return true;
  return String(filters.event || '') !== String(eventId || '');
}
