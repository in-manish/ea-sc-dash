import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { parseBackfillInput } from '../domain/parseBackfillInput';
import BackfillRecords from './BackfillRecords';
import MetricTile from './MetricTile';
import PurchaseFetchProgress from './PurchaseFetchProgress';
import PanelMessage from './PanelMessage';

const BUTTON = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50';

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
export default function ServiceBackfillSection({ eventId, codes, formValue, extraQuery, otm, backfill }) {
  const [fetched, setFetched] = useState(null);
  const [text, setText] = useState('');
  const [dryRun, setDryRun] = useState(true);
  const [retry, setRetry] = useState(false);
  const [inputError, setInputError] = useState('');
  const { result, running, progress } = backfill;
  const busy = running || otm.loading !== '';

  const fetchPurchases = async () => {
    setFetched(await otm.fetchPurchases(formValue, extraQuery));
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
          {otm.loading === 'purchases' ? <PurchaseFetchProgress progress={otm.purchaseProgress} /> : null}
          {otm.loading !== 'purchases' && fetched ? (
            <>
              <span className="text-sm text-text-secondary">
                {fetched.total} attendee(s){fetched.pages > 1 ? ` from ${fetched.pages} pages` : ''}: {fetched.records.length} with a permission, {fetched.withoutPermission} without.
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
