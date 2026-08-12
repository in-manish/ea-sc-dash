import axios from 'axios';
import { getApiUrl } from '../config';

const getHeaders = (token) => ({
    Authorization: `Token ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
});

function buildListParams(eventId, options = {}) {
    const {
        page = 1,
        size = 20,
        sortBy = 'email_name',
        sortOrder = 'asc',
        search = '',
        email_name = '',
        template_type = '',
        is_active = '',
    } = typeof options === 'number' ? { page: options } : options;

    const params = {
        event: eventId,
        page,
        size,
        sort_by: sortBy,
        sort_order: sortOrder,
    };
    if (search) params.search = search;
    if (email_name) params.email_name = email_name;
    if (template_type) params.template_type = template_type;
    if (is_active !== '' && is_active != null) params.is_active = is_active;
    return params;
}

export const emailTemplateApi = {
    getEmailTemplates: async (eventId, token, options = {}) => {
        try {
            const response = await axios.get(`${getApiUrl()}/templates/email/`, {
                headers: getHeaders(token),
                params: buildListParams(eventId, options),
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email templates:', error);
            throw error;
        }
    },

    createEmailTemplate: async (eventId, token, data) => {
        try {
            const payload = { ...data, event: eventId };
            const response = await axios.post(`${getApiUrl()}/templates/email/`, payload, {
                headers: getHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error('Error creating email template:', error);
            throw error;
        }
    },

    getEmailTemplate: async (eventId, templateId, token) => {
        try {
            const response = await axios.get(`${getApiUrl()}/templates/${templateId}/email/`, {
                headers: getHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching email template:', error);
            throw error;
        }
    },

    updateEmailTemplate: async (eventId, templateId, token, data) => {
        try {
            const response = await axios.patch(
                `${getApiUrl()}/templates/${templateId}/email/`,
                data,
                { headers: getHeaders(token) }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating email template:', error);
            throw error;
        }
    },

    deleteEmailTemplate: async (eventId, templateId, token) => {
        try {
            const response = await axios.delete(`${getApiUrl()}/templates/${templateId}/email/`, {
                headers: getHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting email template:', error);
            throw error;
        }
    },
};
