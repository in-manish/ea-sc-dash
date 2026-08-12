export const COMPANY_KINDS = {
  PARENT: 'parent',
  CO_EXHIBITOR: 'co_exhibitor',
};

export function emptyCompanyForm(overrides = {}) {
  return {
    kind: COMPANY_KINDS.PARENT,
    company_name: '',
    company_detail: '',
    website: '',
    obf_number: '',
    parent_exhibitor: '',
    parent_exhibitor_label: '',
    location: '',
    category: '',
    stall_number: '',
    address: '',
    space: '',
    badge_limit: '',
    products: [],
    productsText: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    company_logo: null,
    existingLogoUrl: '',
    removeLogo: false,
    meeting_diary_limit: '',
    sales_person: '',
    is_badge_printed: false,
    is_payment_made: false,
    apply_title_case: false,
    parent_exhibitor_obf: '',
    ...overrides,
  };
}

export function validateCompanyForm(form) {
  if (!form.company_name.trim()) return 'Company name is required.';
  if (form.kind === COMPANY_KINDS.PARENT && !form.obf_number.trim()) {
    return 'OBF number is required for parent exhibitors.';
  }
  if (form.kind === COMPANY_KINDS.CO_EXHIBITOR && !form.parent_exhibitor) {
    return 'Parent exhibitor is required for co-exhibitors.';
  }
  return '';
}

export function validateEditCompanyForm(form) {
  if (!form.company_name.trim()) return 'Company name is required.';
  if (form.kind === COMPANY_KINDS.CO_EXHIBITOR && !form.parent_exhibitor) {
    return 'Parent exhibitor is required for co-exhibitors.';
  }
  return '';
}
