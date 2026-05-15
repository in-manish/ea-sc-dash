import axios from 'axios';
import { getApiUrl } from '../config';

const getHeaders = (token) => ({
    'Authorization': `Token ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});

export const emailKillSwitchService = {
    listKillSwitches: async (token) => {
        try {
            const response = await axios.get(`${getApiUrl()}/common-services/emailing/kill-switches/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error listing email kill switches:', error);
            throw error;
        }
    },

    createUpdateKillSwitch: async (token, data) => {
        try {
            const response = await axios.post(`${getApiUrl()}/common-services/emailing/kill-switches/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error creating/updating email kill switch:', error);
            throw error;
        }
    },

    getKillSwitch: async (token, key) => {
        try {
            const response = await axios.get(`${getApiUrl()}/common-services/emailing/kill-switches/${key}/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email kill switch:', error);
            throw error;
        }
    },

    updateKillSwitch: async (token, key, data) => {
        try {
            const response = await axios.patch(`${getApiUrl()}/common-services/emailing/kill-switches/${key}/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error updating email kill switch:', error);
            throw error;
        }
    }
};
