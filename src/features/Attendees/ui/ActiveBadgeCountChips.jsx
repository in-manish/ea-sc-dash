import { STATUS_LABEL } from '../domain/summarizeActiveBadge';

const CHIP = {
  eligible: 'bg-accent/10 text-accent border-accent/30',
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  created: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  already_active: 'bg-bg-secondary text-text-secondary border-border',
  skipped: 'bg-amber-50 text-amber-800 border-amber-200',
  failed: 'bg-red-50 text-red-800 border-red-200',
  sync: 'bg-sky-50 text-sky-800 border-sky-200',
  missing: 'bg-bg-secondary text-text-tertiary border-border',
};

function Chip({ tone, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${CHIP[tone] || CHIP.missing}`}
    >
      {children}
    </span>
  );
}

const ActiveBadgeCountChips = ({ kind, result }) => {
  if (!result) return null;

  if (kind === 'status') {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {result.allWithoutActive ? (
          <Chip tone="eligible">{result.eligible.length} eligible</Chip>
        ) : (
          <>
            <Chip tone="active">{result.active.length} already active</Chip>
            <Chip tone="eligible">{result.eligible.length} can create</Chip>
            {result.noContact?.length > 0 && (
              <Chip tone="skipped">{result.noContact.length} no contact</Chip>
            )}
          </>
        )}
        {result.needsSync?.length > 0 && (
          <Chip tone="sync">{result.needsSync.length} need SnapCard sync</Chip>
        )}
        {result.missingIds?.length + result.missingUuids?.length > 0 && (
          <Chip tone="missing">
            {result.missingIds.length + result.missingUuids.length} not found
          </Chip>
        )}
      </div>
    );
  }

  const counts = result.counts || {};
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {Object.entries(STATUS_LABEL).map(([key, label]) =>
        counts[key] ? (
          <Chip key={key} tone={key}>
            {counts[key]} {label.toLowerCase()}
          </Chip>
        ) : null,
      )}
      {result.missingIds?.length + result.missingUuids?.length > 0 && (
        <Chip tone="missing">
          {result.missingIds.length + result.missingUuids.length} not found
        </Chip>
      )}
    </div>
  );
};

export default ActiveBadgeCountChips;
