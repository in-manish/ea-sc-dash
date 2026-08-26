import { CAMPAIGN_SCOPE } from '../constants';

const ITEMS = [
  { id: CAMPAIGN_SCOPE.ALL, label: 'All' },
  { id: CAMPAIGN_SCOPE.HISTORY, label: 'History' },
  { id: CAMPAIGN_SCOPE.SCHEDULED, label: 'Scheduled' },
];

/** Client filter; API list has no status query. */
export default function CampaignStatusFilter({ scope, onChange }) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-bg-secondary border border-border">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            scope === item.id
              ? 'bg-bg-primary text-accent shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
