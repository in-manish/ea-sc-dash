import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

const DEBOUNCE_MS = 400;

/**
 * Search box for the card email log (email, name or reg ID). Typing updates the URL after a short pause;
 * the clear button and Escape clear it at once.
 */
export default function CardEmailLogSearch({ value, onChange, resultText }) {
    const [text, setText] = useState(value);

    useEffect(() => { setText(value); }, [value]);
    useEffect(() => {
        if (text.trim() === value) return undefined;
        const timer = setTimeout(() => onChange(text.trim()), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [text, value, onChange]);

    const clear = () => {
        setText('');
        onChange('');
    };
    const short = text.trim().length === 1;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="relative w-full sm:max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                <input
                    type="text"
                    className="input-field pl-9 pr-9"
                    placeholder="Search by email, name or reg ID"
                    aria-label="Search email log"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Escape') clear(); }}
                />
                {text && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-bg-secondary"
                        onClick={clear}
                        title="Clear search"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            {short && <span className="text-xs text-text-tertiary">Type at least 2 characters.</span>}
            {!short && value && resultText && (
                <span className="text-xs text-text-secondary">
                    {resultText}
                    <button type="button" className="ml-2 text-accent hover:underline" onClick={clear}>Clear</button>
                </span>
            )}
        </div>
    );
}
