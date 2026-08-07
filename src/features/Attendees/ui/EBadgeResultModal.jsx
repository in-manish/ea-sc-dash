import { X, IdCard, Loader2, CheckCircle2, Eye } from 'lucide-react';

const EBadgeResultModal = ({
    isOpen,
    isGenerating,
    error,
    result,
    onClose,
    onDismiss,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1200] animate-fade-in"
            onClick={() => !isGenerating && onClose()}
        >
            <div
                className="bg-bg-primary rounded-lg border border-border shadow-xl w-[90%] max-w-[500px] overflow-hidden transition-all duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary">
                    <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <IdCard size={20} className="text-indigo-600" />
                        E-Badge Generator
                    </h3>
                    {!isGenerating && (
                        <button
                            className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="p-6 flex flex-col items-center justify-center text-center">
                    {isGenerating ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <Loader2 className="animate-spin text-indigo-600" size={48} />
                            <p className="text-sm text-text-secondary font-medium">
                                Generating e-badge, please wait...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="w-full flex flex-col items-center gap-4 py-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <X size={24} />
                            </div>
                            <h4 className="font-bold text-text-primary">Generation Failed</h4>
                            <p className="text-sm text-text-secondary">{error}</p>
                            <button className="btn btn-secondary mt-2" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    ) : result ? (
                        <div className="w-full flex flex-col items-center gap-4 py-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CheckCircle2 size={24} />
                            </div>
                            <h4 className="font-bold text-text-primary">
                                {result.type === 'single'
                                    ? 'E-badge Created!'
                                    : 'Bulk Generation Started!'}
                            </h4>

                            {result.type === 'single' ? (
                                <>
                                    <p className="text-sm text-text-secondary">
                                        Your badge is ready for download.
                                    </p>
                                    <a
                                        href={result.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary flex items-center gap-2 mt-2"
                                    >
                                        <Eye size={16} />
                                        View E-badge
                                    </a>
                                </>
                            ) : (
                                <div className="w-full text-left bg-bg-secondary p-4 rounded-lg border border-border mt-2">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-text-secondary font-medium">
                                            Total Badges:
                                        </span>
                                        <span className="text-text-primary font-bold">
                                            {result.total}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-text-secondary font-medium">
                                            Progress UUID:
                                        </span>
                                        <span
                                            className="text-text-primary font-mono select-all bg-bg-tertiary px-1.5 py-0.5 rounded border border-border max-w-[200px] truncate"
                                            title={result.progressUuid}
                                        >
                                            {result.progressUuid}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-tertiary mt-3 pt-3 border-t border-border/50 text-center">
                                        The badges are being generated in the background. You can
                                        safely close this window.
                                    </p>
                                </div>
                            )}
                            <button className="btn btn-secondary mt-4" onClick={onDismiss}>
                                Dismiss
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default EBadgeResultModal;
