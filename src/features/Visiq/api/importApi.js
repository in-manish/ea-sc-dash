import { getApiUrl } from '../../../config';
import { buildImportFormData } from '../domain/buildImportFormData';
import { parseVisiqError } from '../domain/parseVisiqError';

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  throw parseVisiqError(result, response.status);
}

function authHeaders(token) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
  };
}

function normalizeImportPage(payload) {
  if (Array.isArray(payload)) {
    return { count: payload.length, results: payload, next: null, previous: null };
  }
  return {
    count: Number(payload?.count) || 0,
    results: Array.isArray(payload?.results) ? payload.results : [],
    next: payload?.next || null,
    previous: payload?.previous || null,
  };
}

/** GET /visiq/imports/?page= */
export async function listImports(token, { page = 1 } = {}) {
  const params = new URLSearchParams({ page: String(page) });
  const response = await fetch(`${getApiUrl()}/visiq/imports/?${params}`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return normalizeImportPage(await response.json());
}

/** GET /visiq/imports/:id/ */
export async function getImport(token, id) {
  const response = await fetch(`${getApiUrl()}/visiq/imports/${id}/`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return response.json();
}

/**
 * POST /visiq/imports/ (multipart) → 202 Accepted
 * fields: file, mapping, tags, dry_run
 */
export async function createImport(token, { file, mapping, tags, dryRun }) {
  const response = await fetch(`${getApiUrl()}/visiq/imports/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: buildImportFormData({ file, mapping, tags, dryRun }),
  });
  await throwIfFailed(response);
  return response.json();
}

export const importApi = {
  listImports,
  getImport,
  createImport,
};
