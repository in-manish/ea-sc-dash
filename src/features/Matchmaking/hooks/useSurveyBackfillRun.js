import { useState, useCallback } from 'react';
import { matchmakingApi } from '../api/matchmakingApi';
import { useAlert } from '../../../contexts/AlertContext';

export default function useSurveyBackfillRun({ eventId, token, onQueued }) {
    const { showAlert } = useAlert();
    const [formValue, setFormValue] = useState('');
    const [force, setForce] = useState(false);
    const [busy, setBusy] = useState(false);

    const run = useCallback(async () => {
        if (!eventId || !token) return;
        setBusy(true);
        try {
            const data = await matchmakingApi.runSurveyBackfill(
                eventId,
                { formValue: formValue.trim() || undefined, force },
                token,
            );
            showAlert(data?.msg || 'Backfill queued. Watch the log counts below.', 'success');
            onQueued?.();
        } catch (err) {
            showAlert(err.message || 'Could not queue backfill.', 'error');
        } finally {
            setBusy(false);
        }
    }, [eventId, token, formValue, force, onQueued, showAlert]);

    return { formValue, setFormValue, force, setForce, busy, run };
}
