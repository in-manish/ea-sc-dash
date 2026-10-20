import { useCallback, useState } from 'react';
import { companyApi } from '../../Companies/api/companyApi';

export default function useChangeExhibitorPoc({ eventId, token }) {
    const [changing, setChanging] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const clearMessages = useCallback(() => {
        setSuccess('');
        setError('');
    }, []);

    const changePoc = useCallback(
        async ({ badgeId, companyId }) => {
            if (!eventId || !token || !badgeId) return false;
            clearMessages();
            setChanging(true);
            try {
                const body = { badge_id: Number(badgeId) };
                if (companyId) body.company_id = Number(companyId);
                await companyApi.changeExhibitorPoc(eventId, token, body);
                setSuccess('POC changed. The new POC will receive the portal password email.');
                return true;
            } catch (err) {
                setError(err.message || 'Failed to change exhibitor POC.');
                return false;
            } finally {
                setChanging(false);
            }
        },
        [eventId, token, clearMessages],
    );

    return { changing, success, error, changePoc, clearMessages };
}
