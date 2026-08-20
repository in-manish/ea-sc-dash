import axios from 'axios';

import { getApiUrl } from '../../../config';
import { buildTemplateListParams } from '../domain/templateListQuery';

const authHeaders = (token) => ({
    Authorization: `Token ${token}`,
    'Content-Type': 'application/json',
});

const mutationError = (error, fallback) => {
    if (error.response?.data) return error.response.data;
    return { success: false, message: error.message || fallback };
};

export const whatsappService = {
    /** Omit is_active for active-only (backend default). Pass is_active: false for archived. */
    getTemplates: async (token, category = 'attendee', searchOrOptions = '', page = 1) => {
        const options = typeof searchOrOptions === 'object' && searchOrOptions !== null
            ? searchOrOptions
            : { search: searchOrOptions, page };
        try {
            const response = await axios.get(`${getApiUrl()}/wa/template/list/`, {
                headers: authHeaders(token),
                params: buildTemplateListParams({
                    category,
                    search: options.search ?? '',
                    page: options.page ?? 1,
                    pageSize: options.pageSize ?? 50,
                    is_active: options.is_active,
                }),
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching WhatsApp templates:', error);
            throw error;
        }
    },

    createTemplate: async (token, templateData) => {
        try {
            const response = await axios.post(
                `${getApiUrl()}/wa/template/create/`,
                templateData,
                { headers: authHeaders(token) },
            );
            return response.data;
        } catch (error) {
            console.error('Error creating WhatsApp template:', error);
            return mutationError(error, 'Network error occurred');
        }
    },

    updateTemplate: async (token, id, templateData) => {
        try {
            const response = await axios.patch(
                `${getApiUrl()}/wa/template/${id}/`,
                templateData,
                { headers: authHeaders(token) },
            );
            return response.data;
        } catch (error) {
            console.error('Error updating template:', error);
            return mutationError(error, 'Network error occurred');
        }
    },

    /** DELETE archives the row (is_active: false). Record remains GET-able. */
    archiveTemplate: async (token, id) => {
        try {
            const response = await axios.delete(`${getApiUrl()}/wa/template/${id}/`, {
                headers: authHeaders(token),
            });
            return response.data;
        } catch (error) {
            console.error('Error archiving WhatsApp template:', error);
            return mutationError(error, 'Failed to archive template');
        }
    },

    restoreTemplate: async (token, id) => {
        return whatsappService.updateTemplate(token, id, { is_active: true });
    },
};
