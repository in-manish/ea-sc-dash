import { Copy, Link2 } from 'lucide-react';
import { HISTORY_LIMIT } from '../constants';
import { isGeneralFileLink } from '../domain/generalFileLink';

const formatDate = (value) => new Date(value).toLocaleString();

const FileUploadHistoryList = ({ history, onCopy, onReplace }) => {
  return (
    <div className="pt-1">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Upload history
        </h4>
        <span className="text-xs text-text-tertiary">Last {HISTORY_LIMIT}</span>
      </div>

      {history.length === 0 ? (
        <p className="text-xs text-text-tertiary">No uploads yet.</p>
      ) : (
        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
          {history.map((entry) => {
            const canReplace = isGeneralFileLink(entry.fileUrl);
            return (
              <div key={entry.id} className="rounded-md border border-border p-2 bg-bg-secondary">
                <p className="text-xs font-medium text-text-primary truncate">{entry.fileName}</p>
                <p className="text-[11px] text-text-secondary">{formatDate(entry.uploadedAt)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Link2 size={12} className="text-text-secondary shrink-0" />
                  <span className="text-[11px] text-text-primary truncate flex-1">
                    {entry.fileUrl || 'No URL returned'}
                  </span>
                  {entry.fileUrl ? (
                    <button
                      type="button"
                      onClick={() => onCopy(entry.fileUrl)}
                      className="border-none bg-transparent text-accent cursor-pointer p-1"
                      title="Copy URL"
                    >
                      <Copy size={13} />
                    </button>
                  ) : null}
                </div>
                {canReplace ? (
                  <button
                    type="button"
                    onClick={() => onReplace(entry.fileUrl)}
                    className="mt-1 border-none bg-transparent text-[11px] text-accent cursor-pointer p-0"
                  >
                    Replace this file
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUploadHistoryList;
