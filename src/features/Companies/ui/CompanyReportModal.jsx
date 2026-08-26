import { X } from 'lucide-react';
import CompanyComprehensiveReportPanel from '../../../components/companies/CompanyComprehensiveReportPanel';

/** Modal shell for the company metrics report (totals, handover, coupons, badges). */
export default function CompanyReportModal({
  eventId,
  token,
  parentExhibitorId = '',
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-report-title"
        className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center sticky top-0 bg-bg-primary z-10">
          <h3 id="company-report-title" className="text-base font-semibold text-text-primary m-0">
            Company Report
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          <CompanyComprehensiveReportPanel
            eventId={eventId}
            token={token}
            parentExhibitorId={parentExhibitorId}
          />
        </div>
      </div>
    </div>
  );
}
