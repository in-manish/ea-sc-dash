import CampaignRowActions from './CampaignRowActions';
import CampaignStatusBadge from './CampaignStatusBadge';
import { campaignDateLines, formatCampaignDate } from '../domain/campaignHelpers';

const td = 'px-4 py-3 text-sm text-text-primary align-middle';

function DateStamp({ label, value }) {
  return (
    <div className="flex gap-2 whitespace-nowrap leading-snug">
      <span className="w-[4.5rem] shrink-0 text-xs text-text-tertiary">{label}</span>
      <span className="text-xs text-text-secondary tabular-nums">{formatCampaignDate(value)}</span>
    </div>
  );
}

export default function CampaignListRow({
  campaign,
  onViewDetails,
  onViewRecipients,
  onReschedule,
  onCancel,
}) {
  return (
    <tr
      className="group border-b border-border last:border-b-0 even:bg-bg-secondary/40 hover:bg-accent/10 cursor-pointer"
      onClick={() => onViewDetails?.(campaign)}
    >
      <td className={`${td} font-semibold max-w-[180px]`}>
        <div className="truncate" title={campaign.name}>
          {campaign.name || 'Unnamed campaign'}
        </div>
      </td>
      <td className={`${td} text-text-secondary max-w-[240px]`}>
        <div className="truncate" title={campaign.subject}>
          {campaign.subject || '(No subject)'}
        </div>
      </td>
      <td className={td}>
        <CampaignStatusBadge status={campaign.status} />
      </td>
      <td className={`${td} tabular-nums`}>{campaign.number_recipients ?? 0}</td>
      <td className={td}>
        <div className="flex flex-col gap-0.5 py-0.5">
          {campaignDateLines(campaign).map((line) => (
            <DateStamp key={line.label} label={line.label} value={line.value} />
          ))}
        </div>
      </td>
      <td className={`${td} whitespace-nowrap min-w-[220px] group-hover:bg-accent/5`}>
        <CampaignRowActions
          campaign={campaign}
          onViewDetails={onViewDetails}
          onViewRecipients={onViewRecipients}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      </td>
    </tr>
  );
}
