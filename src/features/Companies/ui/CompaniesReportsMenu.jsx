import { useEffect, useRef, useState } from 'react';
import { ChevronDown, FileSpreadsheet, BarChart3 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import ExhibitorReportModal from './ExhibitorReportModal';
import CompanyReportModal from './CompanyReportModal';

/**
 * Page-header Reports menu: company metrics + CSV email/download.
 */
export default function CompaniesReportsMenu({
  eventId,
  token,
  companies = [],
  selectedIds = new Set(),
  parentExhibitorId = '',
}) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [metricsOpen, setMetricsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const pick = (openFn) => {
    setMenuOpen(false);
    openFn(true);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="btn btn-secondary"
        disabled={!eventId || !token}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        title="Company report and exhibitor CSV"
      >
        <FileSpreadsheet size={16} style={{ marginRight: '0.5rem' }} />
        Reports
        <ChevronDown size={14} className="ml-1 text-text-tertiary" />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute z-40 mt-1.5 right-0 w-[260px] bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
        >
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-sm rounded-md hover:bg-bg-secondary text-text-primary"
            onClick={() => pick(setMetricsOpen)}
          >
            <BarChart3 size={14} className="mt-0.5 shrink-0 text-text-secondary" />
            <span>
              <span className="block font-medium">Company Report</span>
              <span className="block mt-0.5 text-[11px] text-text-tertiary">
                Totals, handover, water coupons, print badges
              </span>
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-sm rounded-md hover:bg-bg-secondary text-text-primary"
            onClick={() => pick(setCsvOpen)}
          >
            <FileSpreadsheet size={14} className="mt-0.5 shrink-0 text-text-secondary" />
            <span>
              <span className="block font-medium">Email / download CSV</span>
              <span className="block mt-0.5 text-[11px] text-text-tertiary">
                Parent exhibitor spreadsheet
              </span>
            </span>
          </button>
        </div>
      )}

      {metricsOpen && (
        <CompanyReportModal
          eventId={eventId}
          token={token}
          parentExhibitorId={parentExhibitorId}
          onClose={() => setMetricsOpen(false)}
        />
      )}
      {csvOpen && (
        <ExhibitorReportModal
          eventId={eventId}
          token={token}
          companies={companies}
          selectedIds={selectedIds}
          onUnauthorized={logout}
          onClose={() => setCsvOpen(false)}
        />
      )}
    </div>
  );
}
