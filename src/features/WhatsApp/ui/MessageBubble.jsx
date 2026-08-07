import React from 'react';
import { Check } from 'lucide-react';
import { buildPreviewHtml } from '../domain/templateHelpers';

/**
 * WhatsApp-style message bubble used in list cards and the live preview.
 */
const MessageBubble = ({
    text,
    variables,
    emptyLabel = 'No message content…',
    compact = false,
}) => {
    const bodyClass = compact
        ? 'text-[13px] line-clamp-4 leading-relaxed'
        : 'text-[15px] whitespace-pre-wrap leading-relaxed';

    const html = text ? buildPreviewHtml(text, variables || {}) : '';
    const lines = html ? html.split('\n') : [];

    return (
        <div
            className={`bg-white relative border border-border shadow-sm ${
                compact ? 'p-4 rounded-2xl w-full max-w-[280px]' : 'p-6 rounded-2xl max-w-[90%]'
            }`}
        >
            <div
                className="absolute top-4 -left-1.5 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"
                aria-hidden
            />
            <div className={`${bodyClass} text-text-primary font-medium`}>
                {lines.length > 0
                    ? lines.map((line, i) => (
                        <div
                            key={i}
                            className="min-h-[1.2em]"
                            dangerouslySetInnerHTML={{ __html: line }}
                        />
                    ))
                    : <span className="opacity-40 italic font-normal">{emptyLabel}</span>}
            </div>
            {!compact && (
                <div className="flex items-center justify-end gap-1.5 mt-4 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <Check size={12} className="text-success" />
                </div>
            )}
        </div>
    );
};

export default MessageBubble;
