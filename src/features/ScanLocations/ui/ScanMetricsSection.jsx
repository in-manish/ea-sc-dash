import { describeScanRange } from '../domain/scanMetricsFilters';
import MetricsFreshness from './MetricsFreshness';
import MetricTile from './MetricTile';
import PanelMessage from './PanelMessage';
import PermissionWindowLine from './PermissionWindowLine';
import ScanMetricsFilters from './ScanMetricsFilters';

function Head({ children }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}

function LocationRow({ row }) {
  const open = row.withRequired == null;
  return (
    <tr className="border-b border-border last:border-b-0 align-top">
      <td className="px-4 py-3">
        <span className="text-text-primary font-medium">{row.name}</span>
        {row.deleted ? <span className="ml-2 text-[10px] font-semibold uppercase text-danger">Deleted</span> : null}
        <div className="mt-1 flex flex-wrap gap-1">
          {open ? (
            <span className="text-xs text-success">Open entry</span>
          ) : (
            row.required.map((item) => (
              <span key={item.id ?? item.code} className="rounded-full border border-border bg-bg-secondary px-2 py-0.5 text-xs">
                <span className="font-mono font-semibold text-accent">{item.code}</span> {item.name}
              </span>
            ))
          )}
        </div>
      </td>
      <td className="px-4 py-3 tabular-nums">{row.scans}</td>
      <td className="px-4 py-3 tabular-nums">{row.uniqueBadges}</td>
      <td className="px-4 py-3 tabular-nums text-success">{open ? '—' : row.withRequired}</td>
      <td className={`px-4 py-3 tabular-nums ${!open && row.withoutRequired > 0 ? 'text-danger font-semibold' : ''}`}>
        {open ? '—' : row.withoutRequired}
      </td>
      <td className="px-4 py-3 tabular-nums text-text-secondary" title="Scans of a code with no badge record, such as a walk-in.">
        {row.unmatchedScans}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {row.byPermission.length === 0 ? <span className="text-text-tertiary">—</span> : null}
          {row.byPermission.map((item) => (
            <span key={item.id ?? item.code} className="rounded-full border border-border px-2 py-0.5 text-xs tabular-nums">
              <span className="font-mono font-semibold text-accent">{item.code}</span> {item.uniqueBadges}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
}

export default function ScanMetricsSection({ metrics, filters, errors, onFilters }) {
  const { data, loading, error, clearError, refresh } = metrics;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="m-0 text-base font-semibold text-text-primary">Scans by location</h2>
          <p className="m-0 text-xs text-text-tertiary">
            {data ? `${describeScanRange(data.range)}. ` : ''}
            With and without a permission use each badge&apos;s permissions today, not when it was scanned.
          </p>
        </div>
        <MetricsFreshness generatedAt={data?.generatedAt} cached={data?.cached} loading={loading} onRefresh={() => refresh(true)} />
      </div>
      <ScanMetricsFilters filters={filters} errors={errors} onChange={onFilters} />
      <PanelMessage type="error" text={error} onClear={clearError} />
      {data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricTile label="Scans" value={data.totals.scans} />
            <MetricTile label="Unique badges" value={data.totals.uniqueBadges} />
            <MetricTile label="No badge record" value={data.totals.unmatchedScans} hint="Walk-ins and unknown codes" />
          </div>
          {data.locations.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8 border border-dashed border-border rounded-2xl m-0">
              No scan locations match these filters.
            </p>
          ) : (
            <div className="overflow-x-auto border border-border rounded-2xl bg-bg-primary">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-tertiary">
                    <Head>Location</Head><Head>Scans</Head><Head>Unique</Head><Head>With permission</Head>
                    <Head>Without</Head><Head>No badge</Head><Head>Badges holding</Head>
                  </tr>
                </thead>
                <tbody>{data.locations.map((row) => <LocationRow key={row.id} row={row} />)}</tbody>
              </table>
            </div>
          )}
          {data.permissions.length > 0 ? (
            <div className="overflow-x-auto border border-border rounded-2xl bg-bg-primary">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-[10px] uppercase tracking-wider text-text-tertiary">
                    <Head>Permission</Head><Head>Scans at its locations</Head><Head>Unique badges</Head>
                  </tr>
                </thead>
                <tbody>
                  {data.permissions.map((row) => (
                    <tr key={row.id ?? row.code} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-accent">{row.code}</span>
                        <span className="ml-2">{row.name}</span>
                        <PermissionWindowLine permission={row} />
                      </td>
                      <td className="px-4 py-3 tabular-nums">{row.scans}</td>
                      <td className="px-4 py-3 tabular-nums">{row.uniqueBadges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {filters.byDay && data.byDate.length > 0 ? (
            <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {data.byDate.map((row) => (
                <li key={row.date} className="rounded-xl border border-border bg-bg-primary px-3 py-2 text-sm flex justify-between">
                  <span>{row.date}</span>
                  <span className="tabular-nums text-text-secondary">{row.scans} scans · {row.uniqueBadges} unique</span>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
