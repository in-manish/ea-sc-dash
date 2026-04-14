import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Eye, FileText } from 'lucide-react';

/**
 * EBadgeEditor – raw content editor with Edit / Preview modes.
 *
 * Design contract (per raw-html-content-editor skill):
 *  • Store and send content as an opaque plain string.
 *  • Only change content in response to explicit user edits.
 *  • Exception: one-time strip of \r that the server injects (not user-authored).
 */
const EBadgeEditor = ({ value, onChange, label, description }) => {
    const [view, setView] = useState('edit');
    const hasCleanedRef = useRef(false);

    // ── One-time clean: strip server-injected \r on initial load ──
    // The API/database returns "\r\n" line endings. Browsers textareas use "\n".
    // We strip \r ONCE so the user sees clean content. After that we never touch it.
    useEffect(() => {
        if (value && !hasCleanedRef.current) {
            // Check if value contains \r chars (server artifact)
            if (typeof value === 'string' && value.includes('\r')) {
                hasCleanedRef.current = true;
                onChange(value.replace(/\r/g, ''));
                return;
            }
            hasCleanedRef.current = true;
        }
    }, [value]);

    const mockAttendee = {
        name: 'John Doe',
        reg_id: 'REG-2026-1042',
        attendee_type_name: 'Delegate',
        event_name: 'Global Tech Expo 2026',
        event_address: 'Grand Convention Center, Chennai',
        event_start_date: 'March 20, 2026',
        event_end_date: 'March 22, 2026',
        company: 'Innovate Systems',
        designation: 'Senior Architect',
        email: 'john.doe@example.com',
        phone_number: '+91 98765 43210'
    };

    const getPreviewContent = (content) => {
        if (!content) return '';
        let preview = content;
        Object.keys(mockAttendee).forEach(key => {
            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
            preview = preview.replace(regex, mockAttendee[key]);
        });
        return preview;
    };

    // Display value: only strip \r for display so invisible chars don't lurk.
    // This does NOT mutate the parent state – it's display-only.
    const displayValue = typeof value === 'string' ? value.replace(/\r/g, '') : (value || '');

    return (
        <div className="space-y-4 group">
            {/* ── Header + Tab Switcher ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em] flex items-center gap-2">
                        <FileText size={12} className="text-accent/60" />
                        {label}
                    </label>
                    {description && <p className="text-xs text-text-tertiary/80 leading-snug max-w-2xl">{description}</p>}
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

            {/* ── Content Area ── */}
            <div className="relative overflow-hidden transition-all duration-300">
                {view === 'edit' ? (
                    <div className="animate-fade-in">
                        <textarea
                            value={displayValue}
                            onChange={(e) => {
                                // Pass through exactly what the user typed – zero mutations.
                                onChange(e.target.value);
                            }}
                            className="w-full min-h-[350px] p-6 text-[14px] font-mono leading-relaxed text-text-primary bg-bg-primary border border-border rounded-xl focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all resize-y shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                            placeholder="Enter e-badge content here…"
                            spellCheck="false"
                        />
                        <div className="absolute right-4 bottom-4 pointer-events-none">
                            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary/80 backdrop-blur-sm px-2 py-1 rounded border border-border/50">
                                Raw Editor
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in relative">
                        <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary p-6 bg-white min-h-[300px] border border-border/50 rounded-xl shadow-inner overflow-auto paper-canvas">
                            {getPreviewContent(displayValue) || (
                                <span className="text-text-tertiary italic">No content to preview</span>
                            )}
                        </div>
                        <div className="absolute right-6 top-6 pointer-events-none">
                            <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest border border-accent/10 px-2 py-1 rounded-full">
                                Live Preview
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EBadgeEditor;

