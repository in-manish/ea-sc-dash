const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})/;

/** Calendar dates have no timezone. Do not pass them through Date. */
export function formatCalendarDate(value) {
  const match = DATE_RE.exec(String(value || '').trim());
  if (!match) return '';
  const month = MONTHS[Number(match[2]) - 1];
  const day = Number(match[3]);
  if (!month || day < 1 || day > 31) return '';
  return `${day} ${month} ${match[1]}`;
}

export function formatClock(value) {
  const match = TIME_RE.exec(String(value || '').trim());
  return match ? `${match[1]}:${match[2]}` : '';
}

export function nullableDate(value) {
  const text = String(value || '').trim();
  return DATE_RE.test(text) ? text : null;
}

export function nullableTime(value) {
  return formatClock(value) || null;
}

export function readPermissionWindow(raw) {
  return {
    from_date: nullableDate(raw?.from_date),
    end_date: nullableDate(raw?.end_date),
    from_time: nullableTime(raw?.from_time),
    end_time: nullableTime(raw?.end_time),
    is_active: raw?.is_active !== false,
  };
}

export function formatDateRange(row) {
  const from = formatCalendarDate(row?.from_date);
  const end = formatCalendarDate(row?.end_date);
  if (from && end) return `${from} to ${end}`;
  if (from) return `From ${from}`;
  if (end) return `Until ${end}`;
  return 'Any date';
}

export function formatTimeRange(row) {
  const from = formatClock(row?.from_time);
  const end = formatClock(row?.end_time);
  if (!from && !end) return 'All day';
  if (from && end && end < from) return `${from} to ${end} (next day)`;
  if (from && end) return `${from} to ${end}`;
  return [from, end].filter(Boolean).join(' to ');
}

export function formatPermissionWindow(row) {
  const text = `${formatDateRange(row)} · ${formatTimeRange(row)}`;
  return row?.is_active === false ? `${text} · Inactive` : text;
}

export function validatePermissionWindow(form) {
  const fields = {};
  const fromDate = nullableDate(form.from_date);
  const endDate = nullableDate(form.end_date);
  const fromTime = nullableTime(form.from_time);
  const endTime = nullableTime(form.end_time);
  if (fromDate && endDate && endDate < fromDate) {
    fields.end_date = 'end_date cannot be before from_date.';
  }
  if (Boolean(fromTime) !== Boolean(endTime)) {
    const message = 'from_time and end_time must be set together.';
    fields.from_time = message;
    fields.end_time = message;
  }
  return fields;
}

/** PATCH body with only the fields that changed. Empty string clears a side to null. */
export function permissionCodePatch(original, form) {
  const prev = readPermissionWindow(original);
  const next = readPermissionWindow(form);
  const body = {};
  const name = String(form.name || '').trim();
  if (name !== String(original.name || '').trim()) body.name = name;
  ['from_date', 'end_date', 'from_time', 'end_time'].forEach((key) => {
    if (next[key] !== prev[key]) body[key] = next[key];
  });
  if (next.is_active !== prev.is_active) body.is_active = next.is_active;
  return body;
}

export function permissionCodeCreateBody({ code, name, ...window }) {
  const next = readPermissionWindow({ ...window, is_active: window.is_active !== false });
  return {
    code,
    name,
    is_active: next.is_active,
    from_date: next.from_date,
    end_date: next.end_date,
    from_time: next.from_time,
    end_time: next.end_time,
  };
}
