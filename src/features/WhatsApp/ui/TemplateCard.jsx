import React from 'react';
import { Pencil, ChevronRight } from 'lucide-react';
import TemplateStatusBadge from './TemplateStatusBadge';
import MessageBubble from './MessageBubble';

const TemplateCard = ({ template, onView, onEdit }) => {
    const fieldCount = Object.keys(template.content_variables || {}).length;

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={() => onView(template)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onView(template);
                }
            }}
            className="group cursor-pointer bg-bg-primary rounded-2xl border border-border hover:border-accent/30 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
            <div className="p-5 border-b border-border bg-bg-secondary/40">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                template.provider === 'TWILIO'
                                    ? 'bg-red-50 text-red-600 border-red-100'
                                    : 'bg-accent/10 text-accent border-accent/20'
                            }`}
                        >
                            {template.provider === 'TWILIO' ? 'Twilio' : 'MSG91'}
                        </span>
                        <TemplateStatusBadge status={template.status} size="sm" />
                    </div>
                    <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider shrink-0">
                        {template.category}
                    </span>
                </div>
                <h3 className="font-bold text-text-primary text-base tracking-tight group-hover:text-accent transition-colors truncate">
                    {template.template_name}
                </h3>
                {template.description ? (
                    <p className="mt-1.5 text-xs text-text-tertiary line-clamp-2 leading-relaxed">
                        {template.description}
                    </p>
                ) : null}
            </div>

            <div className="p-5 flex-1 min-h-[140px] flex items-center justify-center bg-[#e5ddd5]/40 dark:bg-bg-tertiary/40">
                <MessageBubble
                    compact
                    text={template.msg_text}
                    variables={template.content_variables || {}}
                />
            </div>

            <div className="px-5 py-3.5 bg-bg-secondary/30 flex justify-between items-center border-t border-border">
                <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                    {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
                </span>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(template);
                        }}
                        className="inline-flex items-center gap-1.5 text-text-tertiary hover:text-accent text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                        <Pencil size={12} />
                        Edit
                    </button>
                    <span className="inline-flex items-center gap-1 text-accent text-[10px] font-bold uppercase tracking-wider">
                        View
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                </div>
            </div>
        </article>
    );
};

export default TemplateCard;
