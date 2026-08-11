import { COMPANY_KINDS } from './companyFormDefaults';

function productsFromText(text) {
  return (text || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Build multipart FormData for POST /events/:id/companies/ */
export function buildCompanyFormData(form) {
  const data = new FormData();
  const isCo = form.kind === COMPANY_KINDS.CO_EXHIBITOR;

  data.append('company_name', (form.company_name || '').trim());
  data.append('company_detail', form.company_detail ?? '');
  data.append('website', form.website ?? '');

  if (isCo) {
    data.append('parent_exhibitor', String(form.parent_exhibitor));
  } else {
    data.append('obf_number', (form.obf_number || '').trim());
  }

  const optionalScalars = ['location', 'category', 'stall_number', 'address'];
  optionalScalars.forEach((key) => {
    const value = (form[key] || '').trim();
    if (value) data.append(key, value);
  });

  if (!isCo) {
    const space = String(form.space ?? '').trim();
    if (space) data.append('space', space);
  }

  const badgeLimit = String(form.badge_limit ?? '').trim();
  if (badgeLimit) data.append('badge_limit', badgeLimit);

  const products = productsFromText(form.productsText);
  if (products.length) data.append('product', JSON.stringify(products));

  const link = {
    facebook: form.facebook || '',
    instagram: form.instagram || '',
    twitter: form.twitter || '',
    linkedin: form.linkedin || '',
  };
  if (Object.values(link).some(Boolean)) {
    data.append('link', JSON.stringify(link));
  }

  if (form.company_logo instanceof File) {
    data.append('company_logo', form.company_logo);
  }

  return data;
}
