import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { formatColumnValue } from '../domain/tableColumns';

function copyText(text) {
    const value = String(text ?? '');
    if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(value).catch(() => fallbackCopy(value));
    }
    fallbackCopy(value);
    return Promise.resolve();
}

function fallbackCopy(value) {
    const area = document.createElement('textarea');
    area.value = value;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
}

function hrefFor(value) {
    const text = String(value);
    return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

/** One optional field. The column header is the label; the cell is the value. */
export default function AttendeeExtraCell({ column, attendee, eventId, formatValue = formatColumnValue }) {
    const navigate = useNavigate();
    const shown = formatValue(column, attendee);
    const [copied, setCopied] = useState(false);

    if (shown.empty) {
        return <span className="text-sm text-text-tertiary">—</span>;
    }

    if (column.kind === 'bool') {
        return (
            <span className={`text-sm font-medium ${shown.on ? 'text-emerald-700' : 'text-text-tertiary'}`}>
                {shown.text}
            </span>
        );
    }

    if (column.kind === 'link') {
        return (
            <a
                href={hrefFor(shown.text)}
                target="_blank"
                rel="noopener noreferrer"
                title={shown.text}
                className="block max-w-[14rem] text-sm text-accent break-all hover:underline"
            >
                {shown.text}
            </a>
        );
    }

    if (column.kind === 'company' && eventId) {
        return (
            <button
                type="button"
                title="Open company"
                className="text-sm font-medium text-accent bg-transparent border-none p-0 cursor-pointer hover:underline"
                onClick={() => navigate(`/event/${eventId}/companies/${shown.text}`)}
            >
                {shown.text}
            </button>
        );
    }

    const copy = () => {
        copyText(shown.copy || shown.text).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        });
    };

    return (
        <button
            type="button"
            title={shown.text}
            onClick={copy}
            className="group/cell inline-flex items-start gap-1 max-w-[16rem] text-left bg-transparent border-none p-0 cursor-pointer"
        >
            <span className="text-sm text-text-primary break-words line-clamp-3">{shown.text}</span>
            {copied
                ? <Check size={12} className="mt-1 shrink-0 text-green-600" />
                : <Copy size={12} className="mt-1 shrink-0 text-text-tertiary opacity-0 group-hover/cell:opacity-100" />}
        </button>
    );
}
