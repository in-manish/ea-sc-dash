import axios from 'axios';

import { getApiUrl } from '../config';

export const whatsappService = {
    getTemplates: async (token, category = 'attendee', search = '', page = 1) => {
        try {
            const response = await axios.get(`${getApiUrl()}/wa/template/list/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    category,
                    search,
                    page,
                    page_size: 10
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching WhatsApp templates:', error);
            throw error;
        }
    },

    createTemplate: async (token, templateData) => {
        try {
            const response = await axios.post(`${getApiUrl()}/wa/template/create/`, templateData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating WhatsApp template:', error);
            throw error;
        }
    },

    updateTemplate: async (token, id, templateData) => {
        try {
            const response = await axios.patch(`${getApiUrl()}/wa/template/${id}/`, templateData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating template:', error);
            // Return error response data if available for handling in component
            if (error.response && error.response.data) {
                return error.response.data; // Should return { success: false, ... }
            }
            return {
                success: false,
                message: error.message || 'Network error occurred'
            };
        }
    }
};
