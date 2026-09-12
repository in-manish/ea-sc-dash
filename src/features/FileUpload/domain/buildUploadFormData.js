import {
  INVALID_FILE_LINK_MSG,
  INVALID_FILE_NAME_MSG,
  LINK_REQUIRED_MSG,
} from '../constants';
import { isGeneralFileLink } from './generalFileLink';
import { isValidKeepName } from './keepNameFilename';

/**
 * Decide upload mode. is_s3_link + valid tenant link wins over keep_name.
 * Default is create (file only).
 */
export function resolveUploadMode(file, options = {}) {
  const { keepName = false, link, isS3Link = false } = options;

  if (isS3Link) {
    if (!link) return { error: LINK_REQUIRED_MSG };
    if (!isGeneralFileLink(link)) return { error: INVALID_FILE_LINK_MSG };
    return { mode: 'replace', link };
  }

  if (keepName) {
    if (!isValidKeepName(file?.name)) return { error: INVALID_FILE_NAME_MSG };
    return { mode: 'keep_name' };
  }

  return { mode: 'create' };
}

/** Append optional fields. Create mode leaves FormData as file-only. */
export function appendUploadOptions(formData, resolved) {
  if (resolved.mode === 'replace') {
    formData.append('link', resolved.link);
    formData.append('is_s3_link', 'true');
    return;
  }
  if (resolved.mode === 'keep_name') {
    formData.append('keep_name', 'true');
  }
}
