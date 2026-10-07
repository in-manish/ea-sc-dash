import { Link } from 'react-router-dom';
import { attendeesWithPermissionPath } from '../../Attendees/domain/attendeePermissionLink';
import MetricsFreshness from './MetricsFreshness';
import MetricTile from './MetricTile';
import PanelMessage from './PanelMessage';
import PermissionWindowLine from './PermissionWindowLine';

function UsedAt({ locations }) {
  if (locations.length === 0) return <span className="text-text-tertiary">Not required anywhere</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {locations.map((location) => (
        <span key={location.id ?? location.name} className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs">
          {location.name}
        </span>
      ))}
    </div>
  );
}

export default function HolderMetricsSection({ eventId, metrics, byType, onByType }) {
  const { data, loading, error, clearError, refresh } = metrics;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="m-0 text-base font-semibold text-text-primary">Who holds each permission</h2>
          <p className="m-0 text-xs text-text-tertiary">Badges that carry each code, and the scan locations that require it.</p>
        </div>
        <MetricsFreshness
          generatedAt={data?.generatedAt}
          cached={data?.cached}
          loading={loading}
          onRefresh={() => refresh(true)}
        />
      </div>
      <PanelMessage type="error" text={error} onClear={clearError} />
      {data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricTile label="Badges" value={data.totalBadges} />
            <MetricTile label="With a permission" value={data.withPermissions} tone="success" />
            <MetricTile label="Without any" value={data.withoutPermissions} />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-text-secondary w-fit">
            <input type="checkbox" checked={byType} onChange={(event) => onByType(event.target.checked)} />
            Break down by attendee type
          </label>
          {data.permissions.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8 border border-dashed border-border rounded-2xl m-0">
              No permission codes for this event yet.
            </p>
          ) : (
            <div className="overflow-x-auto border border-border rounded-2xl bg-bg-primary">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-tertiary">
                    <th className="px-4 py-3 font-bold">Permission</th>
                    <th className="px-4 py-3 font-bold">Badges</th>
                    <th className="px-4 py-3 font-bold">Required at</th>
                  </tr>
                </thead>
                <tbody>
                  {data.permissions.map((row) => (
                    <tr key={row.id ?? row.code} className="border-b border-border last:border-b-0 align-top">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-accent">{row.code}</span>
                        <span className="ml-2 text-text-primary">{row.name}</span>
                        <PermissionWindowLine permission={row} />
                      </td>
                      <td className="px-4 py-3 min-w-44">
                        <Link
                          to={attendeesWithPermissionPath(eventId, row.id)}
                          className="font-semibold tabular-nums text-text-primary hover:text-accent"
                        >
                          {row.badges}
                        </Link>
                        <span className="ml-1.5 text-xs text-text-tertiary tabular-nums">{row.percentage}%</span>
                        <div className="mt-1.5 h-1.5 rounded-full bg-bg-secondary overflow-hidden" aria-hidden="true">
                          <div className="h-full bg-accent" style={{ width: `${Math.min(100, row.percentage)}%` }} />
                        </div>
                        {byType && row.byAttendeeType.length > 0 ? (
                          <ul className="m-0 mt-2 p-0 list-none text-xs text-text-secondary space-y-0.5">
                            {row.byAttendeeType.map((type) => (
                              <li key={type.id ?? type.name}>{type.name}: <span className="tabular-nums">{type.badges}</span></li>
                            ))}
                          </ul>
                        ) : null}
                      </td>
                      <td className="px-4 py-3"><UsedAt locations={row.locations} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
