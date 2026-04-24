import { getApiUrl } from '../config';

const UPLOAD_ENDPOINT = '/uploads/files/';

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

export const fileUploadService = {
  async uploadFile(file, token) {
    if (!file) {
      throw new Error('Please select a file to upload.');
    }

    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${getApiUrl()}${UPLOAD_ENDPOINT}`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json'
      },
      body: formData
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.detail || data?.message || 'File upload failed.';
      throw new Error(detail);
    }

    const fileUrl = data?.file_url || extractFirstUrl(data);
    return {
      data,
      fileUrl,
      filePath: data?.file_path || null,
      contentType: data?.content_type || file?.type || null,
      contentGroup: data?.content_group || null
    };
  }
};
