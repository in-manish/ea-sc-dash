import { COMPANY_REPORT_CATEGORIES, reportsInCategory } from '../domain/companyReportCatalog';
import CompanyReportBadges from './CompanyReportBadges';

/** Left column of the Reports tab: reports grouped by category. */
export default function CompanyReportList({ selectedId, onSelect }) {
  return (
    <nav className="flex flex-col gap-5" aria-label="Company reports">
      {COMPANY_REPORT_CATEGORIES.map((category) => (
        <div key={category.id} className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary px-1">
            {category.title}
          </span>
          {reportsInCategory(category.id).map((report) => {
            const active = report.id === selectedId;
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => onSelect(report.id)}
                aria-current={active ? 'true' : undefined}
                className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors cursor-pointer ${
                  active
                    ? 'border-accent bg-bg-primary shadow-sm'
                    : 'border-border bg-bg-primary hover:bg-bg-secondary'
                }`}
              >
                <span className={`block text-sm font-semibold ${active ? 'text-accent' : 'text-text-primary'}`}>
                  {report.title}
                </span>
                <span className="block mt-0.5 mb-1.5 text-xs text-text-tertiary line-clamp-2">
                  {report.summary}
                </span>
                <CompanyReportBadges delivery={report.delivery} />
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
