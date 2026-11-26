import { History } from 'lucide-react';
import { SectionHeader } from '../../../pages/event-settings/components/SharedComponents';
import { formatTimestamp } from '../domain/chatReminderStatus';

const STATUS_TONE = {
  sent: 'text-green-700',
  rejected: 'text-red-700',
  blocked: 'text-red-700',
  unknown: 'text-amber-700',
};

function Table({ title, empty, head, rows }) {
  return (
    <div className="space-y-2 min-w-0">
      <p className="m-0 text-xs font-bold uppercase tracking-wider text-text-secondary">{title}</p>
      {rows.length ? (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-bg-secondary text-left text-text-tertiary uppercase">
              <tr>{head.map((h) => <th key={h} className="p-2 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      ) : <p className="m-0 text-sm text-text-tertiary">{empty}</p>}
    </div>
  );
}

/** Latest reminder emails and audit events (newest first). */
export default function ChatReminderActivityCard({ activity }) {
  const digests = activity?.digests || [];
  const events = activity?.events || [];
  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-5">
      <SectionHeader icon={History} title="Recent activity" colorClass="text-slate-500" borderClass="bg-slate-500" />
      <Table
        title="Reminder emails"
        empty="No reminder email has been attempted yet."
        head={['When', 'Receiver', 'Status', 'Chats', 'Provider', 'Reason']}
        rows={digests.map((d) => (
          <tr key={d.id} className="border-t border-border">
            <td className="p-2 whitespace-nowrap">{formatTimestamp(d.created_at)}</td>
            <td className="p-2 tabular-nums">#{d.receiver_evc_id}</td>
            <td className={`p-2 font-semibold ${STATUS_TONE[d.status] || 'text-text-secondary'}`}>{d.status}</td>
            <td className="p-2 tabular-nums">{d.thread_count}</td>
            <td className="p-2">{d.provider_status || '—'}</td>
            <td className="p-2">{d.reason || '—'}</td>
          </tr>
        ))}
      />
      <Table
        title="Audit log"
        empty="No events yet."
        head={['When', 'Stage', 'Reason', 'Receiver', 'Chat']}
        rows={events.map((e) => (
          <tr key={e.id} className="border-t border-border">
            <td className="p-2 whitespace-nowrap">{formatTimestamp(e.created_at)}</td>
            <td className="p-2 font-mono">{e.stage}</td>
            <td className="p-2">{e.reason || '—'}</td>
            <td className="p-2 tabular-nums">{e.receiver_evc_id ? `#${e.receiver_evc_id}` : '—'}</td>
            <td className="p-2 font-mono break-all">{e.chat_id || '—'}</td>
          </tr>
        ))}
      />
    </div>
  );
}
