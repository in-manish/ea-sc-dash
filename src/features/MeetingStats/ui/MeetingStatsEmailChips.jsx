import { X } from 'lucide-react';

export default function MeetingStatsEmailChips({
  emails,
  input,
  inputError,
  sending,
  onInput,
  onKeyDown,
  onPaste,
  onBlur,
  onRemove,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="meeting-stats-emails" className="block text-sm font-medium text-text-primary">
        Recipient email addresses
      </label>
      <div
        className="flex flex-wrap gap-1.5 min-h-[2.5rem] py-1.5 px-2 border border-border rounded-md bg-bg-secondary transition-colors duration-200 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 cursor-text"
        onClick={() => document.getElementById('meeting-stats-emails')?.focus()}
      >
        {emails.map((email) => (
          <span
            key={email}
            className="flex items-center gap-1.5 px-3 py-1 bg-bg-primary rounded-full text-[0.8125rem] font-medium text-text-secondary border border-border"
          >
            {email}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(email);
              }}
              disabled={sending}
              className="flex items-center justify-center rounded-full p-0.5 bg-transparent border-none text-text-tertiary hover:bg-black/10 hover:text-text-primary cursor-pointer disabled:opacity-50"
              aria-label={`Remove ${email}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id="meeting-stats-emails"
          type="text"
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={onBlur}
          placeholder={emails.length === 0 ? 'Type email and press Enter' : ''}
          className="flex-1 min-w-[8rem] py-0.5 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-tertiary"
          disabled={sending}
          autoFocus
        />
      </div>
      {inputError ? (
        <p className="text-xs text-red-600 m-0">{inputError}</p>
      ) : (
        <p className="text-xs text-text-tertiary m-0">Press Enter or comma to add.</p>
      )}
    </div>
  );
}
