import { Copy, GripHorizontal, X } from 'lucide-react';
import { isGeneralFileLink } from '../domain/generalFileLink';
import FileUploadForm from './FileUploadForm';
import FileUploadHistoryList from './FileUploadHistoryList';

const LatestUrl = ({ url, onCopy, onReplace }) => {
  if (!url) return null;
  const canReplace = isGeneralFileLink(url);
  return (
    <div className="rounded-md border border-border p-2 bg-bg-secondary">
      <p className="text-xs text-text-secondary mb-1">Latest URL</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-primary truncate flex-1">{url}</span>
        <button
          type="button"
          onClick={() => onCopy(url)}
          className="border-none bg-transparent text-accent cursor-pointer p-1"
          title="Copy URL"
        >
          <Copy size={14} />
        </button>
      </div>
      {canReplace ? (
        <button
          type="button"
          onClick={() => onReplace(url)}
          className="mt-1 border-none bg-transparent text-[11px] text-accent cursor-pointer p-0"
        >
          Replace this file
        </button>
      ) : null}
    </div>
  );
};

const FloatingFileUploadPanel = ({
  onDragStart,
  onClose,
  form,
  history,
  onCopy,
}) => {
  return (
    <div className="w-[360px] rounded-xl border border-border bg-bg-primary shadow-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 bg-bg-secondary border-b border-border cursor-move"
        onPointerDown={onDragStart}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <GripHorizontal size={16} className="text-text-secondary" />
          File Upload Utility
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border-none bg-transparent text-text-secondary hover:text-text-primary cursor-pointer p-1 rounded"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <FileUploadForm {...form} />
        <LatestUrl url={form.activeUrl} onCopy={onCopy} onReplace={form.onReplace} />
        {form.error ? <p className="text-xs text-danger">{form.error}</p> : null}
        {form.successMessage ? <p className="text-xs text-success">{form.successMessage}</p> : null}
        <FileUploadHistoryList history={history} onCopy={onCopy} onReplace={form.onReplace} />
      </div>
    </div>
  );
};

export default FloatingFileUploadPanel;
