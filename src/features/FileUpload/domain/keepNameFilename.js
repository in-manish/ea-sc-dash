import { KEEP_NAME_MAX_LENGTH, KEEP_NAME_PATTERN } from '../constants';

/** True when the name is a valid keep_name basename (no folders). */
export function isValidKeepName(fileName) {
  if (!fileName || typeof fileName !== 'string') return false;
  if (fileName.includes('/') || fileName.includes('\\')) return false;
  if (fileName.length === 0 || fileName.length > KEEP_NAME_MAX_LENGTH) return false;
  return KEEP_NAME_PATTERN.test(fileName);
}
