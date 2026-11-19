import { Download, Mail, Monitor } from 'lucide-react';
import { DELIVERY, DELIVERY_LABELS } from '../domain/companyReportCatalog';

const ICONS = {
  [DELIVERY.SCREEN]: Monitor,
  [DELIVERY.DOWNLOAD]: Download,
  [DELIVERY.EMAIL]: Mail,
};

/** Small chips saying how a report is delivered (On screen / Download CSV / Email). */
export default function CompanyReportBadges({ delivery }) {
  return (
    <span className="flex flex-wrap gap-1">
      {delivery.map((mode) => {
        const Icon = ICONS[mode];
        return (
          <span
            key={mode}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-bg-secondary text-[10px] font-medium text-text-secondary"
          >
            <Icon size={10} />
            {DELIVERY_LABELS[mode]}
          </span>
        );
      })}
    </span>
  );
}
