/** Display label for company typeahead rows (name, OBF, id). */
export function formatCompanySearchLabel(company) {
  if (!company) return '';
  const name = company.company_name || '';
  const obf = (company.obf_number || '').trim();
  const id = company.id;
  const meta = [
    obf ? `OBF ${obf}` : '',
    id != null ? `#${id}` : '',
  ].filter(Boolean);
  return meta.length ? `${name} · ${meta.join(' · ')}` : name;
}
