/** Locale datetime for list/detail rows; empty → em dash. */
export function formatDateTime(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

/** Compact list date: "Aug 25" or "Aug 25, 2025" if not this year. */
export function formatShortDate(value) {
  if (!value) return '—';
  try {
    const d = new Date(value);
    const now = new Date();
    const opts =
      d.getFullYear() === now.getFullYear()
        ? { month: 'short', day: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString(undefined, opts);
  } catch {
    return String(value);
  }
}
