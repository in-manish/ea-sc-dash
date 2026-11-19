import { useEffect, useState } from 'react';
import { Download, Loader2, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCompanyReportAction } from '../hooks/useCompanyReportAction';
import { loadPersistedEmails, persistEmails } from '../domain/exhibitorReportQuery';
import { companyReportsApi } from '../api/companyReportsApi';
import { EmailPane, FeedbackMessages } from './ExhibitorReportModalPanes';
import { DEFAULT_ORDER_STATUSES } from '../domain/orderStatusOptions';
import OrderStatusPicker from './OrderStatusPicker';

/**
 * Run dialog for the reports wired in the Companies → Reports tab:
 * company_export (download), invitee_report (email), ar_orders (email + status filter).
 */
export default function CompanyQuickReportModal({ report, eventId, token, onClose }) {
  const { logout } = useAuth();
  const action = useCompanyReportAction({ onUnauthorized: logout });
  const [emails, setEmails] = useState(() => loadPersistedEmails());
  const [statuses, setStatuses] = useState(DEFAULT_ORDER_STATUSES);

  useEffect(() => { persistEmails(emails); }, [emails]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !action.busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [action.busy, onClose]);

  const isExport = report.id === 'company_export';
  const isOrders = report.id === 'ar_orders';

  const handleDownload = () =>
    action.download(() => companyReportsApi.downloadCompanyExport(eventId, token));

  const handleSend = () =>
    action.email(() => (isOrders
      ? companyReportsApi.emailOrdersReport(eventId, token, { emails, statuses })
      : companyReportsApi.emailInviteeReport(eventId, token, { emails })));

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={action.busy ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-report-title"
        className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 id="quick-report-title" className="text-base font-semibold text-text-primary m-0">
            {report.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={action.busy}
            className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary disabled:opacity-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-text-secondary m-0">{report.summary}</p>

          {isOrders && (
            <OrderStatusPicker value={statuses} onChange={setStatuses} disabled={action.busy} />
          )}

          {isExport ? (
            <button
              type="button"
              className="btn btn-primary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
              disabled={action.busy}
              onClick={handleDownload}
            >
              {action.downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Download CSV
            </button>
          ) : (
            <EmailPane
              emails={emails}
              setEmails={setEmails}
              busy={action.busy || (isOrders && statuses.length === 0)}
              sending={action.sending}
              hasSelected={false}
              onSend={handleSend}
            />
          )}

          <FeedbackMessages success={action.success} error={action.error} />
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50 text-[11px] text-text-tertiary">
          {report.rowUnit}. {report.note || ''}
        </div>
      </div>
    </div>
  );
}
