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
     * Create or update matchmaking form and questions
     * @param {string|number} eventId 
     * @param {Object} payload - { form_id, form_name, questions }
     * @param {string} token 
     * @returns {Promise<Object>}
     */
    saveMatchmakingQuestions: async (eventId, payload, token) => {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/events/${eventId}/questions/matchmaking/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to save matchmaking questions: ${response.statusText}`);
        }

        return await response.json();
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

        if (response.status === 204) return true;
        return await response.json();
    },

    /**
     * Save survey question mapping for an event
     * @param {string|number} eventId 
     * @param {Object} payload - { form_value, questions }
     * @param {string} token 
     * @returns {Promise<Object>}
     */
    saveSurveyMapping: async (eventId, payload, token) => {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/events/${eventId}/matchmaking/surveyjs-question-mapping/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to save mapping: ${response.statusText}`);
        }

        return await response.json();
    },

    /**
     * Fetch SurveyJS form JSON from external API
     * @param {string} formValue 
     * @param {string} eventCode 
     * @returns {Promise<Object>}
     */
    getSurveyForm: async (formValue, eventCode) => {
        const response = await fetch(`https://api-stage.otm.co.in/api/get-form-json`, {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                form_value: formValue,
                eventCode: eventCode
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch survey form: ${response.statusText}`);
        }

        return await response.json();
    },

    /**
     * Fetch existing survey mapping for an event and form
     * @param {string|number} eventId 
     * @param {string} formValue 
     * @param {string} token 
     * @returns {Promise<Object>}
     */
    getSurveyMapping: async (eventId, formValue, token) => {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/events/${eventId}/matchmaking/surveyjs-question-mapping/?form_value=${formValue}`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Token ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch survey mapping: ${response.statusText}`);
        }

        return await response.json();
    }
};
