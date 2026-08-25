import { X } from 'lucide-react';

export default function ImportPreviewModal({
  open,
  title,
  data,
  loading,
  error,
  onClose,
  onDownload,
  downloadBusy,
}) {
  if (!open) return null;

  const headers = data?.headers || [];
  const rows = data?.rows || [];

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="visiq-preview-title"
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3
              id="visiq-preview-title"
              className="text-base font-semibold text-text-primary m-0 truncate"
            >
              Preview — {title}
            </h3>
            {data ? (
              <p className="text-xs text-text-tertiary m-0 mt-1">
                Showing {data.row_count} row{data.row_count === 1 ? '' : 's'}
                {data.truncated ? ` (capped at ${data.limit})` : ''}
                {data.file_type ? ` · ${String(data.file_type).toUpperCase()}` : ''}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onDownload ? (
              <button
                type="button"
                disabled={downloadBusy}
                onClick={onDownload}
                className="px-3 py-1.5 text-sm rounded-md border border-border bg-bg-secondary text-text-primary cursor-pointer hover:bg-bg-tertiary disabled:opacity-50"
              >
                {downloadBusy ? 'Downloading…' : 'Download'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <p className="text-sm text-text-secondary text-center py-10">Loading preview…</p>
          )}
          {error && !loading && (
            <p className="text-sm text-danger bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {!loading && !error && data && headers.length === 0 && (
            <p className="text-sm text-text-secondary text-center py-10">No columns found.</p>
          )}
          {!loading && !error && headers.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm text-left">
                <thead className="bg-bg-secondary text-text-tertiary text-xs sticky top-0">
                  <tr>
                    <th className="px-3 py-2 font-medium whitespace-nowrap">#</th>
                    {headers.map((h) => (
                      <th key={h} className="px-3 py-2 font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-t border-border hover:bg-bg-secondary/60">
                      <td className="px-3 py-2 text-text-tertiary tabular-nums">{idx + 1}</td>
                      {headers.map((h) => (
                        <td key={h} className="px-3 py-2 text-text-primary max-w-[220px] truncate">
                          {row[h] == null || row[h] === '' ? (
                            <span className="text-text-tertiary">—</span>
                          ) : (
                            String(row[h])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
