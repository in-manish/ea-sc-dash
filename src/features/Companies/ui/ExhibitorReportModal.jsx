import { useEffect, useState } from 'react';
import { Download, Mail, X } from 'lucide-react';
import { useExhibitorReport } from '../hooks/useExhibitorReport';
import { parentCompanies } from '../domain/companyBulkActionPayload';
import {
  loadPersistedEmails,
  persistEmails,
} from '../domain/exhibitorReportQuery';
import {
  SelectedBadge,
  EmailPane,
  DownloadPane,
  FeedbackMessages,
} from './ExhibitorReportModalPanes';

const MODES = { EMAIL: 'email', DOWNLOAD: 'download' };

export default function ExhibitorReportModal({
  eventId,
  token,
  companies = [],
  selectedIds = new Set(),
  onUnauthorized,
  onClose,
}) {
  const [mode, setMode] = useState(MODES.EMAIL);
  const [emails, setEmails] = useState(() => loadPersistedEmails());
  const report = useExhibitorReport({ eventId, token, onUnauthorized });

  useEffect(() => { persistEmails(emails); }, [emails]);

  const parents = parentCompanies(companies.filter((c) => selectedIds.has(c.id)));
  const parentIds = parents.map((c) => c.id);
  const hasSelected = parentIds.length > 0;
  const busy = report.downloading || report.sending;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const handleDownload = (scoped) => {
    report.download(scoped && hasSelected ? parentIds : undefined);
  };

  const handleSend = (scoped) => {
    if (!emails.length) return;
    report.sendEmail({
      emails,
      companyIds: scoped && hasSelected ? parentIds : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={busy ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exh-report-title"
        className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 id="exh-report-title" className="text-base font-semibold text-text-primary m-0">
            Exhibitor Report
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <ModeTabs mode={mode} onModeChange={setMode} busy={busy} />

        <div className="px-5 py-4 space-y-4">
          {hasSelected && <SelectedBadge count={parentIds.length} />}

          {mode === MODES.EMAIL ? (
            <EmailPane
              emails={emails}
              setEmails={setEmails}
              busy={busy}
              sending={report.sending}
              hasSelected={hasSelected}
              onSend={handleSend}
            />
          ) : (
            <DownloadPane
              busy={busy}
              downloading={report.downloading}
              hasSelected={hasSelected}
              onDownload={handleDownload}
            />
          )}

          <FeedbackMessages success={report.success} error={report.error} />
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50 text-[11px] text-text-tertiary">
          Parent exhibitors only. Co-exhibitors appear as counts on the parent row.
        </div>
      </div>
    </div>
  );
}

function ModeTabs({ mode, onModeChange, busy }) {
  const tab = (key, icon, label) => (
    <button
      type="button"
      disabled={busy}
      onClick={() => onModeChange(key)}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all border-b-2 cursor-pointer bg-transparent ${
        mode === key
          ? 'text-accent border-accent'
          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border'
      } disabled:opacity-60`}
    >
      {icon}
      {label}
    </button>
  );
  return (
    <div className="flex border-b border-border">
      {tab(MODES.EMAIL, <Mail size={15} />, 'Email Report')}
      {tab(MODES.DOWNLOAD, <Download size={15} />, 'Download CSV')}
    </div>
  );
}
