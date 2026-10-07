import { useState, useCallback } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import { parseBackfillMappingResult } from '../domain/parseBackfillMappingResult';
import { useAlert } from '../../../contexts/AlertContext';

export default function useSurveyBackfillMappingCsv({ eventId, token, onSaved }) {
    const { showConfirm } = useAlert();
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const resetMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const handleFileChange = (nextFile) => {
        setFile(nextFile || null);
        setResult(null);
        resetMessages();
    };

    const runUpload = useCallback(async (dryRun) => {
        if (!eventId || !token || !file) {
            setError('Select a CSV file first.');
            return null;
        }
        setBusy(true);
        resetMessages();
        try {
            const raw = await matchmakingApi.uploadSurveyBackfillMappingCsv(eventId, file, dryRun, token);
            const parsed = parseBackfillMappingResult(raw);
            setResult(parsed);
            if (!dryRun) {
                setSuccess(`Saved ${parsed.saved} mapping row${parsed.saved === 1 ? '' : 's'}.`);
                onSaved?.(parsed);
            }
            return parsed;
        } catch (err) {
            setError(err.message || 'Mapping CSV upload failed.');
            setResult(null);
            return null;
        } finally {
            setBusy(false);
        }
    }, [eventId, token, file, onSaved]);

    const validate = () => runUpload(true);

    const confirmSave = async () => {
        if (!result?.dryRun) return;
        const forms = result.forms?.length ? result.forms.join(', ') : 'forms in this CSV';
        const ok = await showConfirm(
            `Save ${result.saved} mapping row(s) and replace existing mappings for ${forms}?`,
            { title: 'Confirm mapping save', confirmText: 'Save mapping', variant: 'primary' },
        );
        if (!ok) return;
        return runUpload(false);
    };

    return {
        file,
        result,
        busy,
        error,
        success,
        handleFileChange,
        validate,
        confirmSave,
        canConfirm: Boolean(file && result?.dryRun),
    };
}
