export const DEFAULT_CHECKLIST_REMINDER_SETTINGS = {
  enabled: false,
  version: 1,
  portal_base_url: '',
  reminder_offsets_days: [7, 1],
};

export const REMIND_POLL_MS = 2500;

export const SENT_STATUS_LABELS = {
  pending: 'Queued',
  in_progress: 'Running',
  completed: 'Done',
  failed: 'Failed',
};

export const COMPANY_REMIND_STATUS_LABELS = {
  pending: 'Pending',
  sent: 'Sent',
  skipped: 'Skipped',
  error: 'Error',
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

/** Parse "7, 1" → unique positive integers. */
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
  if (!stepId) return 'All incomplete';
  return String(stepId).replace(/_/g, ' ');
}

/** Batch-level step ids from log/progress (`step_ids`) or legacy single `step_id`. */
export function batchStepIds(row) {
  if (Array.isArray(row?.step_ids) && row.step_ids.length) return row.step_ids;
  const fromAddl = row?.addl_data?.step_ids;
  if (Array.isArray(fromAddl) && fromAddl.length) return fromAddl;
  if (row?.step_id) return [row.step_id];
  return [];
}

export function formatBatchSteps(row) {
  const ids = batchStepIds(row);
  if (!ids.length) return 'All incomplete';
  if (ids.length === 1) return formatStepId(ids[0]);
  return ids.map(formatStepId).join(', ');
}

/** Per-company steps[]; falls back to legacy top-level step fields. */
export function companySteps(company) {
  if (Array.isArray(company?.steps) && company.steps.length) return company.steps;
  if (company?.step_id || company?.step_title || company?.cta_url) {
    return [
      {
        step_id: company.step_id,
        step_title: company.step_title,
        cta_url: company.cta_url,
        deadline: company.deadline,
      },
    ];
  }
  return [];
}

export function formatSentStatus(status) {
  if (!status) return '—';
  return SENT_STATUS_LABELS[status] || String(status);
}

export function isRemindInFlight(status) {
  return status === 'pending' || status === 'in_progress';
}

export function reminderProgressPct(row) {
  if (row?.percentage != null && Number.isFinite(Number(row.percentage))) {
    return Math.min(100, Math.max(0, Number(row.percentage)));
  }
  const total = Number(row?.total) || 0;
  const processed = Number(row?.processed) || 0;
  if (!total) return row?.sent_status === 'completed' ? 100 : 0;
  return Math.min(100, Math.round((processed / total) * 100));
}

export function formatRemindCounts(row) {
  if (!row) return '';
  const { sent = 0, skipped = 0, errors = 0, total = 0 } = row;
  if (total === 0) return 'Nothing to send';
  return `Sent ${sent} · skipped ${skipped} · errors ${errors} (of ${total})`;
}

export function remindSuccessMessage(result, fallback) {
  if (!result) return fallback || 'Reminder sent.';
  if ((result.total ?? 0) === 0) {
    return 'Nothing to send — no matching incomplete companies.';
  }
  if (result.sent_status === 'failed') {
    return `Reminder failed. ${formatRemindCounts(result)}`;
  }
  return formatRemindCounts(result);
}

export function companiesFromAddlData(row) {
  const list = row?.addl_data?.companies;
  return Array.isArray(list) ? list : [];
}
