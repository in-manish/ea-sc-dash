import { parseHandoverDetails } from './parseHandoverDetails';

/**
 * Handover is "done" only when a signature exists — the same rule as
 * GET /events/:id/company/comprehensive-report/ (handover_details.company_count).
 */
export function buildHandoverRows(companies) {
  return (companies || [])
    .map((company) => {
      const details = parseHandoverDetails(company.handover_details);
      if (!details?.signature) return null;
      return {
        id: company.id,
        companyName: String(company.company_name || '').trim(),
        obfNumber: String(company.obf_number || '').trim(),
        stallNumber: String(company.stall_number || '').trim(),
        isCoExhibitor: Boolean(company.parent_exhibitor),
        allBadgesHandedOver: Boolean(company.all_badges_handed_over),
        name: details.name,
        designation: details.designation,
        phone: details.phone_number,
        signature: details.signature,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.companyName.localeCompare(b.companyName, undefined, { sensitivity: 'base' }));
}

/** Case-insensitive match on company, OBF, stall, handover person, designation, phone. */
export function filterHandoverRows(rows, query) {
  const needle = String(query || '').trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) =>
    [row.companyName, row.obfNumber, row.stallNumber, row.name, row.designation, row.phone]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  );
}
