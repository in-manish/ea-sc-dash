import { parseApiError } from './parseApiError';

export function parseScanLocationsError(result, status) {
  return parseApiError(result, status, {
    fallback: `Failed to load scan locations (${status})`,
    forbidden: 'You do not have access to scan locations for this event.',
  }).message;
}
