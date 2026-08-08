import React from 'react';
import { Copy, Check } from 'lucide-react';

const CopyableValue = ({ value, label, prefix = '', className = '', hideLabel = false }) => {
    const [copied, setCopied] = React.useState(false);

    if (value === null || value === undefined || value === '') {
        if (hideLabel) return null;
        return (
            <span className={`text-xs text-text-tertiary ${className}`}>
                {label}: -
            </span>
        );
    }

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(String(value));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const displayText = hideLabel ? `${prefix}${value}` : `${label}: ${prefix}${value}`;

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={`Copy ${label}`}
            className={`inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors group/copy bg-transparent border-none p-0 cursor-pointer ${className}`}
        >
            <span>{displayText}</span>
            {copied ? (
                <Check size={11} className="text-green-600 shrink-0" />
            ) : (
                <Copy size={11} className="opacity-0 group-hover/copy:opacity-60 transition-opacity shrink-0" />
            )}
        </button>
    );
};

export default CopyableValue;
