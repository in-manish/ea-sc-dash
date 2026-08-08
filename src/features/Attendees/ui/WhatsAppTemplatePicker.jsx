import {
    List,
    LayoutGrid,
    CheckCircle2,
    Square,
    Smartphone,
    ChevronUp,
    ChevronDown,
} from 'lucide-react';
import { getTemplatePreview, renderWhatsAppPreview } from '../domain/whatsappPreview';
import WhatsAppTemplatePreviewPane from './WhatsAppTemplatePreviewPane';

const WhatsAppTemplatePicker = ({
    templates,
    templateViewMode,
    setTemplateViewMode,
    selectedTemplateId,
    setSelectedTemplateId,
    expandedTemplateId,
    setExpandedTemplateId,
    previewContentMode,
    setPreviewContentMode,
    previewAttendee,
}) => (
    <>
        <div className="flex items-center justify-between gap-4 mb-4">
            <div>
                <div className="text-sm font-semibold text-text-primary">Templates</div>
                <div className="text-xs text-text-tertiary">Preview uses selected attendee data.</div>
            </div>
            <div className="flex bg-bg-primary border border-border rounded-md p-1">
                <button
                    type="button"
                    onClick={() => setTemplateViewMode('list')}
                    className={`flex items-center justify-center w-9 h-8 rounded-sm bg-transparent border-none transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${templateViewMode === 'list' ? 'bg-bg-tertiary text-accent' : 'text-text-secondary'}`}
                    title="List View"
                    aria-label="List View"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => setTemplateViewMode('card')}
                    className={`flex items-center justify-center w-9 h-8 rounded-sm bg-transparent border-none transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${templateViewMode === 'card' ? 'bg-bg-tertiary text-accent' : 'text-text-secondary'}`}
                    title="Card View"
                    aria-label="Card View"
                >
                    <LayoutGrid size={18} />
                </button>
            </div>
        </div>

        <div className={templateViewMode === 'card' ? 'grid gap-4 md:grid-cols-2' : 'space-y-3'}>
            {templates.map((template) => {
                const isSelected = selectedTemplateId === template.id;
                const isExpanded = expandedTemplateId === template.id;
                const previewMessage = renderWhatsAppPreview(template, previewAttendee);

                return (
                    <div
                        key={template.id}
                        className={`rounded-xl border transition-all ${isSelected ? 'border-accent bg-accent/5 shadow-md' : 'border-border bg-bg-primary'}`}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedTemplateId(template.id)}
                            className={`w-full text-left p-5 ${templateViewMode === 'list' ? 'flex items-start justify-between gap-4' : ''}`}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-text-primary truncate">
                                            {template.template_name}
                                        </div>
                                        {template.description && (
                                            <p className="text-sm text-text-secondary mt-1 line-clamp-1">
                                                {template.description}
                                            </p>
                                        )}
                                    </div>
                                    {isSelected ? (
                                        <CheckCircle2 size={18} className="text-accent shrink-0" />
                                    ) : (
                                        <Square size={18} className="text-text-tertiary shrink-0" />
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="inline-flex rounded-full bg-bg-secondary px-2.5 py-1 text-[11px] font-semibold text-text-secondary border border-border">
                                        {template.provider || 'Unknown'}
                                    </span>
                                    <span className="inline-flex rounded-full bg-bg-secondary px-2.5 py-1 text-[11px] font-semibold text-text-secondary border border-border">
                                        ID {template.id}
                                    </span>
                                </div>

                                {templateViewMode === 'card' && (
                                    <p className="text-sm text-text-secondary mt-3 line-clamp-3">
                                        {getTemplatePreview(template)}
                                    </p>
                                )}
                            </div>
                        </button>

                        <div className="px-5 pb-4">
                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedTemplateId(isExpanded ? null : template.id)
                                }
                                className="inline-flex items-center gap-2 text-sm text-accent font-medium bg-transparent border-none p-0"
                            >
                                <Smartphone size={15} />
                                Preview message
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isExpanded && (
                                <WhatsAppTemplatePreviewPane
                                    template={template}
                                    previewMessage={previewMessage}
                                    previewAttendee={previewAttendee}
                                    previewContentMode={previewContentMode}
                                    setPreviewContentMode={setPreviewContentMode}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </>
);

export default WhatsAppTemplatePicker;
