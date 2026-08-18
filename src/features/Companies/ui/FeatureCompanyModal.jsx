import { useMemo, useState } from 'react';
import { Loader2, Star, X } from 'lucide-react';
import { featureRankFor } from '../domain/companyBulkActionPayload';

function toDraft(company) {
  const isFeatured = Boolean(company.is_featured);
  return {
    id: company.id,
    name: company.company_name || `#${company.id}`,
    is_featured: isFeatured,
    featured_rank: featureRankFor(isFeatured, company.featured_rank),
  };
}

export default function FeatureCompanyModal({
  companies = [],
  loading = false,
  error = '',
  onSubmit,
  onCancel,
}) {
  const [rows, setRows] = useState(() => companies.map(toDraft));
  const featuredCount = useMemo(
    () => rows.filter((r) => r.is_featured).length,
    [rows],
  );

  const updateRow = (id, patch) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch };
        if (!next.is_featured) next.featured_rank = 0;
        else if (patch.is_featured && !row.is_featured && !next.featured_rank) {
          next.featured_rank = 1;
        }
        return next;
      }),
    );
  };

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={loading ? undefined : onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-company-title"
        className="bg-bg-primary rounded-lg border border-border shadow-xl w-full max-w-[560px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex justify-between items-center gap-3">
          <h3 id="feature-company-title" className="text-base font-bold text-text-primary m-0">
            Feature / rank {rows.length} compan{rows.length === 1 ? 'y' : 'ies'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-text-tertiary hover:text-text-primary border-none bg-transparent cursor-pointer p-1 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="m-0 text-sm text-text-secondary">
            Unfeatured companies always store rank as 0. {featuredCount} featured.
          </p>
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-3 border border-border rounded-md px-3 py-2.5 bg-bg-secondary"
            >
              <label className="flex items-center gap-2 text-sm cursor-pointer min-w-0 flex-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-accent"
                  checked={row.is_featured}
                  onChange={(e) => updateRow(row.id, { is_featured: e.target.checked })}
                />
                <Star
                  size={14}
                  className={row.is_featured ? 'text-yellow-500 fill-yellow-500 shrink-0' : 'text-text-tertiary shrink-0'}
                />
                <span className="truncate font-medium text-text-primary">{row.name}</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
                Rank
                <input
                  type="number"
                  min="0"
                  className="w-16 py-1 px-2 border border-border rounded-md text-sm bg-bg-primary outline-none focus:border-accent disabled:opacity-50"
                  value={row.featured_rank}
                  disabled={!row.is_featured}
                  onChange={(e) => updateRow(row.id, { featured_rank: e.target.value })}
                />
              </label>
            </div>
          ))}
          {error && (
            <p className="m-0 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border bg-bg-secondary flex justify-end gap-2">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
            onClick={() => onSubmit(rows)}
            disabled={loading || rows.length < 1}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Save featured
          </button>
        </div>
      </div>
    </div>
  );
}
