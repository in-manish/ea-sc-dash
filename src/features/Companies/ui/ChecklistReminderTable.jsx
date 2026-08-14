import { Fragment, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  formatBatchSteps,
  formatRemindCounts,
  formatReminderSentAt,
  formatSentStatus,
  reminderProgressPct,
} from '../domain/checklistReminderHelpers';
import ChecklistReminderCompanies, {
  logCompanies,
} from './ChecklistReminderCompanies';

/** Batch reminder log table. Expand row for addl_data companies. */
export default function ChecklistReminderTable({ eventId, results, loading, error }) {
  const [openId, setOpenId] = useState(null);

  if (loading) {
    return (
      <div className="py-16 text-center text-text-tertiary text-sm animate-pulse">
        Loading reminders…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="py-16 text-center text-text-tertiary text-sm">
        No reminders found for these filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-border rounded-lg bg-bg-primary">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-bg-secondary text-xs uppercase tracking-wide text-text-tertiary">
            <th className="px-4 py-3 font-semibold w-8" />
            <th className="px-4 py-3 font-semibold">Finished</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Trigger</th>
            <th className="px-4 py-3 font-semibold">Step</th>
            <th className="px-4 py-3 font-semibold">Progress</th>
            <th className="px-4 py-3 font-semibold">Counts</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => {
            const open = openId === row.id;
            const companies = logCompanies(row);
            const pct = reminderProgressPct(row);
            return (
              <Fragment key={row.id}>
                <tr
                  className="border-b border-border hover:bg-bg-secondary/60 cursor-pointer"
                  onClick={() => setOpenId(open ? null : row.id)}
                >
                  <td className="px-4 py-3 text-text-tertiary">
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-text-primary">
                    {formatReminderSentAt(row.sent_at || row.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={row.sent_status} />
                  </td>
                  <td className="px-4 py-3">
                    <TriggerChip
                      trigger={row.trigger}
                      offsetDays={row.offset_days}
                      reminderDate={row.reminder_date}
                    />
                  </td>
                  <td className="px-4 py-3 capitalize text-text-primary max-w-[220px]">
                    <span className="line-clamp-2" title={formatBatchSteps(row)}>
                      {formatBatchSteps(row)}
                    </span>
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-bg-tertiary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-text-secondary">
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">
                    {formatRemindCounts(row)}
                    {companies.length > 0 && (
                      <span className="text-text-tertiary ml-1">
                        · {companies.length}{' '}
                        {companies.length === 1 ? 'company' : 'companies'}
                      </span>
                    )}
                  </td>
                </tr>
                {open && (
                  <tr className="border-b border-border">
                    <td colSpan={7} className="p-0">
                      <ChecklistReminderCompanies
                        eventId={eventId}
                        companies={companies}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusChip({ status }) {
  const tone =
    status === 'completed'
      ? 'bg-green-50 text-green-800 border-green-200'
      : status === 'failed'
        ? 'bg-red-50 text-red-800 border-red-200'
        : status === 'in_progress' || status === 'pending'
          ? 'bg-blue-50 text-blue-800 border-blue-200'
          : 'bg-bg-tertiary text-text-primary border-border';
  return (
    <span
      className={`inline-flex py-0.5 px-2 rounded text-[11px] font-medium border ${tone}`}
    >
      {formatSentStatus(status)}
    </span>
  );
}

function TriggerChip({ trigger, offsetDays, reminderDate }) {
  const isAuto = trigger === 'auto';
  return (
    <span
      className={`inline-flex flex-col gap-0.5 py-0.5 px-2 rounded text-[11px] font-medium border ${
        isAuto
          ? 'bg-blue-50 text-blue-800 border-blue-200'
          : 'bg-bg-tertiary text-text-primary border-border'
      }`}
    >
      <span>
        {isAuto ? 'Auto' : 'Manual'}
        {isAuto && offsetDays != null && (
          <span className="text-text-tertiary"> · {offsetDays}d</span>
        )}
      </span>
      {reminderDate && (
        <span className="font-normal text-text-tertiary">{reminderDate}</span>
      )}
    </span>
  );
}
