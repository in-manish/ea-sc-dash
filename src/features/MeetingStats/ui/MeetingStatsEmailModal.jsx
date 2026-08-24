import { useEffect, useState } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { isValidEmail, parseEmailInput } from '../domain/meetingStatsEmails';
import MeetingStatsEmailChips from './MeetingStatsEmailChips';

export default function MeetingStatsEmailModal({
  sending,
  cooldownLeft = 0,
  error,
  success,
  emails,
  onEmailsChange,
  onSend,
  onClose,
}) {
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');
  const busy = sending || cooldownLeft > 0;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !sending) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sending, onClose]);

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
    onEmailsChange([...emails, email]);
    setInput('');
    setInputError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail(input);
    }
    if (e.key === 'Backspace' && !input && emails.length > 0) {
      onEmailsChange(emails.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const parts = parseEmailInput(e.clipboardData.getData('text'));
    const next = [];
    for (const email of parts) {
      if (isValidEmail(email) && !emails.includes(email) && !next.includes(email)) {
        next.push(email);
      }
    }
    if (next.length) onEmailsChange([...emails, ...next]);
    setInputError('');
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={sending ? undefined : onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-stats-email-title"
        className="bg-bg-primary border border-border rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center">
          <h3 id="meeting-stats-email-title" className="text-base font-semibold text-text-primary m-0">
            Email Meeting Stats
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-bg-secondary transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <p className="text-sm text-text-secondary m-0">
            CSV is emailed asynchronously as meeting-stats-report.csv. It is not returned in this request.
          </p>
          <MeetingStatsEmailChips
            emails={emails}
            input={input}
            inputError={inputError}
            sending={sending}
            onInput={(value) => {
              setInput(value);
              setInputError('');
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onBlur={() => {
              if (input.trim()) addEmail(input);
            }}
            onRemove={(email) => onEmailsChange(emails.filter((item) => item !== email))}
          />
          <button
            type="button"
            className="btn btn-primary inline-flex items-center gap-1.5 disabled:opacity-50"
            disabled={busy || emails.length === 0}
            onClick={() => onSend(emails)}
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            {sending ? 'Sending…' : cooldownLeft > 0 ? `Wait ${cooldownLeft}s` : 'Send report'}
          </button>
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
        </div>
      </div>
    </div>
  );
}
