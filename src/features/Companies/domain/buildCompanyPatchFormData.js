import { COMPANY_KINDS } from './companyFormDefaults';

function linkFromForm(form) {
  return {
    facebook: form.facebook || '',
    instagram: form.instagram || '',
    twitter: form.twitter || '',
    linkedin: form.linkedin || '',
  };
}

function appendIfChanged(data, key, current, original) {
  const cur = current ?? '';
  const orig = original ?? '';
  if (String(cur).trim() !== String(orig).trim()) {
    data.append(key, String(cur).trim());
  }
}

/** Build multipart FormData for PATCH — only changed fields + required company_name. */
export function buildCompanyPatchFormData(form, initial) {
  const data = new FormData();
  data.append('company_name', (form.company_name || '').trim());

  // category + product are display-only on edit — never PATCH them
  const scalars = [
    'company_detail',
    'website',
    'address',
    'location',
    'stall_number',
    'obf_number',
    'sales_person',
  ];
  scalars.forEach((key) => appendIfChanged(data, key, form[key], initial[key]));

  if (form.kind === COMPANY_KINDS.CO_EXHIBITOR) {
    appendIfChanged(data, 'parent_exhibitor', form.parent_exhibitor, initial.parent_exhibitor);
  }

  ['space', 'badge_limit', 'meeting_diary_limit'].forEach((key) => {
    const cur = String(form[key] ?? '').trim();
    const orig = String(initial[key] ?? '').trim();
    if (cur !== orig && (cur !== '' || orig !== '')) {
      data.append(key, cur);
    }
  });

  if (form.is_badge_printed !== initial.is_badge_printed) {
    data.append('is_badge_printed', form.is_badge_printed ? 'true' : 'false');
  }
  if (form.is_payment_made !== initial.is_payment_made) {
    data.append('is_payment_made', form.is_payment_made ? 'true' : 'false');
  }

  const curLink = linkFromForm(form);
  const origLink = linkFromForm(initial);
  if (JSON.stringify(curLink) !== JSON.stringify(origLink)) {
    data.append('link', JSON.stringify(curLink));
  }

  if (form.removeLogo) {
    data.append('company_logo', '');
  } else if (form.company_logo instanceof File) {
    data.append('company_logo', form.company_logo);
  }

  return data;
}
