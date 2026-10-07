import { LEVEL_STYLE, matchPermission, worstLevel } from '../domain/serviceOptionMatch';
import { Check } from 'lucide-react';
import { serviceOptionDays, serviceOptionTimes } from '../domain/serviceOptionWhen';
import CopyTitleButton from './CopyTitleButton';
import TimingChips from './TimingChips';

const VIEWS = [['all', 'All'], ['open', 'Not mapped'], ['mapped', 'Mapped']];

/** Left side: the SurveyJS options. Pick one to choose its permissions on the right. Nothing is mapped here. */
export default function ServiceOptionList({ options, selectedId, edited, pendingCodes, view, onView, onSelect }) {
  const shown = options.filter((option) => view === 'all' || (view === 'mapped') === option.targets.length > 0);
  return (
    <section className="rounded-2xl border border-border bg-bg-primary flex flex-col min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h3 className="m-0 text-sm font-semibold text-text-primary">SurveyJS options ({options.length})</h3>
        <div className="flex gap-1.5">
          {VIEWS.map(([id, label]) => (
            <button key={id} type="button" onClick={() => onView(id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${view === id ? 'bg-text-primary text-bg-primary' : 'bg-bg-secondary text-text-secondary'}`}>
              {label}
            </button>
          ))}
        </div>
      </header>
      <ul className="m-0 p-2 list-none flex flex-col gap-2 max-h-[34rem] overflow-y-auto">
        {shown.map((option) => {
          const active = option.id === selectedId;
          const worst = worstLevel(option, option.targets);
          return (
            <li key={option.id}>
              <div role="button" tabIndex={0} data-option-card={option.id} onClick={() => onSelect(option.id)} aria-pressed={active}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(option.id); } }}
                className={`cursor-pointer w-full text-left rounded-xl border border-l-4 p-3 flex flex-col gap-1.5 ${
                  worst ? LEVEL_STYLE[worst].bar : 'border-l-border'} ${active ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500' : 'border-border hover:bg-bg-secondary'}`}>
                {active ? (
                  <span className="inline-flex w-fit items-center gap-1 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    <Check size={11} aria-hidden="true" /> Selected
                  </span>
                ) : null}
                <span className="flex items-start justify-between gap-3">
                  <span className="flex min-w-0 items-start gap-2">
                    <span className="select-text text-sm font-semibold text-text-primary">{option.title}</span>
                    <CopyTitleButton text={option.title} label={`Copy title of option ${option.id}`} />
                  </span>
                  {option.price ? (
                    <span className="shrink-0 rounded-md border border-violet-300 bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800"
                      title="Attendees are matched to this option by this price">
                      Price {option.price}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-md border border-border px-2 py-0.5 text-xs text-text-tertiary">No price</span>
                  )}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-text-tertiary">#{option.id}</span>
                  <TimingChips dateText={serviceOptionDays(option)} timeText={serviceOptionTimes(option)} />
                </span>
                <span className="flex flex-wrap items-center gap-1.5">
                  {option.targets.length ? (
                    <span className="text-xs font-semibold text-text-secondary">
                      Mapped with {option.targets.length === 1 ? 'EA option' : `${option.targets.length} EA options`}:
                    </span>
                  ) : (
                    <span className="rounded-md bg-bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase text-text-tertiary">Not mapped</span>
                  )}
                  {option.targets.map((permission) => {
                    const fit = matchPermission(option, permission);
                    return (
                      <span key={permission.id} title={`${permission.code} ${permission.name} · ${fit.label}. ${fit.detail}`}
                        className={`inline-flex min-w-7 justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${LEVEL_STYLE[fit.level].chip}`}>
                        {permission.code}
                      </span>
                    );
                  })}
                  {edited.includes(option.id) ? (
                    <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-800">
                      Unsaved: {(pendingCodes[option.id] || []).join(', ') || 'none'}
                    </span>
                  ) : null}
                  {option.pending > 0 ? (
                    <span className="rounded-md bg-violet-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-violet-800">{option.pending} waiting</span>
                  ) : null}
                </span>
              </div>
            </li>
          );
        })}
        {shown.length === 0 ? <li className="py-8 text-center text-sm text-text-secondary">Nothing in this view.</li> : null}
      </ul>
    </section>
  );
}
