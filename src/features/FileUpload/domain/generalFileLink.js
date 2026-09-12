import { CONTENT_GROUPS } from '../constants';

const GROUP_PATTERN = CONTENT_GROUPS.map((g) => g.replace('-', '\\-')).join('|');
const GENERAL_FILE_PATH = new RegExp(
  `\\/([^/]+)\\/general\\/(${GROUP_PATTERN})\\/([^/]+)\\/?$`
);

/**
 * Tenant general-file URL: {schema}/general/{images|media-content|files}/{filename}.
 * Does not require a global /api prefix; extra path segments before schema are allowed.
 */
export function parseGeneralFileLink(value) {
  if (!value || typeof value !== 'string') return null;

  let pathname;
  try {
    pathname = new URL(value).pathname;
  } catch {
    return null;
  }

  const match = pathname.match(GENERAL_FILE_PATH);
  if (!match) return null;

  let filename = match[3];
  try {
    filename = decodeURIComponent(filename);
  } catch {
    return null;
  }

  if (!filename || filename.includes('/') || filename.includes('\\')) return null;

  return {
    schema: match[1],
    contentGroup: match[2],
    filename,
  };
}

export function isGeneralFileLink(value) {
  return Boolean(parseGeneralFileLink(value));
}
