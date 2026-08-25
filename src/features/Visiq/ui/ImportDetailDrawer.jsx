import { X } from 'lucide-react';
import { formatDateTime } from '../domain/formatDate';
import {
  formatBytes,
  importStatusLabel,
  importStatusTone,
  isImportActive,
} from '../domain/importStatus';
import {
  importMappingSummary,
  importTagList,
} from '../domain/importRow';
import { useImportDetail } from '../hooks/useImportDetail';
import ImportFileActions from './ImportFileActions';
import VisiqStatusBadge from './VisiqStatusBadge';

function Stat({ label, value, danger }) {
  return (
    <div className="rounded-md border border-border bg-bg-secondary/50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-text-tertiary">{label}</div>
      <div
        className={`text-sm font-semibold mt-0.5 ${danger ? 'text-danger' : 'text-text-primary'}`}
      >
        {value}
      </div>
    </div>
  );
}

export default function ImportDetailDrawer({
  token,
  importId,
  onClose,
  onUnauthorized,
  onPreview,
  onDownload,
  downloadBusy,
}) {
  const { job, loading, error } = useImportDetail({ token, importId, onUnauthorized });
  const pct = Number(job?.progress_percentage) || 0;
  const tags = importTagList(job);
  const mapping = importMappingSummary(job);

  return (
    <div
      className="fixed inset-0 z-[1200] flex justify-end bg-black/40"
      onClick={onClose}
      role="presentation"
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="visiq-import-detail"
        className="w-full max-w-md h-full bg-bg-primary border-l border-border shadow-xl overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <Header onClose={onClose} />
        <div className="p-5 space-y-5">
          {loading && !job && <p className="text-sm text-text-secondary">Loading…</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
          {job && (
            <>
              <div>
                <div className="text-base font-semibold text-text-primary break-all">
                  {job.original_file_name}
                </div>
                <div className="text-xs text-text-tertiary mt-1">
                  #{job.id} · {String(job.file_type || '').toUpperCase()} ·{' '}
                  {formatBytes(job.file_size)}
                  {job.dry_run ? ' · dry run' : ''}
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <VisiqStatusBadge
                    label={importStatusLabel(job.status)}
                    tone={importStatusTone(job.status)}
                  />
                  {isImportActive(job.status) ? (
                    <span className="text-xs text-text-tertiary">Refreshing…</span>
                  ) : null}
                </div>
              </div>

              <ImportFileActions
                importId={job.id}
                onPreview={() => onPreview?.(job)}
                onDownload={() => onDownload?.(job)}
                downloadBusy={downloadBusy}
              />

              <div>
                <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden mb-2">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-text-tertiary m-0">
                  {job.processed_rows || 0} of {job.total_rows || 0} rows · {pct}%
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Stat label="Created" value={job.created_count ?? 0} />
                <Stat label="Updated" value={job.updated_count ?? 0} />
                <Stat label="Failed" value={job.failed_count ?? 0} danger={job.failed_count > 0} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Stat label="Started" value={formatDateTime(job.started_at)} />
                <Stat label="Completed" value={formatDateTime(job.completed_at)} />
                <Stat label="Uploaded" value={formatDateTime(job.created_at)} />
                <Stat
                  label="Uploader"
                  value={job.uploaded_by != null ? `#${job.uploaded_by}` : '—'}
                />
              </div>

              {(mapping.emailColumn || mapping.propertyCount > 0) && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">
                    Mapping
                  </h4>
                  <p className="text-sm text-text-secondary m-0">
                    Email column:{' '}
                    <span className="text-text-primary font-medium">
                      {mapping.emailColumn || 'auto'}
                    </span>
                    {mapping.propertyCount
                      ? ` · ${mapping.propertyCount} property columns`
                      : ''}
                  </p>
                </section>
              )}

              {job.error_message ? (
                <div className="text-sm text-danger bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2">
                  {job.error_message}
                </div>
              ) : null}

              {tags.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">
                    Tags applied
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-bg-secondary text-text-secondary border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {job.report && Object.keys(job.report).length > 0 ? (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-2">
                    Report
                  </h4>
                  <pre className="text-[11px] text-text-secondary bg-bg-secondary border border-border rounded-md p-3 overflow-x-auto m-0 max-h-40">
                    {JSON.stringify(job.report, null, 2)}
                  </pre>
                </section>
              ) : null}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function Header({ onClose }) {
  return (
    <div className="sticky top-0 bg-bg-primary border-b border-border px-5 py-4 flex items-center justify-between z-10">
      <h3 id="visiq-import-detail" className="text-base font-semibold text-text-primary m-0">
        Import job
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}
