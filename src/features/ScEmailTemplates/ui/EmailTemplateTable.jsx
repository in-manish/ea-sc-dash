import { ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import {
  formatAudience,
  formatEventId,
  formatFromName,
  formatTemplateDate,
} from '../domain/emailTemplateLabels';

export default function EmailTemplateTable({
  results,
  totalCount,
  pagination,
  onLimitChange,
  onPageChange,
  onSelect,
}) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(totalCount / pagination.limit) || 1;

  return (
    <div className="bg-bg-primary rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border bg-bg-secondary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-primary">Email templates</h2>
          <span className="text-xs bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded-full">
            {totalCount} total
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span>Show per page:</span>
          <select
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-bg-primary border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[20, 50, 100, 200].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary/40 text-text-tertiary text-xs font-semibold uppercase tracking-wider border-b border-border">
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Audience</th>
                <th className="py-3.5 px-6">Event</th>
                <th className="py-3.5 px-6">From name</th>
                <th className="py-3.5 px-6">Active</th>
                <th className="py-3.5 px-6">Updated</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelect(row)}
                  className="cursor-pointer border-b border-border last:border-b-0 hover:bg-bg-secondary/30 transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <div className="font-medium text-text-primary text-sm">{row.title || 'Untitled'}</div>
                    <div className="text-xs text-text-tertiary mt-0.5">#{row.id}</div>
                  </td>
                  <td className="py-3.5 px-6 text-sm text-text-secondary">{row.template_type || '—'}</td>
                  <td className="py-3.5 px-6 text-sm text-text-secondary capitalize">{formatAudience(row.audience)}</td>
                  <td className="py-3.5 px-6 text-sm text-text-secondary">{formatEventId(row.event_id)}</td>
                  <td className="py-3.5 px-6 text-sm text-text-secondary">{formatFromName(row.from_sender_name)}</td>
                  <td className="py-3.5 px-6">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      row.is_active ? 'bg-emerald-500/10 text-emerald-700' : 'bg-bg-secondary text-text-tertiary'
                    }`}>
                      {row.is_active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-xs text-text-tertiary whitespace-nowrap">
                    {formatTemplateDate(row.modified_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalCount > 0 && (
        <div className="px-6 py-3 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded-md border-none bg-transparent hover:bg-bg-secondary disabled:opacity-40 cursor-pointer"
              disabled={pagination.offset <= 0}
              onClick={() => onPageChange(Math.max(0, pagination.offset - pagination.limit))}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-md border-none bg-transparent hover:bg-bg-secondary disabled:opacity-40 cursor-pointer"
              disabled={pagination.offset + pagination.limit >= totalCount}
              onClick={() => onPageChange(pagination.offset + pagination.limit)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-16 text-center text-text-tertiary">
      <Mail size={48} className="mx-auto mb-4 text-border-hover" />
      <h3 className="font-semibold text-text-secondary mb-1">No templates found</h3>
      <p className="text-sm">Try another event, audience, or archived status.</p>
    </div>
  );
}
