import axios from 'axios';
import { getApiUrl } from '../config';
import { emailTemplateApi } from './emailTemplateApi';

const getHeaders = (token) => ({
    Authorization: `Token ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
});

export const emailService = {
    getCategoryEmails: async (eventId, token, categoryName = '') => {
        try {
            const params = categoryName ? { category_name: categoryName } : {};
            const response = await axios.get(`${getApiUrl()}/events/${eventId}/category_types/emails/`, {
                headers: getHeaders(token),
                params,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching category emails:', error);
            throw error;
        }
    },

    createCategoryEmail: async (eventId, token, data) => {
        try {
            const response = await axios.post(
                `${getApiUrl()}/events/${eventId}/category_types/emails/`,
                data,
                { headers: getHeaders(token) }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating category email:', error);
            throw error;
        }
    },

    getCategoryEmail: async (eventId, emailId, token) => {
        try {
            const response = await axios.get(
                `${getApiUrl()}/events/${eventId}/category_types/emails/${emailId}/`,
                { headers: getHeaders(token) }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching category email:', error);
            throw error;
        }
    },

    updateCategoryEmail: async (eventId, emailId, token, data) => {
        try {
            const response = await axios.put(
                `${getApiUrl()}/events/${eventId}/category_types/emails/${emailId}/`,
                data,
                { headers: getHeaders(token) }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating category email:', error);
            throw error;
        }
    },

    deleteCategoryEmail: async (eventId, emailId, token) => {
        try {
            const response = await axios.delete(
                `${getApiUrl()}/events/${eventId}/category_types/emails/${emailId}/`,
                { headers: getHeaders(token) }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting category email:', error);
            throw error;
        }
    },

    ...emailTemplateApi,
};
