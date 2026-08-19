import { useState } from 'react';
import { Download, Loader2, Mail, X } from 'lucide-react';
import { isValidEmail } from '../domain/exhibitorReportQuery';

export function SelectedBadge({ count }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-accent/5 border border-accent/20 rounded-md">
      <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-accent text-white text-xs font-semibold leading-5 text-center">
        {count}
      </span>
      <span className="text-sm text-text-secondary">
        parent exhibitor{count !== 1 ? 's' : ''} selected
      </span>
    </div>
  );
}

export function EmailPane({ emails, setEmails, busy, sending, hasSelected, onSend }) {
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');

  const addEmail = (raw) => {
    const email = raw.trim().toLowerCase();
    if (!email) return;
    if (!isValidEmail(email)) {
      setInputError(`"${email}" is not a valid email`);
      return;
    }
    if (emails.includes(email)) {
      setInputError(`"${email}" already added`);
      return;
    }
    setEmails([...emails, email]);
    setInput('');
    setInputError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(input);
    }
    if (e.key === 'Backspace' && !input && emails.length > 0) {
      setEmails(emails.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const parts = text.split(/[\s,;]+/).filter(Boolean);
    const valid = [];
    for (const part of parts) {
      const email = part.trim().toLowerCase();
      if (isValidEmail(email) && !emails.includes(email) && !valid.includes(email)) {
        valid.push(email);
      }
    }
    if (valid.length) setEmails([...emails, ...valid]);
    setInputError('');
  };

  const removeEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="exh-report-emails" className="block text-sm font-medium text-text-primary">
          Recipient email addresses
        </label>
        <div
          className="flex flex-wrap gap-1.5 min-h-[2.5rem] py-1.5 px-2 border border-border rounded-md bg-bg-secondary transition-colors duration-200 focus-within:border-accent focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/10 cursor-text"
          onClick={() => document.getElementById('exh-report-emails')?.focus()}
        >
          {emails.map((email) => (
            <span
              key={email}
              className="flex items-center gap-1.5 px-3 py-1 bg-bg-primary rounded-full text-[0.8125rem] font-medium text-text-secondary border border-border shadow-sm transition-all hover:border-slate-300"
            >
              {email}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeEmail(email); }}
                disabled={busy}
                className="flex items-center justify-center rounded-full p-0.5 bg-transparent border-none text-text-tertiary hover:bg-black/10 hover:text-text-primary cursor-pointer transition-colors disabled:opacity-50"
                aria-label={`Remove ${email}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            id="exh-report-emails"
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setInputError(''); }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => { if (input.trim()) addEmail(input); }}
            placeholder={emails.length === 0 ? 'Type email and press Enter' : ''}
            className="flex-1 min-w-[8rem] py-0.5 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-tertiary"
            disabled={busy}
            autoFocus
          />
        </div>
        {inputError ? (
          <p className="text-xs text-red-600 m-0">{inputError}</p>
        ) : (
          <p className="text-xs text-text-tertiary m-0">
            Press Enter or comma to add. Emails are saved for next time.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {hasSelected && (
          <button
            type="button"
            className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
            disabled={busy || emails.length === 0}
            onClick={() => onSend(true)}
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            Email selected
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={busy || emails.length === 0}
          onClick={() => onSend(false)}
        >
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
          {hasSelected ? 'Email all' : 'Send report'}
        </button>
      </div>
    </>
  );
}

export function DownloadPane({ busy, downloading, hasSelected, onDownload }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary m-0">
        Download the exhibitor report as a CSV file.
      </p>
      <div className="flex gap-2">
        {hasSelected && (
          <button
            type="button"
            className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
            disabled={busy}
            onClick={() => onDownload(true)}
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Download selected
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={busy}
          onClick={() => onDownload(false)}
        >
          {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          {hasSelected ? 'Download all' : 'Download report'}
        </button>
      </div>
    </div>
  );
}

export function FeedbackMessages({ success, error }) {
  if (!success && !error) return null;
  return (
    <>
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 m-0">
          {success}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2 m-0" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
