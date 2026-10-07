import { useState } from 'react';
import {
    AlertCircle, ChevronDown, ChevronLeft, ChevronRight, History, Loader2, RefreshCw,
} from 'lucide-react';
import { MAPPING_UPLOAD_PAGE_SIZES } from '../../hooks/useSurveyBackfillMappingUploads';
import MappingUploadDetailModal, { UploadRowActions } from './MappingUploadDetailModal';

export default function MappingUploadsPanel({ uploads, pageSize, setPageSize, uploadId }) {
    const [open, setOpen] = useState(true);
    const showDetail = Boolean(uploadId);

    return (
        <section className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-left min-w-0 flex-1 bg-transparent border-none p-0 cursor-pointer"
                    aria-expanded={open}
                >
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <ChevronDown
                            size={18}
                            className={`text-text-tertiary transition-transform ${open ? '' : '-rotate-90'}`}
                        />
                        <History size={18} className="text-accent" />
                        Upload history
                        {!open && uploads.total > 0 && (
                            <span className="text-xs font-medium text-text-tertiary">
                                ({uploads.total})
                            </span>
                        )}
                    </h3>
                    {open && (
                        <p className="text-xs text-text-tertiary mt-1 pl-7">
                            Stored after a successful save (not dry runs). Newest first.
                        </p>
                    )}
                </button>
                {open && (
                    <button
                        type="button"
                        onClick={uploads.refresh}
                        disabled={uploads.loading}
                        className="btn btn-secondary btn-sm gap-2"
                    >
                        <RefreshCw size={14} className={uploads.loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                )}
            </div>

            {open && (
                <>
                    {uploads.error && (
                        <div className="p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-2 text-status-danger text-sm">
                            <AlertCircle size={16} />
                            {uploads.error}
                        </div>
                    )}

                    {uploads.loading && !uploads.results.length ? (
                        <div className="flex items-center justify-center py-8 text-text-tertiary gap-2 text-sm">
                            <Loader2 className="animate-spin text-accent" size={20} />
                            Loading uploads…
                        </div>
                    ) : uploads.results.length === 0 ? (
                        <p className="text-sm text-text-secondary py-6 text-center">
                            No saved mapping uploads yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {uploads.results.map((row) => (
                                <div
                                    key={row.id}
                                    className="p-3 rounded-lg border border-border bg-bg-secondary flex flex-wrap items-center justify-between gap-3"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-text-primary truncate">
                                            {row.fileName}
                                        </p>
                                        <p className="text-xs text-text-tertiary mt-0.5">
                                            #{row.id} · {row.fileSizeLabel} · saved {row.saved}
                                            {row.errorCount ? ` · ${row.errorCount} err` : ''}
                                            {row.warningCount ? ` · ${row.warningCount} warn` : ''}
                                            {row.createdAt
                                                ? ` · ${new Date(row.createdAt).toLocaleString()}`
                                                : ''}
                                        </p>
                                        <p className="text-[11px] text-text-tertiary mt-0.5">
                                            {row.uploadedBy
                                                ? (row.uploadedBy.username || row.uploadedBy.email)
                                                : 'Imported via command'}
                                            {row.forms?.length ? ` · ${row.forms.join(', ')}` : ''}
                                        </p>
                                    </div>
                                    <UploadRowActions
                                        row={row}
                                        downloading={uploads.downloadingId === row.id}
                                        onView={uploads.openUpload}
                                        onDownload={uploads.download}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-tertiary">
                        <div className="flex flex-wrap items-center gap-3">
                            <span>
                                Page {uploads.page} · {uploads.total} file{uploads.total === 1 ? '' : 's'}
                            </span>
                            <label className="flex items-center gap-1.5">
                                <span className="font-semibold text-text-secondary">Per page</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => setPageSize(Number(e.target.value))}
                                    className="px-2 py-1 text-xs border border-border rounded-md bg-bg-primary text-text-primary"
                                >
                                    {MAPPING_UPLOAD_PAGE_SIZES.map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm gap-1"
                                disabled={uploads.page <= 1 || uploads.loading}
                                onClick={() => uploads.setPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={14} /> Prev
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm gap-1"
                                disabled={uploads.page * pageSize >= uploads.total || uploads.loading}
                                onClick={() => uploads.setPage((p) => p + 1)}
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {showDetail && (
                <MappingUploadDetailModal
                    detail={uploads.detail}
                    loading={uploads.detailLoading}
                    downloading={uploads.downloadingId === Number(uploadId) || uploads.downloadingId === uploadId}
                    onClose={uploads.closeDetail}
                    onDownload={uploads.download}
                />
            )}
        </section>
    );
}
