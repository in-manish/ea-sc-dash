import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { CAMPAIGN_SCOPE } from '../constants';
import { formatCampaignCount } from '../domain/campaignHelpers';
import useCampaignActions from '../hooks/useCampaignActions';
import useCampaignDetail from '../hooks/useCampaignDetail';
import useEmailCampaignList from '../hooks/useEmailCampaignList';
import CampaignDetailModal from './CampaignDetailModal';
import CampaignList from './CampaignList';
import CampaignRecipientsModal from './CampaignRecipientsModal';
import CampaignStatusFilter from './CampaignStatusFilter';
import RescheduleCampaignModal from './RescheduleCampaignModal';

export default function EmailCampaignsPage() {
  const { token, selectedEvent } = useAuth();
  const { id } = useParams();
  const eventId = id || selectedEvent?.id;
  const [scope, setScope] = useState(CAMPAIGN_SCOPE.ALL);
  const list = useEmailCampaignList({ eventId, token, scope });
  const detail = useCampaignDetail({ eventId, token });
  const actions = useCampaignActions({ eventId, token, onChanged: list.reload });
  const [recipientsCampaign, setRecipientsCampaign] = useState(null);
  const [scroller, setScroller] = useState(null);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <CampaignStatusFilter scope={scope} onChange={setScope} />
        {list.totalCount != null && (
          <p className="m-0 text-sm text-text-secondary tabular-nums" title="Total campaigns">
            {formatCampaignCount(list.totalCount)}
          </p>
        )}
      </div>
      <div ref={setScroller} className="h-[calc(100vh-320px)] min-h-[360px] overflow-y-auto pr-1">
        <CampaignList
          scope={scope}
          campaigns={list.visible}
          loading={list.loading}
          loadingMore={list.loadingMore}
          hasNext={list.hasNext}
          error={list.error}
          scrollRoot={scroller}
          onLoadMore={list.loadMore}
          onViewDetails={(campaign) => detail.open(campaign.id)}
          onViewRecipients={setRecipientsCampaign}
          onReschedule={actions.setRescheduleTarget}
          onCancel={actions.cancel}
        />
      </div>
      <CampaignDetailModal
        campaign={detail.campaign}
        loading={detail.loading}
        error={detail.error}
        onClose={detail.close}
      />
      <CampaignRecipientsModal
        token={token}
        campaign={recipientsCampaign}
        onClose={() => setRecipientsCampaign(null)}
      />
      <RescheduleCampaignModal
        campaign={actions.rescheduleTarget}
        saving={actions.saving}
        onClose={() => actions.setRescheduleTarget(null)}
        onConfirm={actions.reschedule}
      />
    </>
  );
}
