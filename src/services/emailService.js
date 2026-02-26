import axios from 'axios';
import { getApiUrl } from '../config';

const getHeaders = (token) => ({
    'Authorization': `Token ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});

export const emailService = {
    // ------------------------------------------------------------------------
    // 1) Category Type Emails API
    // ------------------------------------------------------------------------
    getCategoryEmails: async (eventId, token, categoryName = '') => {
        try {
            const params = categoryName ? { category_name: categoryName } : {};
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/category_types/emails/`, {
                headers: getHeaders(token),
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching category emails:', error);
            throw error;
        }
    },

    createCategoryEmail: async (eventId, token, data) => {
        try {
            const response = await axios.post(`${getApiUrl()}/events/${eventId}/category_types/emails/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category email:', error);
            throw error;
        }
    },

    getCategoryEmail: async (eventId, emailId, token) => {
        try {
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/category_types/emails/${emailId}/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching category email:', error);
            throw error;
        }
    },

    updateCategoryEmail: async (eventId, emailId, token, data) => {
        try {
            const response = await axios.put(`${getApiUrl()}/events/${eventId}/category_types/emails/${emailId}/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error updating category email:', error);
            throw error;
        }
    },

    deleteCategoryEmail: async (eventId, emailId, token) => {
        try {
            const response = await axios.delete(`${getApiUrl()}/events/${eventId}/category_types/emails/${emailId}/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting category email:', error);
            throw error;
        }
    },

    // ------------------------------------------------------------------------
    // 2 & 3) Email Campaigns API
    // ------------------------------------------------------------------------
    getCampaigns: async (eventId, token) => {
        try {
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/campaigns/email/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email campaigns:', error);
            throw error;
        }
    },

    getCampaign: async (eventId, campaignId, token) => {
        try {
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/campaigns/email/${campaignId}/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email campaign:', error);
            throw error;
        }
    },

    rescheduleCampaign: async (eventId, campaignId, token, datetimeStr) => {
        try {
            const response = await axios.patch(`${getApiUrl()}/events/${eventId}/campaigns/email/${campaignId}/`, {
                datetime: datetimeStr
            }, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error rescheduling email campaign:', error);
            throw error;
        }
    },

    cancelCampaign: async (eventId, campaignId, token) => {
        try {
            const response = await axios.delete(`${getApiUrl()}/events/${eventId}/campaigns/email/${campaignId}/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error cancelling email campaign:', error);
            throw error;
        }
    },

    // ------------------------------------------------------------------------
    // 4) Template Email API
    // ------------------------------------------------------------------------
    getTemplates: async (token, page = 1, size = 20, sortBy = 'email_name', sortOrder = 'asc') => {
        try {
            const response = await axios.get(`${getApiUrl()}/templates/email/`, {
                headers: getHeaders(token),
                params: { page, size, sort_by: sortBy, sort_order: sortOrder }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email templates:', error);
            throw error;
        }
    },

    createTemplate: async (token, data) => {
        try {
            const response = await axios.post(`${getApiUrl()}/templates/email/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error creating email template:', error);
            throw error;
        }
    },

    getTemplate: async (templateId, token) => {
        try {
            const response = await axios.get(`${getApiUrl()}/templates/${templateId}/email/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email template:', error);
            throw error;
        }
    },

    updateTemplate: async (templateId, token, data) => {
        try {
            const response = await axios.patch(`${getApiUrl()}/templates/${templateId}/email/`, data, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error updating email template:', error);
            throw error;
        }
    },

    deleteTemplate: async (templateId, token) => {
        try {
            const response = await axios.delete(`${getApiUrl()}/templates/${templateId}/email/`, {
                headers: getHeaders(token)
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting email template:', error);
            throw error;
        }
    }
};
