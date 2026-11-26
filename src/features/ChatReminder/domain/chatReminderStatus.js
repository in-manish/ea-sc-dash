const PERIOD_MINUTES = { seconds: 1 / 60, minutes: 1, hours: 60, days: 1440 };

/** Beat interval in whole minutes, or null when unknown. */
export function scheduleMinutes(schedule) {
  if (!schedule || !schedule.every || !PERIOD_MINUTES[schedule.period]) return null;
  return Math.max(1, Math.round(schedule.every * PERIOD_MINUTES[schedule.period]));
}

/** Switch row for a key from status.kill_switch.switches; missing row means sending is allowed. */
export function killSwitchRow(status, key) {
  return (status?.kill_switch?.switches || []).find((row) => row.key === key) || null;
}

/** True when this email type is stopped by its own switch (the global email.all switch is shown separately). */
export function isReminderStopped(status) {
  const row = killSwitchRow(status, status?.kill_switch?.type_key);
  return !!row && row.is_enabled === false;
}

/** Real timestamp from the API (ISO with zone) → local readable text. */
export function formatTimestamp(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
}

/** "202, 305" → [202, 305]; ignores anything that is not a positive whole number. */
export function parseReceiverIds(text) {
  return String(text || '')
    .split(/[\s,]+/)
    .map((part) => Number(part))
    .filter((n) => Number.isInteger(n) && n > 0);
}

export const OUTCOME_LABELS = {
  dry_run: 'Would email',
  sent: 'Sent',
  skipped: 'Skipped',
  unknown: 'Unknown result',
  error: 'Error',
};
