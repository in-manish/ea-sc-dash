import { Code, Eye } from 'lucide-react';

const WhatsAppTemplatePreviewPane = ({
    template,
    previewMessage,
    previewAttendee,
    previewContentMode,
    setPreviewContentMode,
}) => (
    <div className="mt-4 rounded-2xl border border-border bg-bg-secondary/40 p-4">
        <div className="mb-4 flex items-center justify-end">
            <div className="flex bg-bg-primary border border-border rounded-md p-1">
                <button
                    type="button"
                    onClick={() => setPreviewContentMode('raw')}
                    className={`flex items-center justify-center w-9 h-8 rounded-sm bg-transparent border-none transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${previewContentMode === 'raw' ? 'bg-bg-tertiary text-accent' : 'text-text-secondary'}`}
                    title="Raw View"
                    aria-label="Raw View"
                >
                    <Code size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => setPreviewContentMode('preview')}
                    className={`flex items-center justify-center w-9 h-8 rounded-sm bg-transparent border-none transition-all duration-200 hover:text-text-primary hover:bg-bg-secondary ${previewContentMode === 'preview' ? 'bg-bg-tertiary text-accent' : 'text-text-secondary'}`}
                    title="Preview Mode"
                    aria-label="Preview Mode"
                >
                    <Eye size={18} />
                </button>
            </div>
        </div>

        {previewContentMode === 'raw' ? (
            <div className="rounded-xl border border-border bg-slate-950 p-4 overflow-x-auto">
                <pre className="m-0 whitespace-pre-wrap break-words text-[13px] leading-6 text-slate-100 font-mono">
                    {(template.msg_text || 'No raw message available.').replace(/\\n/g, '\n')}
                </pre>
            </div>
        ) : (
            <div className="mx-auto w-full max-w-[290px] rounded-[28px] border border-slate-300 bg-slate-900 p-2 shadow-lg">
                <div className="rounded-[22px] bg-[#e5ddd5] p-3 min-h-[360px] bg-[linear-gradient(180deg,rgba(255,255,255,0.25),rgba(229,221,213,0.95))] flex flex-col">
                    <div className="mb-3 flex items-center justify-between rounded-full bg-[#075e54] px-4 py-2 text-white">
                        <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">Sample preview</div>
                            <div className="text-[11px] text-white/80 truncate">
                                {previewAttendee?.phone_number
                                    ? `+${previewAttendee.country_code || ''} ${previewAttendee.phone_number}`
                                    : 'WhatsApp preview'}
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[13px] leading-6 text-slate-800 shadow-sm whitespace-pre-wrap max-w-[92%] self-start">
                        {previewMessage}
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default WhatsAppTemplatePreviewPane;
