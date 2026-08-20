import { Archive, ArrowLeft, MessageSquare, Pencil, Plus, RotateCcw } from 'lucide-react';

const btnPrimary =
    'btn btn-primary px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-accent/15 font-bold uppercase tracking-wider text-[10px]';
const btnSecondary =
    'btn btn-secondary px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]';

export default function WhatsAppConfigHeader({
    title,
    subtitle,
    view,
    previewTemplate,
    editingId,
    isActive,
    isBusy,
    onCreate,
    onEdit,
    onBack,
    onArchive,
    onRestore,
}) {
    const showArchive = Boolean((view === 'preview' || editingId) && previewTemplate && isActive);
    const showRestore = Boolean((view === 'preview' || editingId) && previewTemplate && !isActive);

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
                    <MessageSquare size={22} className="text-accent shrink-0" />
                    <span className="truncate">{title}</span>
                </h2>
                <p className="text-sm text-text-tertiary mt-1">{subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                {view === 'list' && (
                    <button type="button" onClick={onCreate} className={btnPrimary}>
                        <Plus size={16} />
                        New template
                    </button>
                )}
                {view === 'preview' && previewTemplate && (
                    <button type="button" onClick={() => onEdit(previewTemplate)} className={btnPrimary}>
                        <Pencil size={16} />
                        Edit template
                    </button>
                )}
                {showArchive && (
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onArchive(previewTemplate)}
                        className={btnSecondary}
                    >
                        <Archive size={16} />
                        Archive
                    </button>
                )}
                {showRestore && (
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onRestore(previewTemplate)}
                        className={btnSecondary}
                    >
                        <RotateCcw size={16} />
                        Restore
                    </button>
                )}
                {view !== 'list' && (
                    <button type="button" onClick={onBack} className={btnSecondary}>
                        <ArrowLeft size={16} />
                        Back
                    </button>
                )}
            </div>
        </div>
    );
}
