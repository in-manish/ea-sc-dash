import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { parseSourceOptionsInput } from '../domain/parseSourceOptionsInput';
import PanelMessage from './PanelMessage';

const BUTTON = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50';

/** Bring the SurveyJS options into EA: fetch them from SurveyJS, or paste or upload JSON. */
export default function ServiceOptionsImport({ formValue, extraQuery, otm, saving, onPush }) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState('');
  const [problems, setProblems] = useState([]);
  const [inputError, setInputError] = useState('');

  const finish = (result) => setProblems(result?.errors || []);

  const fetchAndPush = async () => {
    setInfo('');
    setInputError('');
    const fetched = await otm.fetchOptions(formValue, extraQuery);
    if (!fetched) return;
    if (fetched.options.length === 0) {
      setInfo(`No choice with a badge permission was found${fetched.questionName ? ` in "${fetched.questionName}"` : ''}.`);
      return;
    }
    finish(await onPush(fetched.options));
    setInfo(`Fetched ${fetched.options.length} option(s)${fetched.skipped ? `, ${fetched.skipped} choice(s) had no permission and were skipped` : ''}.`);
  };

  const pushPasted = async () => {
    const { options, error } = parseSourceOptionsInput(text);
    setInputError(error);
    setInfo('');
    if (!error) finish(await onPush(options));
  };

  const readFile = async (event) => {
    const file = event.target.files?.[0];
    if (file) setText(await file.text());
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-bg-secondary p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={`${BUTTON} bg-accent text-white`} disabled={!formValue || otm.loading !== '' || saving}
          onClick={fetchAndPush}>
          {otm.loading === 'options' ? <Loader2 size={14} className="animate-spin" /> : null}
          Fetch options from SurveyJS
        </button>
        <button type="button" className="text-sm font-semibold text-text-secondary hover:text-text-primary"
          onClick={() => setOpen((value) => !value)}>
          {open ? 'Hide' : 'Paste or upload JSON instead'}
        </button>
        {info ? <span className="text-sm text-text-secondary">{info}</span> : null}
      </div>
      <PanelMessage type="error" text={otm.error} onClear={otm.clearError} />
      <PanelMessage type="error" text={inputError} onClear={() => setInputError('')} />
      {problems.length ? (
        <PanelMessage type="error" onClear={() => setProblems([])}
          text={problems.map((row) => `${row.id}: ${row.field} - ${row.message}`).join('\n')} />
      ) : null}
      {open ? (
        <div className="flex flex-col gap-2">
          <textarea className="min-h-36 rounded-lg border border-border bg-bg-primary p-3 font-mono text-xs text-text-primary"
            value={text} onChange={(event) => setText(event.target.value)}
            placeholder='[{"id": "119", "price": "20", "title": "Season Entry", "date": "2026-10-27", "start_time": "12:30 PM", "end_time": "02:00 PM"}]' />
          <div className="flex flex-wrap items-center gap-3">
            <input type="file" accept="application/json,.json" onChange={readFile} className="text-xs" />
            <button type="button" className={`${BUTTON} border border-border text-text-primary`} disabled={saving} onClick={pushPasted}>
              Save these options
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
