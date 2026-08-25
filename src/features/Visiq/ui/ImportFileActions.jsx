import { Download, Eye } from 'lucide-react';

export default function ImportFileActions({
  importId,
  onPreview,
  onDownload,
  downloadBusy = false,
  compact = false,
}) {
  const btn =
    'inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-primary text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  const size = compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm';

  return (
    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={`${btn} ${size}`}
        onClick={() => onPreview?.(importId)}
        title="Preview in browser"
      >
        <Eye size={compact ? 13 : 15} />
        Preview
      </button>
      <button
        type="button"
        className={`${btn} ${size}`}
        disabled={downloadBusy}
        onClick={() => onDownload?.(importId)}
        title="Download file"
      >
        <Download size={compact ? 13 : 15} />
        {downloadBusy ? '…' : 'Download'}
      </button>
    </div>
  );
}
