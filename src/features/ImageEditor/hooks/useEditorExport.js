import { useCallback, useEffect, useState } from 'react';
import { copyEditedPng, copyImageBlob } from '../domain/copyImageBlob';
import { detectExportSupport } from '../domain/exportFormats';
import { downloadBlob, exportEditedImage } from '../domain/exportCanvas';

export function useEditorExport(canvas, session, setError, setStatus) {
  const [support, setSupport] = useState({ png: true, jpeg: true, webp: true, avif: true });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    detectExportSupport().then(setSupport).catch(() => {});
  }, []);

  const runExport = useCallback(async (options) => {
    if (!canvas || !session.meta.hasImage) throw new Error('Load an image first.');
    return exportEditedImage(canvas, {
      ...options,
      filename: options.filename || session.meta.fileName || 'edited-image',
    });
  }, [canvas, session.meta]);

  const download = useCallback(async (options) => {
    try {
      if (options?.formatId === 'avif') setStatus('Encoding AVIF…');
      const result = await runExport(options);
      downloadBlob(result.blob, result.filename);
      setStatus(`Downloaded ${result.filename}`);
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Export failed.');
    }
  }, [runExport, setError, setStatus]);

  const copyImage = useCallback(async (options) => {
    try {
      if (options) {
        const result = await runExport({ ...options, formatId: options.formatId || 'png' });
        await copyImageBlob(result.blob);
      } else {
        await copyEditedPng(canvas, exportEditedImage);
      }
      setStatus('Edited image copied to clipboard.');
    } catch (err) {
      setError(err.message || 'Could not copy image.');
    }
  }, [canvas, runExport, setError, setStatus]);

  return { support, open, setOpen, download, copyImage, runExport };
}
