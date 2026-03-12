import { getApiUrl } from '../../../config';

export const matchmakingApi = {
    /**
     * Fetch matchmaking questions for an event
     * @param {string|number} eventId 
     * @param {string} token 
     * @returns {Promise<Object>}
     */
    getMatchmakingQuestions: async (eventId, token) => {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/events/${eventId}/questions/matchmaking/`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Token ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch matchmaking questions: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Copy matchmaking questions from one event to another
     * @param {Object} data - { from_event_id, to_event_id, attendee_types_data }
     * @param {string} token 
     * @returns {Promise<Object>}
     */
    copyMatchmaking: async (data, token) => {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/evc/matchmaking/make_copy/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to copy matchmaking: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Delete a matchmaking form
     * @param {string|number} eventId 
     * @param {string|number} formId 
     * @param {string} token 
     * @returns {Promise<boolean>}
     */
    deleteMatchmakingForm: async (eventId, formId, token) => {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/events/${eventId}/registration/forms/${formId}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ delete: true })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to delete form: ${response.statusText}`);
        }

        return true;
    }
};
