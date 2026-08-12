/** Safe display helpers for company.stall_detail. */

export function stallDetailFromCompany(company) {
  const stall = company?.stall_detail;
  if (!stall || typeof stall !== 'object') return null;
  return stall;
}

export function formatRequirementItem(item, index) {
  if (item == null) return null;
  if (typeof item === 'string' || typeof item === 'number') {
    return String(item);
  }
  if (typeof item === 'object') {
    const name = item.name || item.title || item.product_name || item.label;
    const qty = item.quantity ?? item.qty ?? item.count;
    if (name && qty != null) return `${name} × ${qty}`;
    if (name) return String(name);
    return JSON.stringify(item);
  }
  return `Item ${index + 1}`;
}

export function formatContractorEntries(details) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) return [];
  return Object.entries(details)
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([key, value]) => ({
      label: key.replace(/_/g, ' '),
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    }));
}

export function formatContractorPoc(poc, index) {
  if (!poc || typeof poc !== 'object') {
    return poc != null ? String(poc) : `POC ${index + 1}`;
  }
  const name = poc.name || poc.contact_name || poc.poc_name || '';
  const phone = poc.phone || poc.phone_number || poc.mobile || '';
  const email = poc.email || '';
  const role = poc.designation || poc.role || '';
  const parts = [name, role, phone, email].filter(Boolean);
  return parts.length ? parts.join(' · ') : JSON.stringify(poc);
}
