import { Link } from 'react-router-dom';
import { formatDateTime } from '../../../utils/formatDateTime';
import { LEDGER_ACTIONS, LEDGER_VIA } from '../domain/parsePermissionSources';
import PanelMessage from './PanelMessage';

const FIELD = 'rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary';
const TONE = {
  ADDED: 'bg-success/10 text-success',
  ALREADY_MAPPED: 'bg-bg-secondary text-text-secondary',
  UNMAPPED_OPTION: 'bg-accent/10 text-accent',
  UNKNOWN_BADGE: 'bg-accent/10 text-accent',
  ERROR: 'bg-danger/10 text-danger',
};
const label = (value) => value.replace(/_/g, ' ').toLowerCase();

/** Every sync of a SurveyJS option to a badge: what happened, how it arrived, and which batch. */
export default function ServiceLedgerSection({ eventId, ledger }) {
  const { filters, changeFilters, page, setPage, data, loading, error } = ledger;
  const set = (key, value) => changeFilters({ ...filters, [key]: value });
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <input className={FIELD} placeholder="Attendee uuid" value={filters.badge_uuid}
          onChange={(event) => set('badge_uuid', event.target.value.trim())} />
        <input className={FIELD} placeholder="Option id" value={filters.source_option_id}
          onChange={(event) => set('source_option_id', event.target.value.trim())} />
        <select className={FIELD} value={filters.action} onChange={(event) => set('action', event.target.value)}>
          <option value="">Any result</option>
          {LEDGER_ACTIONS.map((action) => <option key={action} value={action}>{label(action)}</option>)}
        </select>
        <select className={FIELD} value={filters.via} onChange={(event) => set('via', event.target.value)}>
          <option value="">Any source</option>
          {LEDGER_VIA.map((via) => <option key={via} value={via}>{label(via)}</option>)}
        </select>
      </div>
      <PanelMessage type="error" text={error} />
      {data ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(data.counts).map(([action, count]) => (
            <span key={action} className={`rounded-md px-2 py-1 font-semibold ${TONE[action] || ''}`}>
              {label(action)}: {count}
            </span>
          ))}
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-border bg-bg-primary">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-tertiary">
              {['Updated', 'Attendee', 'Options', 'Permissions', 'Latest', 'How', 'Batch'].map((head) => (
                <th key={head} className="px-4 py-3 font-bold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(data?.rows || []).map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0 align-top">
                <td className="px-4 py-3 whitespace-nowrap text-text-secondary">{formatDateTime(row.updatedAt)}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {row.badgeUuid ? (
                    <Link className="text-accent underline" title="Open this attendee"
                      to={`/event/${eventId}/attendees?${new URLSearchParams({ q: row.badgeUuid })}`}>{row.badgeUuid}</Link>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <ul className="m-0 p-0 list-none flex flex-col gap-1.5">
                    {row.entries.map((entry, index) => (
                      <li key={`${entry.optionId}-${index}`}>
                        <span className="font-mono text-xs">#{entry.optionId || '—'}</span>
                        <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${TONE[entry.action] || ''}`}>
                          {label(entry.action)}
                        </span>
                        {entry.resolved ? <span className="ml-1 text-[11px] text-green-700">resolved</span> : null}
                        {entry.optionTitle ? <span className="block text-xs text-text-tertiary">{entry.optionTitle}</span> : null}
                        {entry.reason ? <span className="block text-xs text-text-tertiary">{label(entry.reason)}</span> : null}
                        {entry.error ? <span className="block text-xs text-red-700">{entry.error}</span> : null}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  {row.permissions.length ? (
                    <ul className="m-0 p-0 list-none flex flex-col gap-1">
                      {row.permissions.map((item) => (
                        <li key={item.id ?? item.code}>
                          <span className="mr-1.5 rounded bg-violet-500/10 px-1.5 py-0.5 text-xs font-semibold text-violet-700">{item.code}</span>
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-1 text-[11px] font-semibold uppercase ${TONE[row.action] || ''}`}>
                    {label(row.action)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">{label(row.via)}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-text-tertiary" title={row.batchId}>{row.batchId.slice(0, 8)}</td>
              </tr>
            ))}
            {data && data.rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-text-secondary">No ledger rows yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>{loading ? 'Loading…' : `${data?.total ?? 0} row(s)`}</span>
        <div className="flex items-center gap-3">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)} className="font-semibold disabled:opacity-40">Previous</button>
          <span>Page {page} of {pages}</span>
          <button type="button" disabled={page >= pages || loading} onClick={() => setPage(page + 1)} className="font-semibold disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
