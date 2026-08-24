import { formatCount } from '../domain/exhibitorEngagement';

function MetricCell({ label, value, hint, bordered = false }) {
  return (
    <div className={`min-w-0 px-4 first:pl-0 last:pr-0 ${bordered ? 'border-l border-border' : ''}`}>
      <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
        {label}
      </p>
      <p className="m-0 mt-1 text-2xl font-bold tabular-nums text-text-primary">{value}</p>
      {hint ? <p className="m-0 mt-1 text-xs text-text-tertiary">{hint}</p> : null}
    </div>
  );
}

/** by_type cards: Invites sent from API; Registered / Accepted placeholder N/A. */
export default function InviteTypeBreakdown({ types }) {
  if (!types?.length) return null;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {types.map((type) => (
        <article
          key={type.key}
          className="bg-bg-primary border border-border rounded-xl p-5 shadow-sm"
        >
          <h3 className="m-0 pb-4 text-base font-bold text-text-primary border-b border-border">
            {type.label} Invitations
          </h3>
          <div className="mt-4 grid grid-cols-3 gap-0">
            <MetricCell label="Invites sent" value={formatCount(type.inviteCount)} />
            <MetricCell label="Registered" value="N/A" bordered />
            <MetricCell label="Accepted" value="N/A" bordered />
          </div>
        </article>
      ))}
    </div>
  );
}
