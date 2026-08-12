export const DEFAULT_CHECKLIST_REMINDER_SETTINGS = {
  enabled: false,
  version: 1,
  portal_base_url: '',
  reminder_offsets_days: [7, 1],
};

export function normalizeChecklistSettings(data) {
  return {
    enabled: Boolean(data?.enabled),
    version: Number.isInteger(data?.version) ? data.version : 1,
    portal_base_url: data?.portal_base_url ?? '',
    reminder_offsets_days: Array.isArray(data?.reminder_offsets_days)
      ? data.reminder_offsets_days
      : [7, 1],
  };
}

/** Parse "7, 1" → unique positive integers (sorted desc by magnitude common for offsets). */
export function parseOffsetDaysInput(raw) {
  if (!raw || !String(raw).trim()) return [];
  const nums = String(raw)
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s));

  if (nums.some((n) => !Number.isInteger(n) || n <= 0)) {
    throw new Error('Offsets must be unique positive integers (e.g. 7, 1).');
  }

  const unique = [...new Set(nums)];
  if (unique.length !== nums.length) {
    throw new Error('Offsets must be unique positive integers (e.g. 7, 1).');
  }
  return unique;
}

export function formatOffsetDays(days) {
  if (!Array.isArray(days) || !days.length) return '';
  return days.join(', ');
}

export function formatReminderSentAt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export function formatStepId(stepId) {
  if (!stepId) return '—';
  return String(stepId).replace(/_/g, ' ');
}
