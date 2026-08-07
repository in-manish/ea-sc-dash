import React from 'react';
import { Copy, Check } from 'lucide-react';

const ObfCopyChip = ({ value }) => {
    const [copied, setCopied] = React.useState(false);

    if (value === null || value === undefined || value === '') return null;

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(String(value));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title="Copy OBF number"
            className="mt-1 inline-flex max-w-full items-center gap-1.5 rounded-md bg-bg-secondary px-1.5 py-0.5 text-left transition-colors hover:bg-accent/5 group/obf"
        >
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-text-tertiary">
                OBF
            </span>
            <span className="truncate font-mono text-[11px] font-medium tracking-wide text-text-primary">
                {value}
            </span>
            {copied ? (
                <Check size={11} className="shrink-0 text-green-600" />
            ) : (
                <Copy
                    size={11}
                    className="shrink-0 text-text-tertiary opacity-40 transition-opacity group-hover/obf:opacity-80"
                />
            )}
        </button>
    );
};

export default ObfCopyChip;
