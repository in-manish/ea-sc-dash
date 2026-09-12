import { getApiUrl } from '../../../config';
import { UPLOAD_ENDPOINT } from '../constants';
import { appendUploadOptions, resolveUploadMode } from '../domain/buildUploadFormData';
import { parseUploadError, parseUploadSuccess } from '../domain/parseUploadResponse';

export const fileUploadService = {
  /**
   * POST /uploads/files/
   * Default: only `file` (201 UUID upload).
   * options.keepName → keep_name=true (200).
   * options.isS3Link + options.link → replace in place (200); wins over keepName.
   */
  async uploadFile(file, token, options = {}) {
    if (!file) {
      throw new Error('Please select a file to upload.');
    }
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const resolved = resolveUploadMode(file, options);
    if (resolved.error) {
      throw new Error(resolved.error);
    }

    const formData = new FormData();
    formData.append('file', file);
    appendUploadOptions(formData, resolved);

    const response = await fetch(`${getApiUrl()}${UPLOAD_ENDPOINT}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
      body: formData,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(parseUploadError(data, response.status));
    }

    return {
      ...parseUploadSuccess(data, file, resolved),
      status: response.status,
      mode: resolved.mode,
    };
  },
};
