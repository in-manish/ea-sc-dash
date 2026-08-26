import React, { useCallback, useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import {
  CompanyReportMetricRow,
  CompanyReportSkeletonRow,
  withUnit,
} from './CompanyReportMetricRow';

/**
 * Company metrics body (totals, handover, coupons, badges).
 * Used inside Company Report modal — no duplicate page heading.
 */
const CompanyComprehensiveReportPanel = ({
  eventId,
  token,
  parentExhibitorId: filterParentId = '',
}) => {
  const [parentExhibitorId, setParentExhibitorId] = useState(
    filterParentId ? String(filterParentId) : ''
  );
  const [appliedParentId, setAppliedParentId] = useState(
    filterParentId ? String(filterParentId) : ''
  );
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const next = filterParentId ? String(filterParentId) : '';
    setParentExhibitorId(next);
    setAppliedParentId(next);
  }, [filterParentId]);

  const fetchReport = useCallback(async (parentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getCompanyComprehensiveReport(
        eventId,
        token,
        parentId || null
      );
      setReport(data);
    } catch (err) {
      setReport(null);
      setError(err.message || 'Failed to load company report.');
    } finally {
      setHasFetched(true);
      setLoading(false);
    }
  }, [eventId, token]);

  useEffect(() => {
    fetchReport(appliedParentId);
  }, [fetchReport, appliedParentId]);

  const handleApplyParentFilter = (e) => {
    e.preventDefault();
    const trimmed = parentExhibitorId.trim();
    if (trimmed && !/^\d+$/.test(trimmed)) {
      setError('Parent exhibitor ID must be an integer.');
      return;
    }
    setAppliedParentId(trimmed);
  };

  const handleClearParentFilter = () => {
    setParentExhibitorId('');
    setAppliedParentId('');
  };

  const isScoped = Boolean(appliedParentId);

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleApplyParentFilter}
        className="flex flex-col sm:flex-row sm:items-end gap-2"
      >
        <label htmlFor="inline-report-parent-id" className="flex-1 min-w-0">
          <span className="block text-xs font-medium text-text-secondary mb-1">
            Parent exhibitor ID (optional)
          </span>
          <input
            id="inline-report-parent-id"
            type="text"
            inputMode="numeric"
            placeholder="Enter parent exhibitor ID..."
            className="w-full py-2 px-3 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
            value={parentExhibitorId}
            onChange={(e) => setParentExhibitorId(e.target.value)}
          />
        </label>
        <div className="flex gap-2 shrink-0">
          {isScoped && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleClearParentFilter}>
              Clear
            </button>
          )}
          <button type="submit" className="btn btn-secondary btn-sm" disabled={loading}>
            Apply
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => fetchReport(appliedParentId)}
            disabled={loading}
            title="Refresh"
            aria-label="Refresh report"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </form>

      {isScoped && (
        <p className="text-xs text-text-tertiary m-0">
          Showing metrics for parent exhibitor #{appliedParentId}
        </p>
      )}

      {error && (
        <div className="py-2 flex items-start gap-2 text-red-700 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !report ? (
        <div>
          {[1, 2, 3, 4, 5].map((i) => (
            <CompanyReportSkeletonRow key={i} />
          ))}
        </div>
      ) : report ? (
        <div className="relative">
          {loading && (
            <div className="absolute top-0 right-0 z-10">
              <Loader2 size={14} className="animate-spin text-accent" />
            </div>
          )}
          <div>
            <CompanyReportMetricRow
              label="Parent exhibitors"
              value={withUnit(report.parent_exhibitor_count, 'exhibitors')}
            />
            <CompanyReportMetricRow
              label="Co-exhibitors"
              value={withUnit(report.co_exhibitor_count, 'exhibitors')}
            />
            <CompanyReportMetricRow
              label="Handover"
              value={withUnit(report.handover_details?.company_count, 'companies')}
              hint={withUnit(report.handover_details?.marked_handed_over_count, 'marked handed over')}
              progressDone={report.handover_details?.company_count}
              progressTotal={report.parent_exhibitor_count}
            />
            <CompanyReportMetricRow
              label="Water coupons"
              value={withUnit(report.water_coupon?.water_coupon, 'coupons')}
              hint={withUnit(report.water_coupon?.company_count, 'companies')}
              progressDone={report.water_coupon?.company_count}
              progressTotal={report.parent_exhibitor_count}
            />
            <CompanyReportMetricRow
              label="Print badges"
              value={withUnit(report.print_badge?.print_badge_count, 'badges')}
              hint={withUnit(report.print_badge?.company_count, 'companies')}
            />
          </div>
        </div>
      ) : hasFetched ? null : (
        <p className="text-sm text-text-tertiary m-0 py-2">Loading report metrics…</p>
      )}
    </div>
  );
};

export default CompanyComprehensiveReportPanel;
