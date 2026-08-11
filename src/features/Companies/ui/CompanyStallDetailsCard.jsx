import { LayoutGrid } from 'lucide-react';
import {
  formatContractorEntries,
  formatContractorPoc,
  formatRequirementItem,
  stallDetailFromCompany,
} from '../domain/formatStallDetail';

/** Stall detail, water coupon, category & products — one compact card. */
export default function CompanyStallDetailsCard({ company }) {
  const stall = stallDetailFromCompany(company);
  const waterCoupon = company?.water_coupon;
  const hasWater = waterCoupon != null && waterCoupon !== '';
  const categoryLabel = String(company?.category || '').trim();
  const products = Array.isArray(company?.product)
    ? company.product.filter(Boolean)
    : [];

  const requirements = Array.isArray(stall?.additional_requirements)
    ? stall.additional_requirements.map(formatRequirementItem).filter(Boolean)
    : [];
  const contractorEntries = formatContractorEntries(stall?.contractor_details);
  const pocs = Array.isArray(stall?.contractor_pocs)
    ? stall.contractor_pocs.map(formatContractorPoc)
    : [];

  const hasStallMeta = Boolean(stall) || hasWater;
  const hasCatalog = Boolean(categoryLabel) || products.length > 0;
  if (!hasStallMeta && !hasCatalog) return null;

  return (
    <div className="bg-bg-primary border border-border rounded-lg p-4 shadow-sm mt-4">
      <h3 className="text-xs font-semibold uppercase text-text-tertiary mb-3 flex items-center gap-2 border-b border-border pb-2">
        <LayoutGrid size={16} /> Stall & catalog
      </h3>

      {hasStallMeta && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field label="Space" value={formatSpace(company.space, stall?.space_type)} />
          <Field label="Space type" value={stall?.space_type?.trim() || '—'} />
          <Field label="Fascia" value={stall?.fascia_detail?.trim() || '—'} />
          <Field label="Water coupons" value={hasWater ? String(waterCoupon) : '—'} />
        </div>
      )}

      <div className={`${hasStallMeta ? 'mt-3 pt-3 border-t border-border' : ''} space-y-2.5`}>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-text-secondary font-medium">Category</label>
          {categoryLabel ? (
            <span className="inline-flex w-fit px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-800">
              {categoryLabel}
            </span>
          ) : (
            <span className="text-sm text-text-tertiary">—</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-text-secondary font-medium">Products</label>
          {products.length === 0 ? (
            <span className="text-sm text-text-tertiary">—</span>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {products.map((name) => (
                <span
                  key={name}
                  className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-bg-secondary text-text-primary border border-border"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {requirements.length > 0 && (
        <ListBlock label="Additional requirements" items={requirements} />
      )}
      {contractorEntries.length > 0 && (
        <ListBlock
          label="Contractor details"
          items={contractorEntries.map((e) => `${e.label}: ${e.value}`)}
        />
      )}
      {pocs.length > 0 && <ListBlock label="Contractor POCs" items={pocs} />}
    </div>
  );
}

function formatSpace(space, spaceType) {
  if (space == null || space === '') {
    return spaceType?.trim() || '—';
  }
  return spaceType?.trim()
    ? `${space} sq.m (${spaceType})`
    : `${space} sq.m`;
}

function Field({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[11px] text-text-secondary font-medium">{label}</label>
      <span className="text-sm text-text-primary break-words">{value}</span>
    </div>
  );
}

function ListBlock({ label, items }) {
  return (
    <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
      <label className="text-[11px] text-text-secondary font-medium">{label}</label>
      <ul className="list-disc pl-4 space-y-0.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-text-primary break-words">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
