import { useState } from 'react';
import { Download, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useExhibitorReport } from '../hooks/useExhibitorReport';
import {
  isParentExhibitor,
  parentCompanies,
} from '../domain/companyBulkActionPayload';
import { parseEmailInput } from '../domain/exhibitorReportQuery';

const CO_TITLE = 'Deselect co-exhibitors. The report includes parent exhibitors only.';

export default function ExhibitorReportBar({
  eventId,
  token,
  companies,
  selectedIds,
}) {
  const { logout } = useAuth();
  const report = useExhibitorReport({ eventId, token, onUnauthorized: logout });
  const [emailInput, setEmailInput] = useState('');

  const selected = companies.filter((c) => selectedIds.has(c.id));
  const parents = parentCompanies(selected);
  const hasCoExhibitors = selected.some((c) => !isParentExhibitor(c));
  const parentIds = parents.map((c) => c.id);
  const canUseSelected = parentIds.length >= 1 && !hasCoExhibitors;
  const emails = parseEmailInput(emailInput);
  const busy = report.downloading || report.sending;
  const canSend = emails.length > 0 && (selected.length === 0 || canUseSelected);

  const selectedTitle = hasCoExhibitors
    ? CO_TITLE
    : canUseSelected
      ? 'Download CSV for selected parent exhibitors'
      : 'Select parent exhibitors to download';

  return (
    <div className="mb-4 space-y-2">
      <p className="text-xs text-text-tertiary m-0">
        Parent exhibitors only. Co-exhibitors are counted on the parent row, not exported separately.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={busy || !canUseSelected}
          title={selectedTitle}
          onClick={() => report.download(parentIds)}
        >
          {report.downloading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          Download selected
          {canUseSelected && (
            <span className="min-w-[1.15rem] h-4 px-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold leading-4 text-center">
              {parentIds.length}
            </span>
          )}
        </button>
        <input
          type="text"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Send report to emails (comma-separated)"
          className="min-w-[16rem] flex-1 max-w-md py-1.5 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
          disabled={busy}
          aria-label="Recipient emails for exhibitor report"
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={busy || !canSend}
          title={
            hasCoExhibitors
              ? CO_TITLE
              : emails.length === 0
                ? 'Enter one or more email addresses'
                : canUseSelected
                  ? 'Email CSV for selected parent exhibitors'
                  : 'Email CSV for all parent exhibitors'
          }
          onClick={() =>
            report.sendEmail({
              emails,
              companyIds: canUseSelected ? parentIds : undefined,
            })
          }
        >
          {report.sending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Mail size={14} />
          )}
          {canUseSelected ? `Send selected (${parentIds.length})` : 'Send report'}
        </button>
      </div>
      {report.success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 m-0">
          {report.success}
        </p>
      )}
      {report.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2 m-0" role="alert">
          {report.error}
        </p>
      )}
    </div>
  );
}
