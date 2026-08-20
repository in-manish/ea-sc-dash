import { useEffect } from 'react';
import { X } from 'lucide-react';
import { getAlertTypeStyle } from './alertTypes';

const cancelBtn =
    'btn btn-secondary btn-sm px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px]';

/** Themed app dialog for alert + confirm. Uses design tokens so light/dark both work. */
export default function AlertModal({
    type = 'info',
    title,
    message,
    confirmText = 'OK',
    cancelText = '',
    variant = 'primary',
    onConfirm,
    onCancel,
}) {
    const isConfirm = type === 'confirm' && Boolean(onCancel);
    const style = getAlertTypeStyle(type, variant);
    const Icon = style.Icon;
    const dismiss = isConfirm ? onCancel : onConfirm;

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') dismiss?.();
            if (e.key === 'Enter') onConfirm?.();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [dismiss, onConfirm]);

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) dismiss?.();
            }}
            role="presentation"
        >
            <div
                role={isConfirm ? 'alertdialog' : 'dialog'}
                aria-modal="true"
                aria-labelledby="app-alert-title"
                aria-describedby="app-alert-message"
                className="bg-bg-primary border border-border rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconWrap}`}>
                            <Icon size={20} />
                        </span>
                        <h3 id="app-alert-title" className="text-base font-bold text-text-primary m-0 pt-2 leading-snug">
                            {title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={dismiss}
                        className="text-text-tertiary hover:text-text-primary border-none bg-transparent cursor-pointer p-1 rounded-lg hover:bg-bg-secondary transition-colors"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-5 py-4">
                    <p id="app-alert-message" className="m-0 text-sm text-text-secondary leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="px-5 py-4 border-t border-border bg-bg-secondary/40 flex justify-end gap-2">
                    {cancelText ? (
                        <button type="button" className={cancelBtn} onClick={onCancel}>
                            {cancelText}
                        </button>
                    ) : null}
                    <button type="button" className={style.confirmClass} onClick={onConfirm} autoFocus>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
