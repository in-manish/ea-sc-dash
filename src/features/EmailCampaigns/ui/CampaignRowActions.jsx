import { isScheduledCampaign } from '../domain/campaignHelpers';
import HoverActionButton, { HOVER_REVEAL } from './HoverActionButton';

/** Hidden until the parent `tr.group` is hovered; two accent pills plus scheduled extras. */
export default function CampaignRowActions({
  campaign,
  onViewDetails,
  onViewRecipients,
  onReschedule,
  onCancel,
}) {
  const scheduled = isScheduledCampaign(campaign);

  return (
    <div className={`flex items-center gap-1.5 justify-start ${HOVER_REVEAL}`}>
      <HoverActionButton onClick={() => onViewDetails?.(campaign)}>
        View details
      </HoverActionButton>
      <HoverActionButton onClick={() => onViewRecipients?.(campaign)}>
        View recipients
      </HoverActionButton>
      {scheduled && (
        <>
          <HoverActionButton variant="ghost" onClick={() => onReschedule?.(campaign)}>
            Reschedule
          </HoverActionButton>
          <HoverActionButton variant="danger" onClick={() => onCancel?.(campaign)}>
            Cancel
          </HoverActionButton>
        </>
      )}
    </div>
  );
}
