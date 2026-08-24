export function parseStringList(value) {
  return String(value || '')
    .split(/[\s,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function uniqueIds(ids) {
  const seen = new Set();
  const out = [];
  for (const id of ids || []) {
    const n = Number(id);
    if (!Number.isFinite(n) || n <= 0 || seen.has(n)) continue;
    seen.add(n);
    out.push(n);
  }
  return out;
}

export function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/** Toggle an event id; keep at least one selected. */
export function toggleEventId(list, value) {
  const next = toggleValue(list, value);
  return next.length ? next : list;
}

export function emptyMeetingStatsFilters(eventId) {
  return {
    eventIds: uniqueIds([eventId]),
    senderAttendeeTypeNames: [],
    receiverAttendeeTypeNames: [],
    senderIds: '',
    meetingDate: '',
    rangeStart: '',
    rangeEnd: '',
    duration: [],
    status: [],
    uniqueParticipants: true,
  };
}

export function eventIdsFromFilters(eventId, filters) {
  const selected = uniqueIds(filters?.eventIds);
  return selected.length ? selected : uniqueIds([eventId]);
}

function dateRange(filters) {
  const start = String(filters?.rangeStart || '').trim();
  const end = String(filters?.rangeEnd || '').trim();
  if (start && end) return `${start},${end}`;
  return '';
}

function appendList(params, key, values) {
  if (!values?.length) return;
  params.set(key, values.join(','));
}

/** GET query. Range wins over a single meeting_date. Omits blank optionals. */
export function buildMeetingStatsQuery(eventId, filters, { refresh = false } = {}) {
  const params = new URLSearchParams();
  const eventIds = eventIdsFromFilters(eventId, filters);
  if (eventIds.length) params.set('event_ids', eventIds.join(','));

  appendList(params, 'sender_attendee_types_names', filters?.senderAttendeeTypeNames);
  appendList(params, 'receiver_attendee_types_names', filters?.receiverAttendeeTypeNames);
  appendList(params, 'sender_attendee_types', filters?.senderAttendeeTypes);
  appendList(params, 'receiver_attendee_types', filters?.receiverAttendeeTypes);

  const senderIds = parseStringList(filters?.senderIds);
  if (senderIds.length) params.set('sender_ids', senderIds.join(','));

  const range = dateRange(filters);
  if (range) params.set('meeting_date_range', range);
  else if (filters?.meetingDate) params.set('meeting_date', filters.meetingDate);

  appendList(params, 'duration', filters?.duration);
  appendList(params, 'status', filters?.status);

  params.set('unique_participants', filters?.uniqueParticipants === false ? 'false' : 'true');
  if (refresh) params.set('refresh', 'true');
  return params.toString();
}

/** POST JSON. Same filters as GET; emails required by caller. */
export function buildMeetingStatsBody(eventId, filters, emails) {
  const body = {
    event_ids: eventIdsFromFilters(eventId, filters),
    unique_participants: filters?.uniqueParticipants !== false,
  };

  if (filters?.senderAttendeeTypeNames?.length) {
    body.sender_attendee_types_names = filters.senderAttendeeTypeNames;
  }
  if (filters?.receiverAttendeeTypeNames?.length) {
    body.receiver_attendee_types_names = filters.receiverAttendeeTypeNames;
  }
  if (filters?.senderAttendeeTypes?.length) {
    body.sender_attendee_types = filters.senderAttendeeTypes;
  }
  if (filters?.receiverAttendeeTypes?.length) {
    body.receiver_attendee_types = filters.receiverAttendeeTypes;
  }

  const senderIds = parseStringList(filters?.senderIds);
  if (senderIds.length) body.sender_ids = senderIds;

  const range = dateRange(filters);
  if (range) body.meeting_date_range = range;
  else if (filters?.meetingDate) body.meeting_date = filters.meetingDate;

  if (filters?.duration?.length) body.duration = filters.duration;
  if (filters?.status?.length) body.status = filters.status;
  if (emails?.length) body.emails = emails;
  return body;
}
