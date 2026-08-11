import { COMPANY_KINDS, emptyCompanyForm } from './companyFormDefaults';
import { formatCompanySearchLabel } from './formatCompanySearchLabel';

/** Map GET company response → form state for edit. */
export function companyToForm(company) {
  const parent = company?.parent_exhibitor;
  const isCo = Boolean(parent?.id);
  const link = company?.link || {};
  const products = Array.isArray(company?.product) ? company.product : [];

  return emptyCompanyForm({
    kind: isCo ? COMPANY_KINDS.CO_EXHIBITOR : COMPANY_KINDS.PARENT,
    company_name: company?.company_name || '',
    company_detail: company?.company_detail || '',
    website: company?.website || '',
    obf_number: company?.obf_number || '',
    parent_exhibitor: parent?.id ? String(parent.id) : '',
    parent_exhibitor_label: parent?.id
      ? formatCompanySearchLabel({
          company_name: parent.company_name,
          obf_number: parent.obf_number,
          id: parent.id,
        })
      : '',
    parent_exhibitor_obf: parent?.obf_number || '',
    location: (company?.location || company?.country || '').toLowerCase().trim(),
    category: company?.category || '',
    stall_number: company?.stall_number || '',
    address: company?.address || '',
    space: company?.space != null ? String(company.space) : '',
    badge_limit: company?.badge_limit != null ? String(company.badge_limit) : '',
    meeting_diary_limit:
      company?.meeting_diary_limit != null ? String(company.meeting_diary_limit) : '',
    sales_person: company?.sales_person || '',
    is_badge_printed: Boolean(company?.is_badge_printed),
    is_payment_made: Boolean(company?.is_payment_made),
    apply_title_case: Boolean(company?.apply_title_case),
    products,
    productsText: products.join(', '),
    facebook: link.facebook || '',
    instagram: link.instagram || '',
    twitter: link.twitter || '',
    linkedin: link.linkedin || '',
    existingLogoUrl: company?.company_logo || '',
    company_logo: null,
    removeLogo: false,
  });
}
