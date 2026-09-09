import { useCallback, useMemo, useState } from 'react';

/**
 * Shared state/handlers for a "pick CSV -> dry-run validate -> upload" modal flow
 * (used by both the attendee and company bulk-upload modals).
 *
 * `extraParams` (e.g. { strict }) is folded into the file-identity key so a change
 * to those params invalidates any cached validation result for the current file.
 */
export function useCsvUploadFlow({
    eventId,
    token,
    onUploaded,
    validateFn,
    uploadFn,
    downloadReportFn,
    extraParams = {},
}) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validation, setValidation] = useState(null);
    const [validatedFileKey, setValidatedFileKey] = useState(null);

    const busy = uploading || validating || downloadingReport;
    const paramsKey = JSON.stringify(extraParams);
    const fileKey = file ? `${file.name}-${file.size}-${file.lastModified}-${paramsKey}` : null;
    const isValidForFile = Boolean(validation) && validatedFileKey === fileKey;
    const currentValidation = isValidForFile ? validation : null;
    const hasBlockingErrors = Boolean(currentValidation) && currentValidation.summary.rows_with_errors > 0;
    const rowIssues = useMemo(
        () => (currentValidation ? currentValidation.rows.filter((r) => r.status !== 'valid') : []),
        [currentValidation]
    );

    const handleFileChange = useCallback((selected) => {
        setFile(selected || null);
        setValidation(null);
        setValidatedFileKey(null);
        setError(null);
        setSuccess(null);
    }, []);

    const handleValidate = useCallback(async () => {
        if (!file || busy) return;
        setValidating(true);
        setError(null);
        try {
            const result = await validateFn(eventId, token, file, extraParams);
            setValidation(result);
            setValidatedFileKey(fileKey);
        } catch (err) {
            setError(err.message || 'Failed to validate CSV.');
        } finally {
            setValidating(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, busy, validateFn, eventId, token, paramsKey, fileKey]);

    const handleDownloadReport = useCallback(async () => {
        if (!file || busy) return;
        setDownloadingReport(true);
        setError(null);
        try {
            await downloadReportFn(eventId, token, file, extraParams);
        } catch (err) {
            setError(err.message || 'Failed to download validation report.');
        } finally {
            setDownloadingReport(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, busy, downloadReportFn, eventId, token, paramsKey]);

    const handleUpload = useCallback(async () => {
        if (!file) {
            setError('Please select a CSV file to upload.');
            return;
        }
        if (busy) return;
        setUploading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await uploadFn(eventId, token, file, extraParams);
            setSuccess(result?.msg || 'File uploaded successfully. Processing in the background.');
            setFile(null);
            setValidation(null);
            setValidatedFileKey(null);
            setTimeout(() => onUploaded?.(), 1200);
        } catch (err) {
            setError(err.message || 'Failed to upload CSV.');
        } finally {
            setUploading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, busy, uploadFn, eventId, token, paramsKey, onUploaded]);

    return {
        file,
        uploading,
        validating,
        downloadingReport,
        busy,
        error,
        success,
        summary: currentValidation?.summary || null,
        rowIssues,
        hasBlockingErrors,
        handleFileChange,
        handleValidate,
        handleDownloadReport,
        handleUpload,
    };
}
