import React from 'react';

const EBadgeEditor = ({ value, onChange, label, description }) => {
    // If the database sends back literal string "\\r\\n", convert them to actual newlines
    // so the textarea renders them correctly as line breaks instead of text characters.
    let displayValue = '';
    if (typeof value === 'string') {
        displayValue = value
            .replace(/\\r\\n/g, '\n') // literal \r\n string
            .replace(/\\n/g, '\n')    // literal \n string
            .replace(/\\r/g, '')      // literal \r string
            .replace(/\r\n/g, '\n')   // actual physical \r\n characters
            .replace(/\r/g, '');      // actual physical \r character
    }

    return (
        <div className="space-y-2">
            <div>
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">{label}</label>
                {description && <p className="text-[11px] text-text-tertiary mt-0.5">{description}</p>}
            </div>

            <textarea
                value={displayValue}
                onChange={(e) => {
                    // Forcefully and aggressively normalize all line breaks to just \n
                    // and remove any literal \r or physical \r characters.
                    let cleanValue = e.target.value
                        .replace(/\\r\\n/g, '\n')
                        .replace(/\\n/g, '\n')
                        .replace(/\\r/g, '')
                        .replace(/\r\n/g, '\n')
                        .replace(/\r/g, '');
                    onChange(cleanValue);
                }}
                className="w-full min-h-[250px] p-4 text-[13px] font-mono leading-relaxed text-text-primary bg-bg-primary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-y"
                placeholder="Enter e-badge content here..."
            />
        </div>
    );
};

export default EBadgeEditor;
