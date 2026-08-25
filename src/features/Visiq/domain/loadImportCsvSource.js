import { isCsvFileName, parseCsvText } from './parseCsvPreview';

/** Absolute or relative file URL from import job serializer `file` field. */
export function resolveJobFileUrl(job) {
  const raw = job?.file;
  if (!raw) return '';
  if (typeof raw === 'string') return raw.trim();
  if (typeof raw === 'object' && raw.url) return String(raw.url).trim();
  return '';
}

export function jobFileName(job, fallback = 'import.csv') {
  return job?.original_file_name || fallback;
}

/**
 * Load CSV text from job.file URL (or a local File).
 * Returns { text, filename, blob, sourceUrl }.
 */
export async function loadImportCsvSource(job, localFile) {
  const filename = jobFileName(job, localFile?.name || 'import.csv');
  const url = resolveJobFileUrl(job);

  if (url) {
    const response = await fetch(url, { method: 'GET', mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Unable to load file (${response.status}).`);
    }
    const blob = await response.blob();
    const text = await blob.text();
    return { text, filename, blob, sourceUrl: url };
  }

  if (localFile) {
    const text = await localFile.text();
    return {
      text,
      filename: localFile.name || filename,
      blob: localFile,
      sourceUrl: null,
    };
  }

  throw new Error('No file URL on this import job.');
}

export function previewFromCsvText(text, filename) {
  if (!isCsvFileName(filename)) {
    throw new Error('In-browser preview supports CSV only.');
  }
  return parseCsvText(text, { maxRows: 50 });
}

export function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename || 'download';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Fallback when CORS blocks blob download — open the S3 URL directly. */
export function openFileUrl(url) {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}
