import {
  formatRemindCounts,
  formatSentStatus,
  isRemindInFlight,
  reminderProgressPct,
} from '../domain/checklistReminderHelpers';

/** Inline progress while a checklist remind job is running (or just finished). */
export default function RemindSendProgress({ progress }) {
  if (!progress) return null;

  const pct = reminderProgressPct(progress);
  const status = progress.sent_status;
  const running = isRemindInFlight(status);
  const failed = status === 'failed';

  const barClass = failed
    ? 'bg-red-500'
    : status === 'completed'
      ? 'bg-green-600'
      : 'bg-accent';

  return (
    <div
      className={`rounded-md border px-3 py-2.5 space-y-2 ${
        failed
          ? 'border-red-200 bg-red-50'
          : 'border-border bg-bg-secondary'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-medium text-text-primary">
          {formatSentStatus(status)}
          {running ? '…' : ''}
        </span>
        <span className="tabular-nums text-text-secondary">
          {progress.processed ?? 0}/{progress.total ?? 0} · {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-bg-tertiary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="m-0 text-xs text-text-secondary">{formatRemindCounts(progress)}</p>
    </div>
  );
}
