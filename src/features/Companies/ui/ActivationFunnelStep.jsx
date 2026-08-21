import {
  formatCount,
  formatExhibitorCount,
} from '../domain/exhibitorEngagement';

export default function ActivationFunnelStep({
  step,
  totalExhibitors,
  isWeakest = false,
}) {
  const fill = Math.max(0, Math.min(100, step.percentage));

  return (
    <article
      className={`rounded-xl border p-4 flex flex-col gap-3 ${
        isWeakest ? 'border-rose-200 bg-rose-50/60' : 'border-border bg-bg-primary'
      }`}
    >
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
        Step {step.step}
        {isWeakest && (
          <span className="ml-2 normal-case tracking-normal font-medium text-rose-600">
            Lowest
          </span>
        )}
      </p>
      <h3 className="m-0 text-sm font-bold text-text-primary leading-snug">{step.label}</h3>
      <p className="m-0">
        <span className="text-3xl font-bold tabular-nums text-text-primary">{fill}%</span>
      </p>
      <p className="m-0 text-sm text-text-secondary">
        {formatExhibitorCount(step.count)}
        <span className="text-text-tertiary">
          {' '}
          of {formatCount(totalExhibitors)}
        </span>
      </p>
    </article>
  );
}
