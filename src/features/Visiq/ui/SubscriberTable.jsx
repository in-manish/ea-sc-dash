import { ChevronRight } from 'lucide-react';
import { formatShortDate } from '../domain/formatDate';
import { subscriberRowSummary } from '../domain/subscriberRow';
import {
  subscriberStatusLabel,
  subscriberStatusTone,
} from '../domain/subscriberStatus';
import VisiqStatusBadge from './VisiqStatusBadge';

function initials(name, email) {
  const src = (name || email || '?').trim();
  if (!src) return '?';
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
  }
  return src[0].toUpperCase();
}

export default function SubscriberTable({ rows = [], loading, selectedId, onSelect }) {
  if (loading && !rows.length) {
    return <SubscriberSkeleton />;
  }

  if (!loading && !rows.length) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm font-medium text-text-primary m-0">No subscribers found</p>
        <p className="text-xs text-text-tertiary mt-1 m-0">
          Try another search, clear status filters, or run an import.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-bg-secondary/80 text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border">
            <th className="px-3 py-2 font-medium">Contact</th>
            <th className="px-3 py-2 font-medium w-[100px]">Status</th>
            <th className="px-3 py-2 font-medium">Tags</th>
            <th className="px-3 py-2 font-medium hidden md:table-cell">Context</th>
            <th className="px-3 py-2 font-medium w-[88px] hidden sm:table-cell">Updated</th>
            <th className="px-2 py-2 font-medium w-8" aria-hidden />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const summary = subscriberRowSummary(row);
            const active = selectedId != null && Number(selectedId) === Number(row.id);
            return (
              <tr
                key={row.id}
                onClick={() => onSelect?.(row.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect?.(row.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={`Open ${row.email}`}
                className={`group border-b border-border last:border-b-0 cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/40 ${
                  active
                    ? 'bg-accent/10 shadow-[inset_3px_0_0_0_var(--color-accent)]'
                    : 'hover:bg-bg-secondary/80'
                }`}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 h-8 w-8 rounded-full text-[11px] font-semibold flex items-center justify-center ${
                        active
                          ? 'bg-accent/20 text-accent'
                          : 'bg-bg-tertiary text-text-secondary'
                      }`}
                      aria-hidden
                    >
                      {initials(summary.name, row.email)}
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium text-text-primary truncate">
                        {summary.name || row.email}
                      </div>
                      <div className="text-xs text-text-tertiary truncate">
                        {summary.name ? row.email : `#${row.id}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <VisiqStatusBadge
                    size="sm"
                    label={subscriberStatusLabel(row.status)}
                    tone={subscriberStatusTone(row.status)}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <TagCell tags={summary.tags} />
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  <div className="text-xs text-text-secondary truncate max-w-[280px]" title={summary.contextLine}>
                    {summary.contextLine || (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 hidden sm:table-cell">
                  <time
                    className="text-xs text-text-tertiary tabular-nums"
                    dateTime={row.updated_at || undefined}
                    title={row.updated_at || undefined}
                  >
                    {formatShortDate(row.updated_at)}
                  </time>
                </td>
                <td className="px-2 py-2.5 text-text-tertiary">
                  <ChevronRight
                    size={16}
                    className={`transition-opacity ${active ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60'}`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TagCell({ tags }) {
  if (!tags.length) {
    return <span className="text-xs text-text-tertiary">—</span>;
  }
  const shown = tags.slice(0, 2);
  const extra = tags.length - shown.length;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {shown.map((name) => (
        <span
          key={name}
          className="text-[11px] leading-none px-1.5 py-1 rounded bg-bg-secondary text-text-secondary border border-border/80 max-w-[120px] truncate"
          title={name}
        >
          {name}
        </span>
      ))}
      {extra > 0 ? (
        <span className="text-[11px] text-text-tertiary">+{extra}</span>
      ) : null}
    </div>
  );
}

function SubscriberSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-bg-tertiary" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-40 rounded bg-bg-tertiary" />
            <div className="h-2.5 w-56 rounded bg-bg-tertiary/70" />
          </div>
          <div className="h-5 w-16 rounded bg-bg-tertiary hidden sm:block" />
        </div>
      ))}
    </div>
  );
}
