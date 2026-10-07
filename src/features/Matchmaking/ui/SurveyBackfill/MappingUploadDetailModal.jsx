import { Download, Eye, Loader2, X } from 'lucide-react';
import MappingCsvResultPanel from './MappingCsvResultPanel';

export default function MappingUploadDetailModal({ detail, loading, downloading, onClose, onDownload }) {
    if (!detail && !loading) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1300] animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[94%] max-w-[720px] max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-5 border-b border-border flex items-start justify-between bg-bg-secondary gap-3">
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold text-text-primary truncate">
                            {detail?.fileName || 'Mapping upload'}
                        </h3>
                        {detail && (
                            <p className="text-xs text-text-tertiary mt-1">
                                #{detail.id}
                                {detail.createdAt ? ` · ${new Date(detail.createdAt).toLocaleString()}` : ''}
                                {detail.uploadedBy
                                    ? ` · ${detail.uploadedBy.username || detail.uploadedBy.email}`
                                    : ' · imported'}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm hover:bg-bg-tertiary"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-4">
                    {loading && !detail ? (
                        <div className="flex items-center justify-center py-12 text-text-tertiary gap-2 text-sm">
                            <Loader2 className="animate-spin text-accent" size={20} />
                            Loading upload…
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                                <span className="px-2 py-1 rounded-md bg-bg-secondary border border-border">
                                    {detail.fileSizeLabel}
                                </span>
                                <span className="px-2 py-1 rounded-md bg-bg-secondary border border-border">
                                    Saved {detail.saved}
                                </span>
                                <span className="px-2 py-1 rounded-md bg-bg-secondary border border-border">
                                    Errors {detail.errorCount} · Warnings {detail.warningCount} · Ignored {detail.ignoredCount}
                                </span>
                                {detail.forms?.length > 0 && (
                                    <span className="px-2 py-1 rounded-md bg-bg-secondary border border-border break-all">
                                        {detail.forms.join(', ')}
                                    </span>
                                )}
                            </div>

                            {detail.report && <MappingCsvResultPanel result={detail.report} />}

                            {detail.content != null && (
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-text-tertiary mb-2">
                                        File content
                                    </p>
                                    <pre className="text-[11px] leading-relaxed p-3 rounded-lg border border-border bg-bg-secondary overflow-auto max-h-56 whitespace-pre-wrap break-all">
                                        {detail.content}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-border flex justify-end gap-2 bg-bg-secondary">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm gap-2"
                        disabled={!detail || downloading}
                        onClick={() => onDownload(detail.id, detail.fileName)}
                    >
                        {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
}

export function UploadRowActions({ row, downloading, onView, onDownload }) {
    return (
        <div className="flex items-center gap-1">
            <button
                type="button"
                className="btn btn-secondary btn-sm gap-1"
                onClick={() => onView(row.id)}
                title="View upload"
            >
                <Eye size={13} />
                View
            </button>
            <button
                type="button"
                className="btn btn-secondary btn-sm gap-1"
                disabled={downloading}
                onClick={() => onDownload(row.id, row.fileName)}
                title="Download CSV"
            >
                {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            </button>
        </div>
    );
}
