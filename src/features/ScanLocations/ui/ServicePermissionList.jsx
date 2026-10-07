import { Check } from 'lucide-react';
import { describeReasons } from '../domain/parsePermissionSources';
import { LEVEL_STYLE, matchPermission } from '../domain/serviceOptionMatch';
import { serviceOptionWhen } from '../domain/serviceOptionWhen';
import { formatDateRange, formatTimeRange } from '../domain/permissionWindow';
import CopyTitleButton from './CopyTitleButton';
import TimingChips from './TimingChips';

/**
 * Right side: the event's permissions as a plain list to tick for the option picked on the left. A "Suggested"
 * tag by date and time is only a hint; nothing is ticked for you.
 */
export default function ServicePermissionList({ option, codes, codesReady, chosen, changed, saving, onToggle, onSave, onUndo }) {
  const hints = new Map((option?.recommended || []).map((row) => [row.permission.id, row]));
  return (
    <section className="rounded-2xl border border-border bg-bg-primary flex flex-col min-w-0 lg:sticky lg:top-3 self-start">
      <header className={`border-b px-4 py-3 ${option ? 'border-violet-300 bg-violet-50 rounded-t-2xl' : 'border-border'}`}>
        <h3 className="m-0 text-sm font-semibold text-text-primary">EA permissions ({codes.length})</h3>
        {option ? (
          <span className="mt-1 inline-flex items-center rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Mapping this option
          </span>
        ) : null}
        <p className="m-0 mt-0.5 text-xs text-text-tertiary">
          {option ? <>Tick what <span className="select-text font-semibold text-text-primary">{option.title}</span> grants · {serviceOptionWhen(option)}
            <span className="ml-2 inline-block align-middle"><CopyTitleButton text={option.title} label="Copy the selected option title" /></span></>
            : 'Pick a SurveyJS option on the left first.'}
        </p>
      </header>
      {!codesReady ? <p className="m-0 p-4 text-sm text-text-secondary">Loading permissions…</p> : null}
      {codesReady && codes.length === 0 ? (
        <p className="m-0 p-4 text-sm text-text-secondary">This event has no permission codes yet. Add them on the Permission codes tab.</p>
      ) : null}
      <ul className="m-0 p-2 list-none flex flex-col gap-1.5 max-h-[30rem] overflow-y-auto">
        {codes.map((code) => {
          const ticked = chosen.includes(code.id);
          const hint = hints.get(code.id);
          const fit = option ? matchPermission(option, code) : null;
          return (
            <li key={code.id}>
              <label data-permission-row={code.id} className={`flex items-start gap-3 rounded-xl border p-3 ${option ? 'cursor-pointer' : 'opacity-60'} border-l-4 ${
                fit ? LEVEL_STYLE[fit.level].bar : 'border-l-border'} ${ticked ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500' : 'border-border'}`}>
                <input type="checkbox" className="mt-1 h-4 w-4 accent-violet-600" checked={ticked} disabled={!option}
                  onChange={() => onToggle(code.id)} />
                <span className="min-w-0 flex-1">
                  <span className="text-sm">
                    <span className="font-mono font-semibold text-accent">{code.code}</span>
                    <span className="ml-2 font-medium text-text-primary">{code.name}</span>
                    {ticked ? (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        <Check size={11} aria-hidden="true" /> Selected
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1.5 block">
                    <TimingChips dateText={formatDateRange(code)} timeText={formatTimeRange(code)}
                      dateState={fit?.dateState} timeState={fit?.timeState} />
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  {fit ? (
                    <span title={fit.detail}
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase ${LEVEL_STYLE[fit.level].chip}`}>
                      {fit.label}
                    </span>
                  ) : null}
                  {hint ? (
                    <span className="rounded-md border border-dashed border-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-accent"
                      title={describeReasons(hint.reasons)}>Suggested</span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {option && changed ? (
        <footer className="flex items-center gap-3 border-t border-border px-4 py-3">
          <button type="button" disabled={saving} onClick={onSave}
            className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50">Save mapping</button>
          <button type="button" disabled={saving} onClick={onUndo}
            className="text-sm font-semibold text-text-secondary hover:text-text-primary">Undo</button>
        </footer>
      ) : null}
    </section>
  );
}
