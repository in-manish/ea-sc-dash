import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { formatPermissionWindow } from '../domain/permissionWindow';
import { parseBackfillInput } from '../domain/parseBackfillInput';
import MetricTile from './MetricTile';
import PanelMessage from './PanelMessage';

const BUTTON = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50';

const PAGE = 50;
const STATUS_STYLE = {
  added: 'text-green-700',
  already_mapped: 'text-sky-700',
  skipped: 'text-text-tertiary',
  unmapped_option: 'text-amber-700',
  unknown_badge: 'text-amber-700',
  error: 'text-red-700',
};

/** Every record of a backfill run, with a status filter. Opens on demand. */
function BackfillRecords({ rows, dryRun, eventId, codes = [] }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [expanded, setExpanded] = useState(null);
  const codeById = new Map(codes.map((code) => [String(code.id), code]));

  const statuses = [...new Set(rows.map((row) => row.status))];
  const filtered = status ? rows.filter((row) => row.status === status) : rows;
  const label = (value) => value.replace('_', ' ');

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
          <ul className="m-0 p-0 list-none rounded-xl border border-border bg-bg-primary text-sm divide-y divide-border">
            {filtered.slice(0, shown).map((row, index) => (
              <li key={`${row.uuid}-${row.optionId}-${index}`} className="px-3 py-2">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <Link className="font-mono text-xs text-accent underline" title="Open this attendee"
                    to={`/event/${eventId}/attendees?${new URLSearchParams({ q: row.uuid })}`}>{row.uuid}</Link>
                  <span className="text-text-secondary">option {row.optionId || '—'}</span>
                  <span className={`font-semibold ${STATUS_STYLE[row.status] || ''}`}>
                    {row.status === 'added' && dryRun ? 'would add' : label(row.status)}
                  </span>
                  {row.permissions.length ? (
                    <button type="button" className="text-text-secondary underline"
                      aria-expanded={expanded === index}
                      onClick={() => setExpanded(expanded === index ? null : index)}>
                      {row.permissions.length} permission(s) {expanded === index ? '▴' : '▾'}
                    </button>
                  ) : null}
                  {row.message ? <span className="text-text-tertiary">{row.message}</span> : null}
                </div>
                {expanded === index ? (
                  <ul className="m-0 mt-2 p-0 list-none flex flex-col gap-1">
                    {row.permissions.map((id) => {
                      const code = codeById.get(String(id));
                      const window = code ? formatPermissionWindow(code) : '';
                      return (
                        <li key={String(id)} className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded bg-violet-500/10 px-1.5 py-0.5 font-semibold text-violet-700">{code?.code || id}</span>
                          <span className="text-text-primary">{code?.name || `Permission ${id}`}</span>
                          {window ? <span className="text-text-tertiary">{window}</span> : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
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

function Totals({ totals, dryRun }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MetricTile label={dryRun ? 'Would add' : 'Added'} value={totals.added} tone="success" />
      <MetricTile label="Already mapped" value={totals.alreadyMapped} />
      <MetricTile label="No mapping yet" value={totals.unmappedOption} hint="Kept and retried" />
      <MetricTile label="Attendee not found" value={totals.unknownBadge} hint="Kept and retried" />
      <MetricTile label="Skipped" value={totals.skipped} hint="Nothing bought" />
      <MetricTile label="Errors" value={totals.error} tone={totals.error ? 'danger' : 'default'} />
    </div>
  );
}

/** Send the attendees' purchases to EA, which adds the mapped permissions and records each one in the ledger. */
export default function ServiceBackfillSection({ eventId, codes, formValue, otm, backfill }) {
  const [fetched, setFetched] = useState(null);
  const [text, setText] = useState('');
  const [dryRun, setDryRun] = useState(true);
  const [retry, setRetry] = useState(false);
  const [inputError, setInputError] = useState('');
  const { result, running, progress } = backfill;
  const busy = running || otm.loading !== '';

  const fetchPurchases = async () => {
    setFetched(await otm.fetchPurchases(formValue));
  };
  const runFetched = () => backfill.run({ records: fetched.records, dryRun, retryPending: retry });
  const runPasted = () => {
    const { records, error } = parseBackfillInput(text);
    setInputError(error);
    if (!error) backfill.run({ records, dryRun, retryPending: retry });
  };
  const readFile = async (event) => {
    const file = event.target.files?.[0];
    if (file) setText(await file.text());
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={dryRun} onChange={(event) => setDryRun(event.target.checked)} />
          Dry run (change nothing)
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={retry} onChange={(event) => setRetry(event.target.checked)} />
          Also retry attendees that were waiting
        </label>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-secondary p-4">
        <h3 className="m-0 text-sm font-semibold text-text-primary">From SurveyJS</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={`${BUTTON} border border-border text-text-primary`}
            disabled={!formValue || busy} onClick={fetchPurchases}>
            {otm.loading === 'purchases' ? <Loader2 size={14} className="animate-spin" /> : null}
            Fetch purchases from SurveyJS
          </button>
          {fetched ? (
            <>
              <span className="text-sm text-text-secondary">
                {fetched.total} attendee(s): {fetched.records.length} with a permission, {fetched.withoutPermission} without.
              </span>
              <button type="button" className={`${BUTTON} bg-accent text-white`} disabled={busy || !fetched.records.length}
                onClick={runFetched}>
                {dryRun ? 'Check' : 'Apply'} {fetched.records.length} record(s)
              </button>
            </>
          ) : null}
        </div>
        <PanelMessage type="error" text={otm.error} onClear={otm.clearError} />
      </section>

      <section className="flex flex-col gap-2 rounded-2xl border border-border bg-bg-secondary p-4">
        <h3 className="m-0 text-sm font-semibold text-text-primary">From a file or pasted text</h3>
        <p className="m-0 text-xs text-text-tertiary">
          JSON <code>[{'{'}"uuid", "surveyjs_attendee_permission"{'}'}]</code> or a CSV with those two columns.
          An option cell can hold several ids, like 119,120.
        </p>
        <textarea className="min-h-28 rounded-lg border border-border bg-bg-primary p-3 font-mono text-xs text-text-primary"
          value={text} onChange={(event) => setText(event.target.value)} />
        <div className="flex flex-wrap items-center gap-3">
          <input type="file" accept=".json,.csv,text/csv,application/json" onChange={readFile} className="text-xs" />
          <button type="button" className={`${BUTTON} border border-border text-text-primary`} disabled={busy} onClick={runPasted}>
            {dryRun ? 'Check' : 'Apply'} these records
          </button>
        </div>
        <PanelMessage type="error" text={inputError} onClear={() => setInputError('')} />
      </section>

      {running ? (
        <p className="m-0 text-sm text-text-secondary">Sending batch {progress.done} of {progress.total}…</p>
      ) : null}
      <PanelMessage type="error" text={backfill.error} onClear={backfill.clearError} />
      {result ? (
        <div className="flex flex-col gap-3">
          <h3 className="m-0 text-sm font-semibold text-text-primary">
            {result.dryRun ? 'Dry run result (nothing was changed)' : 'Result'}
          </h3>
          <Totals totals={result.totals} dryRun={result.dryRun} />
          {result.retry ? (
            <p className="m-0 text-sm text-text-secondary">Retry: {result.retry.resolved} of {result.retry.checked} waiting row(s) resolved.</p>
          ) : null}
          {result.results.length ? <BackfillRecords rows={result.results} dryRun={result.dryRun} eventId={eventId} codes={codes} /> : null}
        </div>
      ) : null}
    </div>
  );
}
