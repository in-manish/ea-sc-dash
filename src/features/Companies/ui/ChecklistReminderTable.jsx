import { ExternalLink } from 'lucide-react';
import {
  formatReminderSentAt,
  formatStepId,
} from '../domain/checklistReminderHelpers';

export default function ChecklistReminderTable({ results, loading, error }) {
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
            <th className="px-4 py-3 font-semibold">Sent</th>
            <th className="px-4 py-3 font-semibold">Company</th>
            <th className="px-4 py-3 font-semibold">Step</th>
            <th className="px-4 py-3 font-semibold">Trigger</th>
            <th className="px-4 py-3 font-semibold">Recipient</th>
            <th className="px-4 py-3 font-semibold">CTA</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border last:border-0 hover:bg-bg-secondary/60"
            >
              <td className="px-4 py-3 text-text-primary whitespace-nowrap">
                {formatReminderSentAt(row.sent_at)}
              </td>
              <td className="px-4 py-3 text-text-primary">
                {row.company?.company_name || '—'}
                {row.company?.id != null && (
                  <span className="text-text-tertiary ml-1">#{row.company.id}</span>
                )}
              </td>
              <td className="px-4 py-3 text-text-primary capitalize">
                {formatStepId(row.step_id)}
              </td>
              <td className="px-4 py-3">
                <TriggerChip trigger={row.trigger} offsetDays={row.offset_days} />
              </td>
              <td className="px-4 py-3 text-text-primary">
                {row.badge ? (
                  <div className="flex flex-col gap-0.5">
                    <span>{row.badge.name || '—'}</span>
                    <span className="text-xs text-text-tertiary">{row.badge.email || ''}</span>
                  </div>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-4 py-3">
                {row.cta_url ? (
                  <a
                    href={row.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    Open <ExternalLink size={12} />
                  </a>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TriggerChip({ trigger, offsetDays }) {
  const isAuto = trigger === 'auto';
  return (
    <span
      className={`inline-flex items-center gap-1 py-0.5 px-2 rounded text-[11px] font-medium border ${
        isAuto
          ? 'bg-blue-50 text-blue-800 border-blue-200'
          : 'bg-bg-tertiary text-text-primary border-border'
      }`}
    >
      {isAuto ? 'Auto' : 'Manual'}
      {isAuto && offsetDays != null && (
        <span className="text-text-tertiary">· {offsetDays}d</span>
      )}
    </span>
  );
}
