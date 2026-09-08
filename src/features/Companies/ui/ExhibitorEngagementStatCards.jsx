import {
  formatCount,
  formatLoggedInPocBreakdown,
} from '../domain/exhibitorEngagement';

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-bg-primary border border-border rounded-xl px-5 py-3 shadow-sm min-w-[9.5rem]">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
        {label}
      </p>
      <p className="m-0 mt-1 text-3xl font-bold tabular-nums text-text-primary">
        {value}
      </p>
      {hint ? (
        <p className="m-0 mt-1 text-[11px] leading-snug text-text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}

export default function ExhibitorEngagementStatCards({ data }) {
  return (
    <>
      <StatCard label="Total exhibitors" value={formatCount(data.totalExhibitors)} />
      <StatCard
        label="Logged-in POCs"
        value={formatCount(data.totalLoggedInPocs)}
        hint={formatLoggedInPocBreakdown(
          data.loggedInExhibitorPocs,
          data.loggedInCoexhibitorPocs,
        )}
      />
    </>
  );
}
