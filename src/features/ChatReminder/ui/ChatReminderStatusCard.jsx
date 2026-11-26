import { Activity, Loader2, RefreshCw } from 'lucide-react';
import { SectionHeader } from '../../../pages/event-settings/components/SharedComponents';
import { formatTimestamp, scheduleMinutes } from '../domain/chatReminderStatus';
import Banner from './Banner';

function Tile({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary px-4 py-3 min-w-0">
      <p className="m-0 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{label}</p>
      <p className="m-0 mt-1 text-xl font-semibold tabular-nums text-text-primary">{value}</p>
      {hint ? <p className="m-0 mt-0.5 text-xs text-text-tertiary">{hint}</p> : null}
    </div>
  );
}

function verdict(status) {
  if (!status.can_send) return { tone: 'warning', text: `Reminders will not send: ${status.blockers.join('; ')}.` };
  if (status.sends_automatically) {
    return { tone: 'success', text: `Live: reminders go out automatically every ${scheduleMinutes(status.schedule) ?? '?'} min.` };
  }
  return { tone: 'info', text: 'Ready, but the schedule is paused. Emails go out only when you use Send now.' };
}

/** Top summary: can reminders send right now, and if not, why not. */
export default function ChatReminderStatusCard({ status, loading, onRefresh }) {
  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-4">
      <div className="relative">
        <SectionHeader icon={Activity} title="Status" colorClass="text-emerald-500" borderClass="bg-emerald-500" />
        <button type="button" className="btn btn-secondary absolute right-0 -top-1" onClick={onRefresh} disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          <span className="ml-1.5">Refresh</span>
        </button>
      </div>
      {!status ? (
        <p className="text-sm text-text-tertiary m-0">{loading ? 'Loading status…' : 'Status unavailable.'}</p>
      ) : (
        <>
          <Banner tone={verdict(status).tone}>{verdict(status).text}</Banner>
          {status.emails_go_to_real_users ? null : (
            <Banner tone="info">
              {`Server ENVIRONMENT is "${status.environment}": every email goes to the admin address, not to real users.`}
            </Banner>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Tile label="Unread tracked" value={status.counts.unread_tracked} hint="Messages waiting to be read" />
            <Tile label="Eligible now" value={status.counts.eligible_receivers} hint="People a run would email" />
            <Tile label="Sent (24 h)" value={status.counts.digests_sent_24h} hint="Reminder emails" />
            <Tile label="Active events" value={status.active_events.length} hint={status.active_events.map((e) => e.name).join(', ') || 'None'} />
          </div>
          <p className="m-0 text-xs text-text-tertiary">
            Tenant <span className="font-mono">{status.tenant}</span> · checked {formatTimestamp(status.checked_at)} · settings apply to every event of this tenant.
          </p>
        </>
      )}
    </div>
  );
}
