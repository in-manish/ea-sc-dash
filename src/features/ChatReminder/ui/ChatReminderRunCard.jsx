import { useState } from 'react';
import { Eye, FlaskConical, Loader2, Send } from 'lucide-react';
import { SectionHeader } from '../../../pages/event-settings/components/SharedComponents';
import { OUTCOME_LABELS, parseReceiverIds } from '../domain/chatReminderStatus';
import Banner from './Banner';

const INPUT = 'w-full p-2 border border-border rounded-md text-sm bg-bg-primary text-text-primary';

function ResultTable({ result }) {
  if (!result) return null;
  const summary = Object.entries(result.summary || {}).map(([k, v]) => `${OUTCOME_LABELS[k] || k}: ${v}`).join(' · ');
  return (
    <div className="space-y-2">
      <p className="m-0 text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">{result.dry_run ? 'Dry run' : 'Sent'}</span>
        {` · ${result.eligible_receivers} eligible · ${result.processed} processed`}{summary ? ` · ${summary}` : ''}
      </p>
      {(result.notes || []).map((note) => <Banner key={note} tone="info">{note}</Banner>)}
      {result.results.length ? (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-bg-secondary text-left text-xs text-text-tertiary uppercase">
              <tr><th className="p-2">Receiver</th><th className="p-2">Email</th><th className="p-2">Messages</th><th className="p-2">From</th><th className="p-2">Result</th></tr>
            </thead>
            <tbody>
              {result.results.map((row) => (
                <tr key={`${row.receiver_evc_id}-${row.outcome}`} className="border-t border-border">
                  <td className="p-2">{row.receiver_name || '—'} <span className="text-text-tertiary">#{row.receiver_evc_id}</span></td>
                  <td className="p-2 break-all">{row.email || '—'}</td>
                  <td className="p-2 tabular-nums">{row.message_count}</td>
                  <td className="p-2">{row.senders.join(', ') || '—'}</td>
                  <td className="p-2">{OUTCOME_LABELS[row.outcome] || row.outcome}{row.reason ? <span className="block text-xs text-text-tertiary">{row.reason}</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="m-0 text-sm text-text-tertiary">Nobody is eligible right now.</p>}
    </div>
  );
}

/** Dry run (safe) and send now (real emails), optionally limited to test receivers. */
export default function ChatReminderRunCard({ run, activate, realUsers }) {
  const [receivers, setReceivers] = useState('');
  const [limit, setLimit] = useState(5);
  const [cutoff, setCutoff] = useState('');
  const options = () => ({
    receiverIds: parseReceiverIds(receivers),
    limit: Math.min(50, Math.max(1, Number(limit) || 1)),
    cutoffMinutes: Number(cutoff) > 0 ? Math.round(Number(cutoff)) : null,
  });
  const send = () => {
    const opts = options();
    const who = opts.receiverIds.length ? `receivers ${opts.receiverIds.join(', ')}` : `up to ${opts.limit} eligible people`;
    const where = realUsers ? 'REAL people' : 'the admin address (non-prod server)';
    if (window.confirm(`Send reminder emails now to ${who}? Emails go to ${where}. Run a dry run first.`)) run.send(opts);
  };
  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-4">
      <SectionHeader icon={FlaskConical} title="Dry run & send now" colorClass="text-amber-500" borderClass="bg-amber-500" />
      <p className="m-0 text-xs text-text-tertiary">
        Uses the saved settings, exactly like a scheduled run. Leave receivers empty for everyone eligible.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block space-y-1 sm:col-span-3">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Only these SnapCard user ids</span>
          <input className={INPUT} value={receivers} onChange={(e) => setReceivers(e.target.value)} placeholder="e.g. 202, 305 (test accounts)" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Max people</span>
          <input type="number" min={1} max={50} className={INPUT} value={limit} onChange={(e) => setLimit(e.target.value)} />
        </label>
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Minimum unread time for this run (min)</span>
          <input type="number" min={1} className={INPUT} value={cutoff} onChange={(e) => setCutoff(e.target.value)} placeholder="Empty = saved setting, e.g. 1 to test" />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <button type="button" className="btn btn-secondary" disabled={!!run.running} onClick={() => run.preview(options())}>
          {run.running === 'preview' ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
          <span className="ml-1.5">Dry run</span>
        </button>
        <button type="button" disabled={!!run.running || !activate} onClick={send}
          title={activate ? '' : 'Turn reminders on first'}
          className="btn bg-red-600 text-white hover:bg-red-700 border-red-600 disabled:opacity-50">
          {run.running === 'send' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span className="ml-1.5">Send now</span>
        </button>
      </div>
      <Banner tone="danger">{run.error}</Banner>
      <ResultTable result={run.result} />
    </div>
  );
}
