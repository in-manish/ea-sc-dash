import { parsePermissionCode } from './parsePermissionCodes';

function list(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  if (value == null || typeof value === 'object') return '';
  return String(value);
}

function permissionIds(value) {
  return list(value).map((item) => (item && typeof item === 'object' ? item.id ?? item.permission_id ?? '' : item))
    .filter((id) => id !== '' && id != null);
}

function count(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export const REASON_LABELS = {
  same_date: 'Same date',
  time_exact: 'same time',
  time_contains: 'time covers it',
  time_overlap: 'time overlaps',
  time_different: 'different time',
  no_time: 'no time to compare',
  open_dates: 'any date',
};

export function describeReasons(reasons) {
  return list(reasons).map((key) => REASON_LABELS[key] || key).join(', ');
}

/** Short label for a suggestion score. */
export function scoreLabel(score) {
  if (score >= 90) return 'Best match';
  if (score >= 70) return 'Good match';
  if (score >= 50) return 'Same day';
  return 'Weak match';
}

/** GET permission-sources/options/ → one row per SurveyJS option. */
export function parseServiceOptions(data) {
  return list(data).map((item) => {
    const option = item?.source_option || {};
    return {
      id: String(option.id ?? ''),
      title: String(option.title || '').trim() || `Option ${option.id ?? ''}`,
      price: String(option.price ?? ''),
      date: option.date || '',
      endDate: option.end_date || '',
      startTime: option.start_time || '',
      endTime: option.end_time || '',
      targets: list(item?.target_options).map(parsePermissionCode).filter(Boolean),
      recommended: list(item?.recommended)
        .map((row) => ({
          permission: parsePermissionCode(row?.permission),
          score: count(row?.score),
          reasons: list(row?.reasons),
        }))
        .filter((row) => row.permission),
      pending: count(item?.pending_attendees),
    };
  }).filter((row) => row.id);
}

export function parsePushResult(data) {
  return {
    saved: count(data?.saved),
    errors: list(data?.errors).map((row) => ({
      id: String(row?.id ?? ''),
      field: String(row?.field || ''),
      message: String(row?.message || ''),
    })),
  };
}

export function parseMappingResult(data) {
  return {
    saved: count(data?.saved),
    resolved: count(data?.resolved),
    errors: list(data?.errors).map((row) => ({
      id: String(row?.source_option_id ?? ''),
      message: String(row?.message || ''),
    })),
  };
}

export function parseBackfillResult(data) {
  const totals = data?.totals || {};
  return {
    batchId: data?.batch_id || '',
    dryRun: Boolean(data?.dry_run),
    totals: {
      records: count(totals.records),
      added: count(totals.added),
      alreadyMapped: count(totals.already_mapped),
      unmappedOption: count(totals.unmapped_option),
      unknownBadge: count(totals.unknown_badge),
      skipped: count(totals.skipped),
      error: count(totals.error),
    },
    results: list(data?.results).map((row) => ({
      uuid: String(row?.uuid || row?.badge_uuid || ''),
      optionId: String(row?.option_id ?? row?.source_option_id ?? ''),
      status: String(row?.status || row?.action || '').toLowerCase(),
      permissions: permissionIds(row?.permissions),
      message: text(row?.message) || text(row?.error) || text(row?.detail) || text(row?.detail?.error) || text(row?.detail?.reason),
    })),
    retry: data?.retry ? { checked: count(data.retry.checked), resolved: count(data.retry.resolved) } : null,
  };
}

export function parseLedger(data) {
  return {
    total: count(data?.total),
    page: count(data?.page) || 1,
    pageSize: count(data?.page_size) || 50,
    counts: data?.counts && typeof data.counts === 'object' ? data.counts : {},
    rows: list(data?.results).map((row) => ({
      id: row?.id,
      badgeUuid: String(row?.badge_uuid || ''),
      optionId: String(row?.source_option_id || ''),
      optionTitle: String(row?.source_option_title || ''),
      permissions: list(row?.permissions).map((item) => ({
        id: item?.id, code: String(item?.code || ''), name: String(item?.name || ''),
      })),
      action: String(row?.action || ''),
      via: String(row?.via || ''),
      batchId: String(row?.batch_id || ''),
      pending: Boolean(row?.has_pending),
      updatedAt: row?.updated_at || row?.created_at || '',
      entries: list(row?.entries).map((entry) => ({
        optionId: String(entry?.option_id || ''),
        optionTitle: String(entry?.option_title || ''),
        action: String(entry?.action || ''),
        resolved: Boolean(entry?.resolved_at),
        reason: String(entry?.detail?.reason || ''),
        error: String(entry?.detail?.error || ''),
      })),
    })),
  };
}

export const LEDGER_ACTIONS = ['ADDED', 'ALREADY_MAPPED', 'UNMAPPED_OPTION', 'UNKNOWN_BADGE', 'ERROR'];
export const LEDGER_VIA = ['ATTENDEE_CREATE_API', 'ATTENDEE_UPDATE_API', 'BACKFILL_API', 'BACKFILL_COMMAND', 'RETRY_PENDING'];
