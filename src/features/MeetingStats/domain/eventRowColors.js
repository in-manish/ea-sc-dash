/** RGB triplets for per-event row tints (readable on light and dark). */
export const EVENT_ROW_COLORS = [
  '124, 58, 237',
  '14, 165, 233',
  '16, 185, 129',
  '245, 158, 11',
  '239, 68, 68',
  '99, 102, 241',
  '20, 184, 166',
  '236, 72, 153',
  '132, 204, 22',
  '168, 85, 247',
];

export function uniqueEventIds(rows) {
  const ids = [];
  for (const row of rows || []) {
    const id = row?.event_id;
    if (id == null || ids.includes(id)) continue;
    ids.push(id);
  }
  return ids;
}

export function eventRowColor(eventId, eventIds) {
  const index = eventIds.indexOf(eventId);
  const safe = index < 0 ? 0 : index % EVENT_ROW_COLORS.length;
  return EVENT_ROW_COLORS[safe];
}

export function eventRowStyle(rgb) {
  return {
    backgroundColor: `rgba(${rgb}, 0.1)`,
    borderLeft: `3px solid rgb(${rgb})`,
  };
}
