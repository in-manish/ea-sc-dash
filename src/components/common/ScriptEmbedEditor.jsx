import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Eye, Code2 } from 'lucide-react';

/**
 * ScriptEmbedEditor – raw JS/HTML embed editor with live iframe preview.
 *
 * Design contract (per raw-html-content-editor skill):
 *  • Store and send content as an opaque plain string.
 *  • Only change content in response to explicit user edits.
 *  • Preview writes the raw string into an iframe (no wrapping / sanitizing).
 *  • Exception: one-time strip of \r that the server injects (not user-authored).
 */
const ScriptEmbedEditor = ({ value, onChange, label, description, placeholder, previewHeight = 480 }) => {
    const [view, setView] = useState('edit');
    const iframeRef = useRef(null);
    const hasCleanedRef = useRef(false);

    useEffect(() => {
        if (value && !hasCleanedRef.current) {
            if (typeof value === 'string' && value.includes('\r')) {
                hasCleanedRef.current = true;
                onChange(value.replace(/\r/g, ''));
                return;
            }
            hasCleanedRef.current = true;
        }
    }, [value]);

    const displayValue = typeof value === 'string' ? value.replace(/\r/g, '') : (value || '');

    useEffect(() => {
        if (view !== 'preview' || !iframeRef.current) return;

        const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(displayValue);
        doc.close();
    }, [view, displayValue]);

    return (
        <div className="space-y-4 group">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] flex items-center gap-2">
                        <Code2 size={12} className="text-accent/60" />
                        {label}
                    </label>
                    {description && (
                        <p className="text-xs text-text-tertiary/80 leading-snug max-w-2xl">{description}</p>
                    )}
                </div>

                <div className="inline-flex p-1 bg-bg-secondary border border-border rounded-xl shadow-sm self-start md:self-auto">
                    <button
                        type="button"
                        onClick={() => setView('edit')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                            view === 'edit'
                                ? 'bg-white text-accent shadow-sm border border-border ring-1 ring-black/5'
                                : 'text-text-tertiary hover:text-text-secondary'
                        }`}
                    >
                        <Edit2 size={13} />
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setView('preview')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                            view === 'preview'
                                ? 'bg-white text-accent shadow-sm border border-border ring-1 ring-black/5'
                                : 'text-text-tertiary hover:text-text-secondary'
                        }`}
                    >
                        <Eye size={13} />
                        Preview
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden transition-all duration-300">
                {view === 'edit' ? (
                    <div className="animate-fade-in">
                        <textarea
                            value={displayValue}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full min-h-[200px] p-6 text-[14px] font-mono leading-relaxed text-text-primary bg-bg-primary border border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all resize-y shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                            placeholder={placeholder || 'Paste embed script HTML here…'}
                            spellCheck="false"
                        />
                        <div className="absolute right-4 bottom-4 pointer-events-none">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary/80 backdrop-blur-sm px-2 py-1 rounded border border-border/50">
                                Raw Script
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in relative">
                        {displayValue ? (
                            <iframe
                                ref={iframeRef}
                                title={`${label || 'Script'} preview`}
                                className="w-full bg-white border border-border/50 rounded-xl shadow-inner"
                                style={{ height: previewHeight }}
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            />
                        ) : (
                            <div className="flex items-center justify-center min-h-[200px] border border-border/50 rounded-xl bg-bg-secondary text-text-tertiary italic text-sm">
                                No script to preview
                            </div>
                        )}
                        <div className="absolute right-6 top-6 pointer-events-none">
                            <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest border border-accent/10 px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm">
                                Live Map Preview
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScriptEmbedEditor;
