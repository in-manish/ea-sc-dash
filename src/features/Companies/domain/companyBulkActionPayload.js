export const COMPANY_BULK_OPS = {
  LOCK: 'lock_company',
  FEATURE: 'feature_company',
};

export function isParentExhibitor(company) {
  const parent = company?.parent_exhibitor;
  if (parent?.id || (typeof parent === 'number' && parent)) return false;
  if (company?.parent_exhibitor_id) return false;
  return true;
}

export function bulkSelectionForCount(count) {
  if (count === 1) return 'single';
  if (count >= 2) return 'multiple';
  return null;
}

export function parentCompanies(companies = []) {
  return companies.filter(isParentExhibitor);
}

export function buildLockCompanyPayload({
  companyIds = [],
  locked,
  all = false,
}) {
  if (all) {
    return {
      operation_type: COMPANY_BULK_OPS.LOCK,
      selection: 'all',
      is_company_submit_locked: Boolean(locked),
    };
  }
  const ids = companyIds
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
  return {
    operation_type: COMPANY_BULK_OPS.LOCK,
    selection: bulkSelectionForCount(ids.length),
    company_ids: ids,
    is_company_submit_locked: Boolean(locked),
  };
}

export function featureRankFor(isFeatured, rank) {
  if (!isFeatured) return 0;
  const n = Number(rank);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function buildFeatureCompanyPayload(companies = []) {
  const rows = companies.map((c) => {
    const isFeatured = Boolean(c.is_featured);
    return {
      id: Number(c.id),
      is_featured: isFeatured,
      featured_rank: featureRankFor(isFeatured, c.featured_rank),
    };
  });
  return {
    operation_type: COMPANY_BULK_OPS.FEATURE,
    selection: bulkSelectionForCount(rows.length),
    companies: rows,
  };
}

export function lockSuccessMessage(data, locked) {
  const n = data?.updated_count ?? 0;
  const verb = locked ? 'Locked' : 'Unlocked';
  return `${verb} ${n} parent exhibitor${n === 1 ? '' : 's'}.`;
}

export function featureSuccessMessage(data) {
  const n = data?.updated_count ?? 0;
  return `Updated featured status for ${n} compan${n === 1 ? 'y' : 'ies'}.`;
}
