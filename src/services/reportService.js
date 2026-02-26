import axios from 'axios';
import { getApiUrl } from '../config';

const getToken = () => {
    const currentEnv = localStorage.getItem('app_env') || 'STAGE';
    return localStorage.getItem(`token_${currentEnv}`);
};

const getHeaders = () => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication token not found');
    }

    return {
        'Authorization': `Token ${token}`,
        'Accept': 'application/json'
    };
};

const ReportService = {
    getScanReports: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/reports/scan/`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    },

    downloadScanReport: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/download/scan_report/`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    },

    getScanPrintReport: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/vq/scan_print_report/`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    },

    getPrintReports: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/reports/print/`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    },

    downloadPrintReport: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/download/print_report/`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    },

    getPrintLocations: async (eventId) => {
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/locations/print/`, {
            headers: getHeaders()
        });
        return response.data;
    },

    getKioskLocations: async (eventId) => {
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/locations/kiosk/`, {
            headers: getHeaders()
        });
        return response.data;
    },

    getMeetingReports: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/attendees/meetings/detail/`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    },

    exportMeetingDetails: async (eventId, data = {}) => {
        const response = await axios.post(`${getApiUrl()}/events/${eventId}/attendees/meetings/detail/`, data, {
            headers: getHeaders()
        });
        return response.data;
    },

    downloadEventMeetingReport: async (eventId, params = {}) => {
        const formattedParams = { ...params };
        Object.keys(formattedParams).forEach(key => {
            if (Array.isArray(formattedParams[key])) {
                formattedParams[key] = formattedParams[key].join(',');
            }
        });
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/meetings/report`, {
            headers: getHeaders(),
            params: formattedParams
        });
        return response.data;
    }
};

export default ReportService;
