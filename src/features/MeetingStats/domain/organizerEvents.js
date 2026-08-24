import { uniqueIds } from './meetingStatsQuery';
import { isContractorEvent } from './excludeContractors';

export function eventLabel(event) {
  const name = event?.name || event?.event_name || `Event ${event?.id}`;
  return name;
}

export function normalizeOrganizerEvents(...groups) {
  const byId = new Map();
  for (const group of groups) {
    for (const event of group || []) {
      const id = Number(event?.id);
      if (!Number.isFinite(id) || id <= 0) continue;
      if (isContractorEvent(event)) continue;
      const prev = byId.get(id);
      byId.set(id, {
        id,
        name: eventLabel(event) || prev?.name || `Event ${id}`,
      });
    }
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}

export function parseEventsPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

export function allEventIds(events) {
  return uniqueIds((events || []).map((event) => event.id));
}

export function matchesEventSearch(event, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return true;
  return String(event.name || '').toLowerCase().includes(q) || String(event.id).includes(q);
}
