import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { attendeeListPath } from '../domain/campaignHelpers';
import useCampaignRecipients from '../hooks/useCampaignRecipients';
import CampaignRecipientsTable from './CampaignRecipientsTable';

export default function CampaignRecipientsModal({ token, campaign, onClose }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const eventId = id || campaign?.event_id;
  const list = useCampaignRecipients({
    token,
    campaignId: campaign?.id || null,
  });
  const [scroller, setScroller] = useState(null);

  if (!campaign) return null;

  const viewAttendee = (row) => {
    if (!eventId) return;
    navigate(attendeeListPath(eventId, row));
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-bg-primary rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <header className="px-6 py-4 border-b border-border flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-text-primary truncate">
              Recipients · {campaign.name || 'Campaign'}
            </h3>
            <p className="text-sm text-text-secondary mt-0.5">
              {list.count} recipient{list.count === 1 ? '' : 's'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-lg border-none bg-transparent cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>
        <div ref={setScroller} className="flex-1 overflow-y-auto p-6">
          {list.error && (
            <div className="mb-4 text-sm text-danger bg-danger/5 border border-danger/20 rounded-xl px-4 py-3">
              {list.error}
            </div>
          )}
          <CampaignRecipientsTable
            rows={list.items}
            loading={list.loading}
            loadingMore={list.loadingMore}
            hasNext={list.hasNext}
            scrollRoot={scroller}
            onLoadMore={list.loadMore}
            onViewAttendee={viewAttendee}
          />
        </div>
      </div>
    </div>
  );
}
