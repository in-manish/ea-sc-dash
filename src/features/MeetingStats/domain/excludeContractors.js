/** Hide contractor events, attendee types, and report rows. */
export function isContractorLabel(value) {
  return /contractor/i.test(String(value || ''));
}

export function isContractorEvent(event) {
  if (!event) return false;
  if (event.is_contractor === true) return true;
  const kind = String(event.event_type || event.type || event.category || '').toLowerCase();
  if (kind === 'contractor' || kind === 'contractors') return true;
  return isContractorLabel(event.name || event.event_name);
}
