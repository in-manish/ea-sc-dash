import { CAMPAIGN_SCOPE } from '../constants';
import CampaignListRow from './CampaignListRow';
import InfiniteScrollSentinel from './InfiniteScrollSentinel';
import { Loader2, Send } from 'lucide-react';

const TH = 'bg-bg-secondary py-3 px-4 text-xs font-semibold uppercase tracking-wider text-text-secondary border-b border-border';

const EMPTY = {
  [CAMPAIGN_SCOPE.SCHEDULED]: {
    title: 'No scheduled campaigns',
    body: 'Upcoming email campaigns will appear here.',
  },
  [CAMPAIGN_SCOPE.HISTORY]: {
    title: 'No campaign history',
    body: 'Sent and completed campaigns will appear here.',
  },
  [CAMPAIGN_SCOPE.ALL]: {
    title: 'No campaigns found',
    body: 'Email campaigns for this event will appear here.',
  },
};

export default function CampaignList({
  scope,
  campaigns,
  loading,
  loadingMore,
  hasNext,
  error,
  onLoadMore,
  onViewDetails,
  onViewRecipients,
  onReschedule,
  onCancel,
  scrollRoot,
}) {
  const emptyCopy = EMPTY[scope] || EMPTY[CAMPAIGN_SCOPE.ALL];
  const stillFilling = loading
    || (campaigns.length === 0 && (loadingMore || (hasNext && scope !== CAMPAIGN_SCOPE.ALL)) && !error);
  const errorBanner = error ? (
    <div className="mb-4 text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
      {error}
    </div>
  ) : null;

  if (stillFilling) {
    return (
      <>
        {errorBanner}
        <div className="flex justify-center p-12 text-text-tertiary">
          <Loader2 className="animate-spin" size={24} />
        </div>
      </>
    );
  }

  if (!campaigns.length) {
    return (
      <>
        {errorBanner}
        <div className="text-center p-12 bg-bg-primary rounded-xl border border-dashed border-border">
          <div className="w-12 h-12 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <Send size={22} className="text-text-tertiary" />
          </div>
          <h4 className="text-base font-semibold text-text-primary mb-1">{emptyCopy.title}</h4>
          <p className="text-sm text-text-secondary">{emptyCopy.body}</p>
        </div>
      </>
    );
  }

  return (
    <>
      {errorBanner}
      <div className="bg-bg-primary border border-border rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className={TH}>Name</th>
              <th className={TH}>Subject</th>
              <th className={TH}>Status</th>
              <th className={TH}>Recipients</th>
              <th className={TH}>Date</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <CampaignListRow
                key={campaign.id}
                campaign={campaign}
                onViewDetails={onViewDetails}
                onViewRecipients={onViewRecipients}
                onReschedule={onReschedule}
                onCancel={onCancel}
              />
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
    </>
  );
}
