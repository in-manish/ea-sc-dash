import { Download, Eye, FileUp } from 'lucide-react';

export default function ImportUploadPanel({
  file,
  onFileChange,
  tagText,
  onTagTextChange,
  dryRun,
  onDryRunChange,
  submitting,
  error,
  success,
  onSubmit,
  onPreviewLocal,
  onDownloadLocal,
  previewBusy = false,
  downloadBusy = false,
}) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-bg-secondary/40 p-4">
      <h3 className="text-sm font-semibold text-text-primary m-0 mb-1">Upload import</h3>
      <p className="text-xs text-text-tertiary m-0 mb-4">
        CSV or Excel. Email column is auto-detected. History Preview/Download uses the
        file URL returned on each import job.
      </p>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">File</span>
          <input
            type="file"
            accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-accent file:text-white file:text-sm file:font-medium file:cursor-pointer"
          />
          {file ? (
            <span className="text-xs text-text-tertiary">{file.name}</span>
          ) : null}
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Tags (optional)</span>
          <input
            type="text"
            value={tagText}
            onChange={(e) => onTagTextChange(e.target.value)}
            placeholder="vip, newsletter — comma-separated"
            className="w-full max-w-lg px-3 py-2 text-sm rounded-md border border-border bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => onDryRunChange(e.target.checked)}
            className="rounded border-border"
          />
          Dry run (validate only — do not write subscribers)
        </label>

        {error ? <p className="text-sm text-danger m-0">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700 m-0">{success}</p> : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!file || previewBusy || submitting}
            onClick={onPreviewLocal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-bg-primary text-text-primary text-sm font-medium cursor-pointer hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye size={16} />
            {previewBusy ? 'Opening…' : 'Preview CSV'}
          </button>
          <button
            type="button"
            disabled={!file || downloadBusy || submitting}
            onClick={onDownloadLocal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-bg-primary text-text-primary text-sm font-medium cursor-pointer hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {downloadBusy ? '…' : 'Download'}
          </button>
          <button
            type="button"
            disabled={!file || submitting}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white text-sm font-medium border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileUp size={16} />
            {submitting ? 'Uploading…' : dryRun ? 'Start dry run' : 'Start import'}
          </button>
        </div>
      </div>
    </section>
  );
}
