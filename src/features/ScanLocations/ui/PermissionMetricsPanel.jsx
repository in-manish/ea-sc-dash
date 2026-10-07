import { useMemo, useState } from 'react';
import { DEFAULT_SCAN_FILTERS, scanFilterParams, validateScanFilters } from '../domain/scanMetricsFilters';
import { usePermissionHolderMetrics, usePermissionScanMetrics } from '../hooks/usePermissionMetrics';
import HolderMetricsSection from './HolderMetricsSection';
import ScanMetricsSection from './ScanMetricsSection';

export default function PermissionMetricsPanel({ eventId, token, onUnauthorized }) {
  const [byType, setByType] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_SCAN_FILTERS);
  const errors = validateScanFilters(filters);
  const params = useMemo(() => scanFilterParams(filters), [filters]);
  const holders = usePermissionHolderMetrics(eventId, token, onUnauthorized, {
    groupBy: byType ? 'attendee_type' : '',
  });
  const scans = usePermissionScanMetrics(eventId, token, onUnauthorized, {
    params,
    enabled: Object.keys(errors).length === 0,
  });

  if (holders.denied && scans.denied) {
    return (
      <p className="text-sm text-text-secondary text-center py-10 border border-dashed border-border rounded-2xl m-0">
        Only an organizer can see permission metrics.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <HolderMetricsSection eventId={eventId} metrics={holders} byType={byType} onByType={setByType} />
      <ScanMetricsSection metrics={scans} filters={filters} errors={errors} onFilters={setFilters} />
    </div>
  );
}
