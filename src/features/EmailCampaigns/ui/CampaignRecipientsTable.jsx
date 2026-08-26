import { Check, Loader2 } from 'lucide-react';
import { formatCampaignDate } from '../domain/campaignHelpers';
import InfiniteScrollSentinel from './InfiniteScrollSentinel';
import RecipientRowActions from './RecipientRowActions';

const TH = 'bg-bg-secondary py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border sticky top-0';

export default function CampaignRecipientsTable({
  rows,
  loading,
  loadingMore,
  hasNext,
  scrollRoot,
  onLoadMore,
  onViewAttendee,
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-text-tertiary">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <p className="text-sm text-text-secondary text-center py-10">No recipients for this campaign.</p>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className={TH}>Name</th>
            <th className={TH}>Email</th>
            <th className={TH}>Reg ID</th>
            <th className={TH}>Sent</th>
            <th className={TH}>Sent time</th>
            <th className={TH}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="group border-b border-border last:border-b-0 even:bg-bg-secondary/40 hover:bg-accent/10"
            >
              <td className="px-4 py-3 text-sm font-medium text-text-primary">{row.user_name || '—'}</td>
              <td className="px-4 py-3 text-sm text-text-secondary">{row.email || '—'}</td>
              <td className="px-4 py-3 text-sm tabular-nums text-text-secondary">{row.reg_id || '—'}</td>
              <td className="px-4 py-3 text-sm">
                {row.is_sent ? (
                  <span className="inline-flex items-center gap-1 text-success">
                    <Check size={14} /> Sent
                  </span>
                ) : (
                  <span className="text-text-tertiary">Pending</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-text-secondary whitespace-nowrap">
                {formatCampaignDate(row.sent_time)}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap group-hover:bg-accent/5">
                <RecipientRowActions recipient={row} onViewAttendee={onViewAttendee} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loadingMore && (
        <div className="flex justify-center py-3 text-text-tertiary">
          <Loader2 className="animate-spin" size={18} />
        </div>
      )}
      <InfiniteScrollSentinel
        onVisible={onLoadMore}
        disabled={!hasNext || loadingMore}
        root={scrollRoot}
      />
    </div>
  );
}
