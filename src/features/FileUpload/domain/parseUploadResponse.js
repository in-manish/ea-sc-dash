import { UPLOAD_FAILED_MSG } from '../constants';

export function parseUploadError(data, status) {
  const msg = data?.msg || data?.detail || data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (status === 401 || status === 403) return 'Authentication failed.';
  if (status === 400) return 'File upload failed.';
  return UPLOAD_FAILED_MSG;
}

const extractFirstUrl = (value) => {
  if (!value) return null;

  if (typeof value === 'string') {
    return /^https?:\/\//i.test(value) ? value : null;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const url = extractFirstUrl(item);
      if (url) return url;
    }
    return null;
  }

  if (typeof value === 'object') {
    const preferredKeys = ['url', 'file_url', 's3_url', 's3_link', 'link', 'location'];
    for (const key of preferredKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const url = extractFirstUrl(value[key]);
        if (url) return url;
      }
    }
    for (const nested of Object.values(value)) {
      const url = extractFirstUrl(nested);
      if (url) return url;
    }
  }

  return null;
};

export function parseUploadSuccess(data, file, { mode, link } = {}) {
  const returnedUrl = data?.file_url || extractFirstUrl(data);
  const fileUrl = mode === 'replace' ? (link || returnedUrl) : returnedUrl;
  return {
    data,
    fileUrl,
    filePath: data?.file_path || null,
    contentType: data?.content_type || file?.type || null,
    contentGroup: data?.content_group || null,
  };
}
