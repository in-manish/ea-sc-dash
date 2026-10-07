import { parseApiError } from '../domain/parseApiError';

export async function readApiError(response, options) {
  const result = await response.json().catch(() => ({}));
  const parsed = parseApiError(result, response.status, options);
  const error = new Error(parsed.message);
  error.status = response.status;
  error.fields = parsed.fields;
  throw error;
}
