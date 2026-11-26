/** Editable reminder settings, mirroring EA's bounds (meeting/helpers/chat_reminder_helper/chat_reminder_settings.py). */
export const CONFIG_FIELDS = [
  { key: 'cutoff_minutes', label: 'Minimum unread time before reminder', unit: 'minutes', min: 1, max: 10080, hint: 'A message becomes eligible only after it has stayed unread this long (e.g. 90).' },
  { key: 'days_window', label: 'Ignore messages older than', unit: 'days', min: 1, max: 365, hint: 'Messages sent before this are never reminded.' },
  { key: 'min_gap_minutes', label: 'Minimum gap between emails', unit: 'minutes', min: 0, max: 10080, hint: 'Per person. 0 = no gap.' },
  { key: 'max_digests_per_day', label: 'Max reminder emails per day', unit: 'per person', min: 0, max: 24, hint: 'Rolling 24 hours. 0 = no limit.' },
];

export const DEFAULT_CONFIG = {
  activate: false,
  cutoff_minutes: 90,
  days_window: 20,
  min_gap_minutes: 180,
  max_digests_per_day: 2,
  event_id: 0,
  go_live_ms: 0,
  go_live_at: null,
  settings_row_id: null,
  extra_settings_rows: [],
};

export function normalizeConfig(raw = {}) {
  return { ...DEFAULT_CONFIG, ...(raw && typeof raw === 'object' ? raw : {}) };
}

/** Fields whose value differs from the saved config, as the PATCH body. Empty object = nothing to save. */
export function changedFields(draft, saved) {
  const body = {};
  ['activate', 'event_id', ...CONFIG_FIELDS.map((f) => f.key)].forEach((key) => {
    if (draft[key] !== saved[key]) body[key] = draft[key];
  });
  return body;
}

/** Same rules as the API, so most mistakes show before saving. Returns {field: message}. */
export function validateConfig(draft) {
  const errors = {};
  CONFIG_FIELDS.forEach(({ key, min, max }) => {
    const value = draft[key];
    if (!Number.isInteger(value) || value < min || value > max) {
      errors[key] = `Whole number from ${min} to ${max}.`;
    }
  });
  if (!Number.isInteger(draft.event_id) || draft.event_id < 0) errors.event_id = 'Pick an event or none.';
  return errors;
}

/** Input text → integer, or '' while the box is empty. */
export function parseIntInput(text) {
  if (text === '') return '';
  const n = Number(text);
  return Number.isFinite(n) ? Math.round(n) : '';
}

/** One sentence that explains the saved rules, e.g. for the top of the settings card. */
export function describeRules(config) {
  const parts = [`A message is reminded once it has been unread for ${config.cutoff_minutes} min`];
  parts.push(`only if it was sent after go-live and within the last ${config.days_window} days`);
  const limits = [];
  if (config.min_gap_minutes) limits.push(`at least ${config.min_gap_minutes} min apart`);
  if (config.max_digests_per_day) limits.push(`at most ${config.max_digests_per_day} per day`);
  return `${parts.join(', ')}. Each message is reminded once${limits.length ? `; emails per person are ${limits.join(' and ')}` : ''}.`;
}
