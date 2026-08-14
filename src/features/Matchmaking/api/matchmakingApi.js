import { getApiUrl } from '../../../config';
import { matchmakingFormApi } from './matchmakingFormApi';
import { matchmakingExhibitorApi } from './matchmakingExhibitorApi';
import { matchmakingSurveyApi } from './matchmakingSurveyApi';

export const matchmakingApi = {
    ...matchmakingFormApi,
    ...matchmakingExhibitorApi,
    ...matchmakingSurveyApi,

    deleteMatchmakingForm: async (eventId, formId, token) => {
        const response = await fetch(`${getApiUrl()}/events/${eventId}/registration/forms/${formId}/`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({ delete: true }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to delete form: ${response.statusText}`);
        }
        if (response.status === 204) return true;
        return response.json();
    },
};
