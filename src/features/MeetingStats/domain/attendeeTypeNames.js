import { isContractorLabel } from './excludeContractors';

function typeName(type) {
  return String(type?.name || type || '').trim();
}

/** Unique attendee type names across events, contractors omitted, sorted. */
export function mergeAttendeeTypeNames(groups) {
  const seen = new Set();
  const names = [];
  for (const group of groups || []) {
    for (const type of group || []) {
      const name = typeName(type);
      if (!name || isContractorLabel(name)) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      names.push(name);
    }
  }
  return names.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

export function attendeeTypeChipOptions(names) {
  return (names || []).map((name) => ({ value: name, label: name }));
}

export function keepKnownTypeNames(selected, names) {
  const allowed = new Set((names || []).map((name) => name.toLowerCase()));
  return (selected || []).filter((name) => allowed.has(String(name).toLowerCase()));
}
