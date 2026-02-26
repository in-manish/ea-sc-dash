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
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/reports/scan/`, {
            headers: getHeaders(),
            params
        });
        return response.data;
    },

    downloadScanReport: async (eventId, params = {}) => {
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/download/scan_report/`, {
            headers: getHeaders(),
            params
        });
        return response.data;
    },

    getScanPrintReport: async (eventId, params = {}) => {
        const response = await axios.get(`${getApiUrl()}/events/${eventId}/vq/scan_print_report/`, {
            headers: getHeaders(),
            params
        });
        return response.data;
    }
};

export default ReportService;
