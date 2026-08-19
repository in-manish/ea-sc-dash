/** Comma-separated parent company IDs. Empty → omit company_ids. */
export function joinCompanyIds(ids) {
  if (!ids?.length) return '';
  const cleaned = [...ids]
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
  return cleaned.length ? cleaned.join(',') : '';
}

/** Comma-separated emails for send_to_emails. Never send empty. */
export function joinSendToEmails(emails) {
  if (!emails?.length) return '';
  const cleaned = [...emails].map((email) => String(email).trim()).filter(Boolean);
  return cleaned.length ? cleaned.join(',') : '';
}

export function parseEmailInput(value) {
  return String(value || '')
    .split(/[\s,;]+/)
    .map((email) => email.trim())
    .filter(Boolean);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function buildExhibitorReportQuery({ companyIds, emails } = {}) {
  const params = new URLSearchParams();
  const ids = joinCompanyIds(companyIds);
  if (ids) params.set('company_ids', ids);
  const sendTo = joinSendToEmails(emails);
  if (sendTo) params.set('send_to_emails', sendTo);
  return params.toString();
}

const STORAGE_KEY = 'exhibitor_report_emails';

export function loadPersistedEmails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((e) => typeof e === 'string' && e);
    if (typeof parsed === 'string' && parsed.trim()) {
      return parsed.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

export function persistEmails(emails) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  } catch { /* quota exceeded — ignore */ }
}
