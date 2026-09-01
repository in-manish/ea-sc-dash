import { useCallback, useState } from 'react';
import {
    downloadAttendeeUploadValidationReport,
    uploadAttendeesCsv,
    validateAttendeesCsv,
} from '../api/attendeeUploadApi';

/** State/handlers for the attendee CSV upload modal: pick file, dry-run validate, upload. */
export function useAttendeeUpload({ eventId, token, onUploaded }) {
    const [file, setFile] = useState(null);
    const [strict, setStrict] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [downloadingReport, setDownloadingReport] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validation, setValidation] = useState(null);
    const [validatedFileKey, setValidatedFileKey] = useState(null);

    const fileKey = file ? `${file.name}-${file.size}-${file.lastModified}` : null;
    const isValidForFile = Boolean(validation) && validatedFileKey === fileKey;
    const hasBlockingErrors = isValidForFile && validation.summary.rows_with_errors > 0;

    const handleFileChange = useCallback((selected) => {
        setFile(selected || null);
        setValidation(null);
        setValidatedFileKey(null);
        setError(null);
        setSuccess(null);
    }, []);

    const handleValidate = useCallback(async () => {
        if (!file) return;
        setValidating(true);
        setError(null);
        try {
            const result = await validateAttendeesCsv(eventId, token, file, { strict });
            setValidation(result);
            setValidatedFileKey(fileKey);
        } catch (err) {
            setError(err.message || 'Failed to validate attendees CSV.');
        } finally {
            setValidating(false);
        }
    }, [file, fileKey, eventId, token, strict]);

    const handleDownloadReport = useCallback(async () => {
        if (!file) return;
        setDownloadingReport(true);
        setError(null);
        try {
            await downloadAttendeeUploadValidationReport(eventId, token, file, { strict });
        } catch (err) {
            setError(err.message || 'Failed to download validation report.');
        } finally {
            setDownloadingReport(false);
        }
    }, [file, eventId, token, strict]);

    const handleUpload = useCallback(async () => {
        if (!file) {
            setError('Please select a CSV file to upload.');
            return;
        }
        setUploading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await uploadAttendeesCsv(eventId, token, file, { strict });
            setSuccess(result?.msg || 'File uploaded successfully. Processing in the background.');
            setFile(null);
            setValidation(null);
            setValidatedFileKey(null);
            setTimeout(() => onUploaded?.(), 1200);
        } catch (err) {
            setError(err.message || 'Failed to upload attendees CSV.');
        } finally {
            setUploading(false);
        }
    }, [file, eventId, token, strict, onUploaded]);

    return {
        file,
        strict,
        setStrict,
        uploading,
        validating,
        downloadingReport,
        error,
        success,
        validation: isValidForFile ? validation : null,
        hasBlockingErrors,
        handleFileChange,
        handleValidate,
        handleDownloadReport,
        handleUpload,
    };
}
