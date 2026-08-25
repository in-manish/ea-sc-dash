import { useCallback, useState } from 'react';
import { createImport } from '../api/importApi';
import { parseTagInput } from '../domain/buildImportFormData';

export function useCreateImport({ token, onUnauthorized, onCreated }) {
  const [file, setFile] = useState(null);
  const [tagText, setTagText] = useState('');
  const [dryRun, setDryRun] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = useCallback(() => {
    setFile(null);
    setTagText('');
    setDryRun(false);
    setError('');
    setSuccess('');
  }, []);

  const submit = useCallback(async () => {
    if (!token || !file || submitting) return;
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const job = await createImport(token, {
        file,
        mapping: {},
        tags: parseTagInput(tagText),
        dryRun,
      });
      setSuccess(
        dryRun
          ? `Dry run #${job.id} queued — no subscribers will be written.`
          : `Import #${job.id} queued and processing.`
      );
      setFile(null);
      onCreated?.(job);
    } catch (err) {
      if (err.status === 401) onUnauthorized?.();
      setError(err.message || 'Failed to start import');
    } finally {
      setSubmitting(false);
    }
  }, [token, file, tagText, dryRun, submitting, onUnauthorized, onCreated]);

  return {
    file,
    setFile,
    tagText,
    setTagText,
    dryRun,
    setDryRun,
    submitting,
    error,
    success,
    submit,
    reset,
  };
}
