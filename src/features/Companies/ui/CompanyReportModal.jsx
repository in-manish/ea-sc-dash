import { useState } from 'react';
import { Check, Link2, X } from 'lucide-react';
import CompanyComprehensiveReportPanel from '../../../components/companies/CompanyComprehensiveReportPanel';

/** Modal shell for the company metrics report (totals, handover, coupons, badges). */
export default function CompanyReportModal({
  eventId,
  token,
  parentExhibitorId = '',
  onParentChange,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary bg-transparent border-none cursor-pointer px-2 py-1 rounded-md hover:bg-bg-secondary transition-colors"
            title="Copy a link to this report — any logged-in organizer who opens it sees the same screen"
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? 'Link copied' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
          </div>
        </div>
        <div className="p-4">
          <CompanyComprehensiveReportPanel
            eventId={eventId}
            token={token}
            parentExhibitorId={parentExhibitorId}
            onParentChange={onParentChange}
          />
        </div>
      </div>
    </div>
  );
}
