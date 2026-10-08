import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPermissionWindow } from '../domain/permissionWindow';

const PAGE = 50;
const STATUS_STYLE = {
  added: 'text-green-700',
  already_mapped: 'text-sky-700',
  skipped: 'text-text-tertiary',
  unmapped_option: 'text-amber-700',
  unknown_badge: 'text-amber-700',
  error: 'text-red-700',
};

const label = (value) => String(value ?? '').replace(/_/g, ' ').trim();

function permissionLine(item, codeById) {
  const objectItem = item && typeof item === 'object';
  const id = objectItem ? item.id ?? item.permission_id : item;
  const known = objectItem ? item : codeById.get(String(id));
  const window = !objectItem && known ? formatPermissionWindow(known) : '';
  return {
    chip: String(known?.code || id || '—'),
    name: String(known?.name || (id != null && !objectItem ? `Permission ${id}` : '')),
    window,
  };
}

/** Every record of a backfill run, with a status filter. Opens on demand. */
export default function BackfillRecords({ rows, dryRun, eventId, codes = [] }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [expanded, setExpanded] = useState(null);
  const codeById = new Map((Array.isArray(codes) ? codes : []).map((code) => [String(code.id), code]));

  const statuses = [...new Set(rows.map((row) => row.status).filter((value) => typeof value === 'string' && value))];
  const filtered = status ? rows.filter((row) => row.status === status) : rows;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-text-primary"
          onClick={() => setOpen((value) => !value)}>
          {open ? 'Hide' : 'Show'} the {rows.length} record(s)
        </button>
        {open ? (
          <select className="rounded-lg border border-border bg-bg-primary px-2 py-1.5 text-sm text-text-primary"
            value={status} onChange={(event) => { setStatus(event.target.value); setShown(PAGE); }}>
            <option value="">All statuses</option>
            {statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        ) : null}
      </div>
      {open ? (
        <>
          <ul className="m-0 max-h-96 overflow-y-auto p-0 list-none rounded-xl border border-border bg-bg-primary text-sm divide-y divide-border">
            {filtered.slice(0, shown).map((row, index) => {
              const permissions = Array.isArray(row.permissions) ? row.permissions : [];
              const status = typeof row.status === 'string' ? row.status : '';
              const message = typeof row.message === 'string' ? row.message : '';
              return (
                <li key={`${row.uuid}-${row.optionId}-${index}`} className="px-3 py-2">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <Link className="font-mono text-xs text-accent underline" title="Open this attendee"
                      to={`/event/${eventId}/attendees?${new URLSearchParams({ q: String(row.uuid ?? '') })}`}>{String(row.uuid ?? '—')}</Link>
                    <span className="text-text-secondary">option {row.optionId || '—'}</span>
                    <span className={`font-semibold ${STATUS_STYLE[status] || ''}`}>
                      {status === 'added' && dryRun ? 'would add' : (label(status) || '—')}
                    </span>
                    {permissions.length ? (
                      <button type="button" className="text-text-secondary underline"
                        aria-expanded={expanded === index}
                        onClick={() => setExpanded(expanded === index ? null : index)}>
                        {permissions.length} permission(s) {expanded === index ? '▴' : '▾'}
                      </button>
                    ) : null}
                    {message ? <span className="text-text-tertiary">{message}</span> : null}
                  </div>
                  {expanded === index ? (
                    <ul className="m-0 mt-2 p-0 list-none flex flex-col gap-1">
                      {permissions.map((item, permIndex) => {
                        const line = permissionLine(item, codeById);
                        return (
                          <li key={`${line.chip}-${permIndex}`} className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded bg-violet-500/10 px-1.5 py-0.5 font-semibold text-violet-700">{line.chip}</span>
                            {line.name ? <span className="text-text-primary">{line.name}</span> : null}
                            {line.window ? <span className="text-text-tertiary">{line.window}</span> : null}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {filtered.length > shown ? (
            <button type="button" className="self-start text-sm font-semibold text-text-primary underline"
              onClick={() => setShown((value) => value + PAGE)}>
              Show more ({filtered.length - shown} left)
            </button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
