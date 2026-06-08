import axios from 'axios';
import { getApiUrl } from '../config';

const getHeaders = (token) => ({
    'Authorization': `Token ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});

export const meetingService = {
    getAdminMeetings: async (token, eventId, params = {}) => {
        try {
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/meetings/admin/`, {
                headers: getHeaders(token),
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching admin meetings:', error);
            throw error;
        }
    },

    getRestorePreview: async (token, eventId, params = {}) => {
        try {
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/meetings/restore/`, {
                headers: getHeaders(token),
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching meeting restore preview:', error);
            throw error;
        }
    },

    dispatchRestoreAction: async (token, eventId, data) => {
        try {
            const response = await axios.post(`${getApiUrl()}/events/${eventId}/meetings/restore/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error dispatching meeting restore action:', error);
            throw error;
        }
    }
};
