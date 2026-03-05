import { getApiUrl } from '../config';

const getHeaders = (token) => ({
    'Authorization': `Token ${token}`,
    'Accept': 'application/json, text/plain, */*',
});

export const exhibitorService = {
    async getExhibitorDocuments(eventId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/from_organizer/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Exhibitor Documents Error:', error);
            throw error;
        }
    },

    async createDocument(eventId, token, formData) {
        try {
            // Browsers automatically set multipart/form-data boundary when using FormData
            const headers = getHeaders(token);
            const response = await fetch(`${getApiUrl()}/events/${eventId}/from_organizer/doc_create/`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Create Document Error:', error);
            throw error;
        }
    },

    async updateDocument(eventId, docId, token, formData) {
        try {
            const headers = getHeaders(token);
            const response = await fetch(`${getApiUrl()}/events/${eventId}/from_organizer/docs/${docId}/`, {
                method: 'PATCH',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update Document Error:', error);
            throw error;
        }
    }
};
