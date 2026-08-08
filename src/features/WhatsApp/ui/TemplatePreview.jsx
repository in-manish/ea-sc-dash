import React from 'react';
import { Eye, Info } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TemplateStatusBadge from './TemplateStatusBadge';
import { getStatusMeta } from '../domain/templateHelpers';

const TemplatePreview = ({
    formData,
    mode = 'live', // 'live' | 'detail'
    template = null,
}) => {
    const status = formData?.status || template?.status;
    const statusMeta = getStatusMeta(status);

    return (
        <div className="sticky top-6 space-y-4">
            <h3 className="text-[11px] font-bold text-text-tertiary flex items-center gap-2 uppercase tracking-wider">
                <Eye size={16} className="text-accent" />
                {mode === 'detail' ? 'Template preview' : 'Live preview'}
            </h3>

            {(mode === 'detail' || status) && (
                <div className="flex flex-wrap items-center gap-2 px-1">
                    <TemplateStatusBadge status={status} />
                    {statusMeta.hint && (
                        <span className="text-xs text-text-tertiary">{statusMeta.hint}</span>
                    )}
                </div>
            )}

            <div className="relative rounded-2xl border border-border overflow-hidden min-h-[420px] bg-[#e5ddd5]/50 dark:bg-bg-tertiary/30">
                <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, rgba(0,0,0,0.04) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.03) 0, transparent 35%)',
                    }}
                />
                <div className="relative p-8 min-h-[420px] flex flex-col justify-center">
                    <MessageBubble
                        text={formData.msg_text}
                        variables={formData.content_variables}
                        emptyLabel="Start typing a message to preview it here…"
                    />
                </div>
                <div className="relative bg-bg-primary/90 backdrop-blur border-t border-border px-4 py-2.5 text-[10px] text-center font-semibold text-text-tertiary uppercase tracking-wider">
                    WhatsApp preview
                </div>
            </div>

            {mode === 'detail' && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-bg-secondary border border-border text-sm text-text-secondary">
                    <Info size={16} className="text-accent shrink-0 mt-0.5" />
                    <p>
                        Read-only view. Use <span className="font-semibold text-text-primary">Edit template</span> to change
                        status, copy, or provider settings.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TemplatePreview;
