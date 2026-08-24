import { EMAIL_STORAGE_KEY } from '../constants';

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function parseEmailInput(value) {
  return String(value || '')
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function loadPersistedEmails() {
  try {
    const raw = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter((e) => typeof e === 'string' && e);
    if (typeof parsed === 'string' && parsed.trim()) return parseEmailInput(parsed);
    return [];
  } catch {
    return [];
  }
}

export function persistEmails(emails) {
  try {
    localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(emails));
  } catch {
    /* quota exceeded — ignore */
  }
}
