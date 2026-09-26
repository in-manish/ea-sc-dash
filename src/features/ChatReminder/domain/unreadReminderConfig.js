export const DEFAULT_UNREAD_REMINDER_CONFIG = {
  activate: false,
  cooldown_minutes: 20,
  cutoff_minutes: 90,
  days_window: 200,
};

function toInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.round(n));
}

export function normalizeUnreadReminderConfig(raw = {}) {
  return {
    activate: !!raw.activate,
    cooldown_minutes: toInt(
      raw.cooldown_minutes,
      DEFAULT_UNREAD_REMINDER_CONFIG.cooldown_minutes
    ),
    cutoff_minutes: toInt(
      raw.cutoff_minutes,
      DEFAULT_UNREAD_REMINDER_CONFIG.cutoff_minutes
    ),
    days_window: toInt(
      raw.days_window,
      DEFAULT_UNREAD_REMINDER_CONFIG.days_window
    ),
  };
}

export function buildUnreadReminderPayload(config) {
  return normalizeUnreadReminderConfig(config);
}

export function isUnreadReminderDirty(current, original) {
  return (
    JSON.stringify(normalizeUnreadReminderConfig(current)) !==
    JSON.stringify(normalizeUnreadReminderConfig(original))
  );
}
