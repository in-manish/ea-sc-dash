import { barFillWidth, formatCount, isWeakestStep } from '../domain/exhibitorEngagement';

export default function ActivationFunnelChart({ steps, totalExhibitors }) {
  return (
    <ul className="m-0 p-0 list-none space-y-5">
      {steps.map((step) => {
        const fill = Math.max(0, Math.min(100, step.percentage));
        const isWeakest = isWeakestStep(step, steps);

        return (
          <li key={step.key}>
            <div className="flex items-end justify-between gap-4 mb-1.5">
              <div className="min-w-0">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Step {step.step}
                </p>
                <h3 className="m-0 text-sm font-semibold text-text-primary">{step.label}</h3>
              </div>
              <p className="m-0 shrink-0 text-right">
                <span className="text-base font-bold tabular-nums text-text-primary">{fill}%</span>
                <span className="ml-2 text-xs text-text-secondary tabular-nums">
                  {formatCount(step.count)} / {formatCount(totalExhibitors)}
                </span>
              </p>
            </div>
            <div
              className="h-3.5 rounded-full bg-bg-tertiary overflow-hidden"
              role="meter"
              aria-valuenow={fill}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${step.label}: ${fill}% of exhibitors`}
            >
              <div
                className={`h-full rounded-full ${isWeakest ? 'bg-rose-500' : 'bg-accent'} transition-all duration-700`}
                style={barFillWidth(fill)}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
