/** Build Create Attendee shared-field prefill from a company detail object. */
export function buildAttendeePrefillFromCompany(company) {
  if (!company) return null;

  return {
    company: company.company_name || '',
    exhibitor_id: company.id != null ? String(company.id) : '',
    company_address: company.address || '',
    city: company.city || '',
    state: company.state || '',
    country: (company.location || company.country || '').trim(),
    website: company.website || '',
    attendee_type: 'Exhibitor',
    is_matchable: true,
  };
}
