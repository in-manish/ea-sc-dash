import {
  Mail, Phone, MapPin, Building, ShieldCheck, ShieldAlert,
  ChevronLeft, ChevronRight, User,
} from 'lucide-react';

const initials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
};

function highlightMatch(text, searchVal) {
  if (!searchVal || !text) return text;
  const parts = String(text).split(new RegExp(`(${searchVal})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === searchVal.toLowerCase()
          ? <mark key={i} className="bg-yellow-100 text-yellow-800 px-0.5 rounded">{part}</mark>
          : part
      )}
    </span>
  );
}

function rowClass(user, enableHighlighting) {
  const base = 'cursor-pointer transition-colors';
  if (!enableHighlighting) return `${base} hover:bg-bg-secondary/30`;
  const emailOk = user.is_verified_email === true;
  const phoneOk = user.is_verified_phone_number === true;
  if (emailOk && phoneOk) return `${base} bg-emerald-500/[0.04] hover:bg-emerald-500/[0.1] border-l-4 border-l-success`;
  if (emailOk) return `${base} bg-teal-500/[0.03] hover:bg-teal-500/[0.08] border-l-4 border-l-teal-500`;
  if (phoneOk) return `${base} bg-blue-500/[0.03] hover:bg-blue-500/[0.08] border-l-4 border-l-blue-500`;
  return `${base} hover:bg-bg-secondary/30 border-l-4 border-l-transparent`;
}

export default function ManageUsersResultsTable({
  results,
  totalCount,
  filters,
  pagination,
  enableHighlighting,
  onLimitChange,
  onPageChange,
  onSelectUser,
}) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(totalCount / pagination.limit) || 1;

  return (
    <div className="bg-bg-primary rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-bg-secondary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-primary">Administrative User List</h2>
          <span className="text-xs bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded-full">{totalCount} total</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>Show per page:</span>
          <select
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-bg-primary border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[10, 20, 50, 100, 200].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="p-16 text-center text-text-tertiary">
          <User size={48} className="mx-auto mb-4 text-border-hover" />
          <h3 className="font-semibold text-text-secondary mb-1">No Users Match Criteria</h3>
          <p className="text-sm">Try broadening your search query or clearing some of the filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/40 text-text-tertiary text-xs font-semibold uppercase tracking-wider border-b border-border">
                <th className="py-3.5 px-6">User Details</th>
                <th className="py-3.5 px-6">Contact / Location</th>
                <th className="py-3.5 px-6">Organization</th>
                <th className="py-3.5 px-6">Verification</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-4 w-10" aria-label="Open" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((user) => (
                <ManageUsersResultRow
                  key={user.id}
                  user={user}
                  filters={filters}
                  enableHighlighting={enableHighlighting}
                  onSelect={() => onSelectUser(user)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border bg-bg-secondary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-text-secondary">
            Showing page <strong className="font-semibold text-text-primary">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-text-primary">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => onPageChange(pagination.offset - pagination.limit)} className="btn btn-secondary py-1.5 px-3 flex items-center gap-1 text-xs" disabled={pagination.offset === 0}>
              <ChevronLeft size={14} /> Prev
            </button>
            <button type="button" onClick={() => onPageChange(pagination.offset + pagination.limit)} className="btn btn-secondary py-1.5 px-3 flex items-center gap-1 text-xs" disabled={pagination.offset + pagination.limit >= totalCount}>
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ManageUsersResultRow({ user, filters, enableHighlighting, onSelect }) {
  const emailOk = user.is_verified_email === true;
  const phoneOk = user.is_verified_phone_number === true;
  return (
    <tr
      className={rowClass(user, enableHighlighting)}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${user.name || 'user'} details`}
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">{initials(user.name)}</div>
          <div>
            <div className="font-semibold text-text-primary text-sm">{highlightMatch(user.name || 'No Name', filters.search || filters.name)}</div>
            <div className="text-[11px] text-text-tertiary mt-0.5">User ID: #{user.id}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1 text-xs text-text-secondary">
          {user.email && <div className="flex items-center gap-1.5"><Mail size={12} className="text-text-tertiary shrink-0" /><span className="truncate max-w-[200px]">{highlightMatch(user.email, filters.search || filters.email)}</span></div>}
          {user.phone_number && <div className="flex items-center gap-1.5"><Phone size={12} className="text-text-tertiary shrink-0" /><span>{user.country_code ? `+${user.country_code} ` : ''}{highlightMatch(user.phone_number, filters.search || filters.phone_number)}</span></div>}
          {(user.city || user.state || user.country) && <div className="flex items-center gap-1.5 mt-0.5"><MapPin size={12} className="text-text-tertiary shrink-0" /><span className="text-[11px] text-text-tertiary truncate max-w-[220px]">{[user.city, user.state, user.country].filter(Boolean).join(', ')}</span></div>}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-0.5 text-xs text-text-secondary">
          {user.company ? <div className="flex items-center gap-1.5 font-medium text-text-primary"><Building size={12} className="text-text-tertiary shrink-0" /><span className="truncate max-w-[180px]">{user.company}</span></div> : <span className="text-text-tertiary italic">No Company</span>}
          {user.designation && <span className="text-[11px] text-text-secondary ml-4.5 truncate max-w-[180px]">{user.designation}</span>}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex flex-col gap-1.5 items-start">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${emailOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {emailOk ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />} Email {emailOk ? 'Verified' : 'Unverified'}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${phoneOk ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {phoneOk ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />} Phone {phoneOk ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </td>
      <td className="py-4 px-6">
        {user.role ? <span className="inline-block text-[10px] font-bold text-text-secondary bg-bg-secondary border border-border px-2 py-0.5 rounded uppercase tracking-wide">{user.role}</span> : <span className="text-text-tertiary text-xs italic">-</span>}
      </td>
      <td className="py-4 px-4 text-text-tertiary">
        <ChevronRight size={16} />
      </td>
    </tr>
  );
}
