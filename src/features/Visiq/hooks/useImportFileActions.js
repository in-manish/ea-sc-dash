import { useCallback, useState } from 'react';
import {
  loadImportCsvSource,
  openFileUrl,
  previewFromCsvText,
  resolveJobFileUrl,
  triggerBrowserDownload,
} from '../domain/loadImportCsvSource';
import { isCsvFileName, parseCsvText } from '../domain/parseCsvPreview';

/**
 * Preview / download using job.file URL from the import API response
 * (or a locally chosen File for the upload panel).
 */
export function useImportFileActions() {
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState('');
  const [busyImportId, setBusyImportId] = useState(null);
  const [error, setError] = useState('');
  const [localFile, setLocalFile] = useState(null);

  const closePreview = useCallback(() => {
    setPreview(null);
    setError('');
  }, []);

  const clearError = useCallback(() => setError(''), []);

  const bindLocalFile = useCallback((file) => {
    setLocalFile(file || null);
    setError('');
  }, []);

  const previewLocalFile = useCallback(async () => {
    if (!localFile) {
      setError('Choose a CSV file first.');
      return;
    }
    if (!isCsvFileName(localFile.name)) {
      setError('In-browser preview supports CSV only.');
      return;
    }
    setBusy('preview');
    setBusyImportId(null);
    setError('');
    try {
      const text = await localFile.text();
      const parsed = parseCsvText(text, { maxRows: 50 });
      setPreview({
        title: localFile.name,
        headers: parsed.headers,
        rows: parsed.rows,
        truncated: parsed.truncated,
        sourceUrl: null,
        importId: null,
        blob: localFile,
      });
    } catch (err) {
      setError(err.message || 'Failed to read CSV');
    } finally {
      setBusy('');
    }
  }, [localFile]);

  const downloadLocalFile = useCallback(async () => {
    if (!localFile) {
      setError('Choose a file first.');
      return;
    }
    setBusy('download');
    setBusyImportId(null);
    setError('');
    try {
      triggerBrowserDownload(localFile, localFile.name);
    } catch (err) {
      setError(err.message || 'Failed to download');
    } finally {
      setBusy('');
    }
  }, [localFile]);

  const previewJob = useCallback(async (job) => {
    setBusy('preview');
    setBusyImportId(job?.id ?? null);
    setError('');
    try {
      const source = await loadImportCsvSource(job, localFile);
      const parsed = previewFromCsvText(source.text, source.filename);
      setPreview({
        title: source.filename,
        headers: parsed.headers,
        rows: parsed.rows,
        truncated: parsed.truncated,
        sourceUrl: source.sourceUrl,
        importId: job?.id ?? null,
        blob: source.blob,
      });
    } catch (err) {
      setError(err.message || 'Failed to preview file');
      setPreview(null);
    } finally {
      setBusy('');
      setBusyImportId(null);
    }
  }, [localFile]);

  const downloadJob = useCallback(async (job) => {
    setBusy('download');
    setBusyImportId(job?.id ?? null);
    setError('');
    const url = resolveJobFileUrl(job);
    try {
      const source = await loadImportCsvSource(job, localFile);
      triggerBrowserDownload(source.blob, source.filename);
    } catch (err) {
      if (url) {
        openFileUrl(url);
        setError('');
      } else {
        setError(err.message || 'Failed to download file');
      }
    } finally {
      setBusy('');
      setBusyImportId(null);
    }
  }, [localFile]);

  const downloadPreviewFile = useCallback(async () => {
    if (preview?.blob) {
      triggerBrowserDownload(preview.blob, preview.title);
      return;
    }
    if (preview?.sourceUrl) {
      openFileUrl(preview.sourceUrl);
    }
  }, [preview]);

  return {
    preview,
    busy,
    busyImportId,
    error,
    localFile,
    bindLocalFile,
    closePreview,
    clearError,
    previewLocalFile,
    previewJob,
    downloadLocalFile,
    downloadJob,
    downloadPreviewFile,
  };
}
