export function formatAudience(audience) {
  if (audience == null || audience === '') return 'Default';
  return String(audience).replace(/_/g, ' ');
}

export function formatEventId(eventId) {
  if (eventId == null || eventId === '') return 'All events';
  return `#${eventId}`;
}

export function formatFromName(name) {
  if (name == null || name === '') return '—';
  return String(name);
}

export function formatTemplateDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export function eventFilterId(item) {
  if (item == null) return '';
  if (typeof item === 'object') return item.id ?? '';
  return item;
}
