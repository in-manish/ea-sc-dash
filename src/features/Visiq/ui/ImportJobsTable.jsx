import { formatDateTime } from '../domain/formatDate';
import {
  formatBytes,
  importStatusLabel,
  importStatusTone,
} from '../domain/importStatus';
import {
  importMappingSummary,
  importOutcomeSummary,
  importTagList,
} from '../domain/importRow';
import ImportFileActions from './ImportFileActions';
import VisiqStatusBadge from './VisiqStatusBadge';

export default function ImportJobsTable({
  rows = [],
  loading,
  selectedId,
  onSelect,
  onPreview,
  onDownload,
  downloadBusyId,
}) {
  if (loading && !rows.length) {
    return <div className="py-10 text-center text-sm text-text-secondary">Loading imports…</div>;
  }

  if (!loading && !rows.length) {
    return (
      <div className="py-10 text-center text-sm text-text-secondary">
        No import jobs yet. Upload a file to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm text-left">
        <thead className="bg-bg-secondary text-text-tertiary text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 font-medium">File</th>
            <th className="px-4 py-3 font-medium">Status & outcome</th>
            <th className="px-4 py-3 font-medium">Progress</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const active = selectedId != null && Number(selectedId) === Number(row.id);
            const pct = Number(row.progress_percentage) || 0;
            const outcome = importOutcomeSummary(row);
            const tags = importTagList(row);
            const mapping = importMappingSummary(row);
            return (
              <tr
                key={row.id}
                onClick={() => onSelect?.(row.id)}
                aria-pressed={active}
                className={`border-t border-border cursor-pointer transition-colors ${
                  active
                    ? 'bg-accent/10 shadow-[inset_3px_0_0_0_var(--color-accent)]'
                    : 'hover:bg-bg-secondary'
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-text-primary truncate max-w-[240px]">
                    {row.original_file_name || `Import #${row.id}`}
                  </div>
                  <div className="text-xs text-text-tertiary mt-0.5">
                    #{row.id} · {String(row.file_type || '').toUpperCase()} ·{' '}
                    {formatBytes(row.file_size)}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {row.dry_run ? (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20">
                        Dry run
                      </span>
                    ) : null}
                    {tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-1.5 py-0.5 rounded bg-bg-secondary border border-border text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 ? (
                      <span className="text-[11px] text-text-tertiary">+{tags.length - 3}</span>
                    ) : null}
                  </div>
                  <div className="text-[11px] text-text-tertiary mt-1.5">
                    {formatDateTime(row.created_at)}
                    {mapping.emailColumn ? ` · email: ${mapping.emailColumn}` : ''}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <VisiqStatusBadge
                    label={importStatusLabel(row.status)}
                    tone={importStatusTone(row.status)}
                  />
                  <div className="mt-2 grid grid-cols-3 gap-1 max-w-[180px]">
                    <MiniStat label="New" value={outcome.created} />
                    <MiniStat label="Upd" value={outcome.updated} />
                    <MiniStat label="Fail" value={outcome.failed} danger={outcome.failed > 0} />
                  </div>
                </td>
                <td className="px-4 py-3 align-top min-w-[140px]">
                  <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden mb-1">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {row.processed_rows || 0}/{row.total_rows || 0} · {pct}%
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <ImportFileActions
                    importId={row.id}
                    compact
                    onPreview={() => onPreview?.(row)}
                    onDownload={() => onDownload?.(row)}
                    downloadBusy={downloadBusyId === row.id}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MiniStat({ label, value, danger }) {
  return (
    <div className="rounded border border-border bg-bg-secondary/50 px-1.5 py-1 text-center">
      <div className="text-[10px] uppercase text-text-tertiary">{label}</div>
      <div
        className={`text-xs font-semibold tabular-nums ${
          danger ? 'text-danger' : 'text-text-primary'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
