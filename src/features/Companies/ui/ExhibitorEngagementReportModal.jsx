import { useEffect, useState } from 'react';
import { Download, Mail, X } from 'lucide-react';
import { useExhibitorEngagementReport } from '../hooks/useExhibitorEngagementReport';
import {
  loadPersistedEmails,
  persistEmails,
} from '../domain/exhibitorReportQuery';
import { COMPLETED_FILTERS } from '../domain/exhibitorEngagementQuery';
import {
  EmailPane,
  FeedbackMessages,
} from './ExhibitorReportModalPanes';
import { CompletedFilter, DownloadPane } from './ExhibitorEngagementReportPanes';

const MODES = { EMAIL: 'email', DOWNLOAD: 'download' };

export default function ExhibitorEngagementReportModal({
  eventId,
  token,
  onUnauthorized,
  onClose,
}) {
  const [mode, setMode] = useState(MODES.EMAIL);
  const [emails, setEmails] = useState(() => loadPersistedEmails());
  const [completed, setCompleted] = useState(COMPLETED_FILTERS.ALL);
  const report = useExhibitorEngagementReport({ eventId, token, onUnauthorized });
  const busy = report.downloading || report.sending;

  useEffect(() => { persistEmails(emails); }, [emails]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={busy ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="eng-report-title"
        className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 id="eng-report-title" className="text-base font-semibold text-text-primary m-0">
            Exhibitor Portal Matchmaking
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
          <CompletedFilter value={completed} onChange={setCompleted} disabled={busy} />

          {mode === MODES.EMAIL ? (
            <EmailPane
              emails={emails}
              setEmails={setEmails}
              busy={busy}
              sending={report.sending}
              hasSelected={false}
              onSend={() => report.sendEmail({ emails, completed })}
            />
          ) : (
            <DownloadPane
              busy={busy}
              downloading={report.downloading}
              onDownload={() => report.download(completed)}
            />
          )}

          <FeedbackMessages success={report.success} error={report.error} />
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-secondary/50 text-[11px] text-text-tertiary">
          Email is queued asynchronously. Completed is Yes only when every portal question is answered.
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
