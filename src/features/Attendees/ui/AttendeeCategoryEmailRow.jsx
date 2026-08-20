import { Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function AttendeeCategoryEmailRow({
    email,
    selected,
    expanded,
    onToggle,
    onToggleExpand,
    disabled,
}) {
    return (
        <div className="py-2 px-1">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    aria-label={email.emailName}
                    disabled={disabled}
                    onClick={onToggle}
                    className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:opacity-50 ${
                        selected
                            ? 'bg-accent border-accent text-white'
                            : 'bg-bg-primary border-border text-transparent hover:border-accent'
                    }`}
                >
                    <Check size={14} strokeWidth={3} />
                </button>
                <button
                    type="button"
                    onClick={onToggleExpand}
                    disabled={disabled}
                    className="flex-1 min-w-0 text-left bg-transparent border-none cursor-pointer p-0 disabled:opacity-50"
                >
                    <div className="flex items-center gap-2">
                        <span className="flex-1 text-sm font-medium text-text-primary truncate">
                            {email.emailName}
                        </span>
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md bg-bg-secondary text-text-secondary border border-border">
                            {email.categoryName}
                        </span>
                        {expanded ? (
                            <ChevronUp size={14} className="text-accent shrink-0" />
                        ) : (
                            <ChevronDown size={14} className="text-text-tertiary shrink-0" />
                        )}
                    </div>
                    <p className="text-xs text-text-tertiary mt-1 truncate">
                        <span className="text-text-secondary">Subject: </span>
                        {email.subject || '(No subject)'}
                    </p>
                </button>
            </div>
            {expanded && email.email && (
                <iframe
                    title={`${email.emailName} preview`}
                    srcDoc={email.email}
                    sandbox="allow-same-origin"
                    className="mt-2 ml-8 w-[calc(100%-2rem)] h-80 rounded-md border border-border bg-white"
                />
            )}
        </div>
    );
}
