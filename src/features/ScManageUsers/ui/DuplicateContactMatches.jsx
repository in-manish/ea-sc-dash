import { AlertCircle, Copy, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
};

/** Full-width duplicate matches — sits below contact cards, never inside a column. */
export default function DuplicateContactMatches({
  users,
  highlightField,
  onIgnore,
  onEditUser,
}) {
  const [expanded, setExpanded] = useState(false);
  if (!users?.length) return null;

  const visible = expanded ? users.slice(0, 10) : users.slice(0, 4);
  const remaining = Math.max(0, Math.min(users.length, 10) - visible.length);
  const kind = highlightField === 'email' ? 'email' : 'phone';

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-3 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-950">
              Same {kind} on {users.length} other account{users.length === 1 ? '' : 's'}
            </p>
            <p className="text-xs text-amber-800/85 leading-snug mt-0.5">
              Verifying requires typing confirmation. Or open a match below to edit that user instead.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onIgnore}
          className="text-xs font-semibold text-amber-800 hover:text-danger border-none bg-transparent cursor-pointer shrink-0"
        >
          Dismiss
        </button>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {visible.map((u) => (
          <li
            key={u.id}
            className="flex items-center gap-3 rounded-lg border border-amber-200 bg-bg-primary px-3.5 py-3 min-w-0"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">
              {getInitials(u.name)}
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-text-primary truncate" title={u.name || 'No Name'}>
                {u.name || 'No Name'}
              </p>
              <p className="text-xs text-text-secondary mt-0.5 truncate">
                #{u.id}
                {' · '}
                {kind === 'email'
                  ? u.email || '—'
                  : `+${u.country_code || '91'} ${u.phone_number || '—'}`}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <StatusBadge ok={u.is_verified_email} label="Email" />
                <StatusBadge ok={u.is_verified_phone_number} label="Phone" />
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(String(u.id))}
                  className="inline-flex items-center gap-1 text-[11px] text-text-tertiary hover:text-text-primary border-none bg-transparent cursor-pointer px-0"
                  title="Copy ID"
                >
                  <Copy size={11} /> Copy ID
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEditUser(u)}
              className="btn btn-secondary py-1.5 px-3 text-xs h-9 font-semibold shrink-0"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {(remaining > 0 || (!expanded && users.length > 4)) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-semibold text-amber-900 hover:underline border-none bg-transparent cursor-pointer"
        >
          {expanded ? 'Show less' : `Show ${remaining || users.length - 4} more`}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
        ok
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}
    >
      {ok ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
      {label}
    </span>
  );
}
