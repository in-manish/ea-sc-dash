import { SCAN_LOCATION_PANELS } from '../domain/scanLocationPanels';

export default function ScanLocationPurpose({ panel }) {
  const active = SCAN_LOCATION_PANELS.find((item) => item.id === panel);
  if (!active) return null;

  return (
    <div className="rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-text-secondary">
      <p className="m-0 text-text-primary">{active.summary}</p>
      <p className="m-0 mt-1.5">
        <span className="font-semibold text-text-primary">Shows. </span>
        {active.shows}
      </p>
      <p className="m-0 mt-1">
        <span className="font-semibold text-text-primary">You can. </span>
        {active.actions}
      </p>
    </div>
  );
}
