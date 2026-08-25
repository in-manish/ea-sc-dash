import { subscriberDisplayName } from './subscriberStatus';

const PRIORITY_KEYS = ['CITY', 'STATE', 'INDUSTRY', 'COMPANY', 'DESIGNATION', 'PHONE'];

/** Tag names for chips. */
export function subscriberTagNames(subscriber) {
  return (subscriber?.tags || []).map((t) => t.name).filter(Boolean);
}

export function formatPropValue(value) {
  if (value == null || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

/**
 * Prioritized property values as a single scan line (no labels).
 * e.g. "Mumbai · Maharashtra · Hotel"
 */
export function subscriberContextLine(subscriber, limit = 3) {
  const props = subscriber?.properties || [];
  const byKey = new Map(
    props.map((p) => [String(p.key || '').toUpperCase(), p])
  );
  const parts = [];
  for (const key of PRIORITY_KEYS) {
    const prop = byKey.get(key);
    if (!prop) continue;
    const text = formatPropValue(prop.value);
    if (!text || text === '—') continue;
    parts.push(text);
    if (parts.length >= limit) break;
  }
  if (parts.length < limit) {
    for (const prop of props) {
      const key = String(prop.key || '').toUpperCase();
      if (key === 'NAME' || PRIORITY_KEYS.includes(key)) continue;
      const text = formatPropValue(prop.value);
      if (!text || text === '—') continue;
      parts.push(text);
      if (parts.length >= limit) break;
    }
  }
  return parts.join(' · ');
}

export function subscriberRowSummary(subscriber) {
  const tags = subscriberTagNames(subscriber);
  const props = subscriber?.properties || [];
  return {
    name: subscriberDisplayName(subscriber),
    tags,
    contextLine: subscriberContextLine(subscriber),
    propertyCount: props.length,
    tagCount: tags.length,
  };
}
