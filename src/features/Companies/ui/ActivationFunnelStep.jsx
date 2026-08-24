import { formatCount } from '../domain/exhibitorEngagement';

export default function ActivationFunnelStep({ step, totalExhibitors }) {
  const fill = Math.max(0, Math.min(100, step.percentage));
  const labelInFill = fill >= 22;
  const ratio = `${formatCount(step.count)}/${formatCount(totalExhibitors)}`;

  return (
    <article className="min-w-0 flex flex-col">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
        Step {step.step}
      </p>
      <h3 className="m-0 mt-1 text-base font-bold text-text-primary leading-snug">
        {step.label}
      </h3>
      <p className="m-0 mt-3">
        <span className="text-2xl font-bold tabular-nums text-text-primary">{ratio}</span>
        <span className="ml-1.5 text-sm text-text-secondary">
          {step.count === 1 ? 'exhibitor' : 'exhibitors'}
        </span>
      </p>

      <div
        className="relative mt-4 h-44 rounded-xl border border-border bg-bg-secondary overflow-hidden"
        role="meter"
        aria-valuenow={fill}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${step.label}: ${ratio} ${step.count === 1 ? 'exhibitor' : 'exhibitors'}, ${fill}%`}
      >
        <div
          className="absolute inset-x-0 bottom-0 bg-accent transition-all duration-700 ease-out flex items-center justify-center"
          style={{ height: `${fill}%` }}
        >
          {labelInFill && (
            <span className="text-sm font-bold text-white tabular-nums">{fill}%</span>
          )}
        </div>
        {!labelInFill && (
          <span className="absolute inset-x-0 top-3 text-center text-sm font-bold text-accent tabular-nums">
            {fill}%
          </span>
        )}
      </div>
    </article>
  );
}
