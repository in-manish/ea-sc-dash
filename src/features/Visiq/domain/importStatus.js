export const IMPORT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const TONE = {
  pending: 'bg-bg-tertiary text-text-secondary',
  processing: 'bg-sky-500/10 text-sky-700',
  completed: 'bg-emerald-500/10 text-emerald-700',
  failed: 'bg-red-500/10 text-red-700',
};

export function importStatusLabel(status) {
  const found = IMPORT_STATUSES.find((s) => s.value === status);
  return found?.label || status || '—';
}

export function importStatusTone(status) {
  return TONE[status] || 'bg-bg-tertiary text-text-secondary';
}

export function isImportActive(status) {
  return status === 'pending' || status === 'processing';
}

export function formatBytes(size) {
  const n = Number(size) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
