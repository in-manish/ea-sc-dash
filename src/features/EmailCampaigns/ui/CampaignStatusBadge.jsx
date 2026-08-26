import { CAMPAIGN_STATUS } from '../constants';
import { campaignStatusKey } from '../domain/campaignHelpers';

const STYLES = {
  [CAMPAIGN_STATUS.SCHEDULED]: 'bg-amber-50 text-amber-700 border-amber-200',
  SCH: 'bg-amber-50 text-amber-700 border-amber-200',
  [CAMPAIGN_STATUS.IN_PROGRESS]: 'bg-accent/10 text-accent border-accent/20',
  PRO: 'bg-accent/10 text-accent border-accent/20',
  [CAMPAIGN_STATUS.COMPLETE]: 'bg-success/10 text-success border-success/20',
  COM: 'bg-success/10 text-success border-success/20',
  [CAMPAIGN_STATUS.CANCELED]: 'bg-bg-tertiary text-text-tertiary border-border',
  CAN: 'bg-bg-tertiary text-text-tertiary border-border',
  [CAMPAIGN_STATUS.FAILED]: 'bg-danger/10 text-danger border-danger/20',
  FAL: 'bg-danger/10 text-danger border-danger/20',
};

const LABELS = {
  SCH: 'Scheduled',
  PRO: 'In progress',
  COM: 'Complete',
  CAN: 'Canceled',
  FAL: 'Failed',
};

export default function CampaignStatusBadge({ status }) {
  const key = campaignStatusKey({ status });
  const style = STYLES[key] || 'bg-bg-tertiary text-text-secondary border-border';
  const label = LABELS[key] || status || 'Unknown';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {label}
    </span>
  );
}
