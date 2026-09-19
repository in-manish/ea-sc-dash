import { formatCount, formatLoggedInPocBreakdown } from '../domain/exhibitorEngagement';

export default function LoggedInPocsCard({
  loggedInPocs,
  loggedInExhibitorPocs,
  loggedInCoexhibitorPocs,
  totalExhibitors,
}) {
  const fill = totalExhibitors
    ? Math.max(0, Math.min(100, Math.round((loggedInPocs * 100) / totalExhibitors)))
    : 0;
  const labelInFill = fill >= 22;

  return (
    <article className="min-w-0 flex flex-col">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
        POC Activity
      </p>
      <h3 className="m-0 mt-1 text-base font-bold text-text-primary leading-snug">
        Logged In
      </h3>
      <p className="m-0 mt-3">
        <span className="text-2xl font-bold tabular-nums text-text-primary">
          {formatCount(loggedInPocs)}
        </span>
        <span className="ml-1.5 text-sm text-text-secondary">
          {loggedInPocs === 1 ? 'POC' : 'POCs'}
        </span>
      </p>
      <p className="m-0 mt-1 text-xs leading-snug text-text-tertiary">
        {formatLoggedInPocBreakdown(loggedInExhibitorPocs, loggedInCoexhibitorPocs)}
      </p>

      <div
        className="relative mt-auto h-44 rounded-xl border border-border bg-bg-secondary overflow-hidden"
        role="meter"
        aria-valuenow={fill}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`POCs logged in: ${formatCount(loggedInPocs)} of ${formatCount(totalExhibitors)} exhibitors, ${fill}%`}
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
