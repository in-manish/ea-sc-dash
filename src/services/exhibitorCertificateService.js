import { getApiUrl } from '../config';

const getHeaders = (token) => ({
    'Authorization': `Token ${token}`,
    'Accept': 'application/json, text/plain, */*',
});

export const exhibitorCertificateService = {
    async getTemplate(eventId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/exhibitor_certificate/template/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Exhibitor certificate template not set');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Template Error:', error);
            throw error;
        }
    },

    async uploadTemplate(eventId, token, formData) {
        try {
            // Note: Browsers automatically set multipart/form-data boundary when using FormData, 
            // so we do not manually set Content-Type here.
            const headers = getHeaders(token);
            const response = await fetch(`${getApiUrl()}/events/${eventId}/exhibitor_certificate/template/`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload Template Error:', error);
            throw error;
        }
    },

    async sendTestCertificate(eventId, token, testEmails, companyName) {
        try {
            const headers = {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            };
            const response = await fetch(`${getApiUrl()}/events/${eventId}/exhibitor_certificate/send/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    test_emails: testEmails,
                    company_name: companyName
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Send Test Certificate Error:', error);
            throw error;
        }
    },

    async sendBulkCertificates(eventId, token, badgeUuids = null) {
        try {
            const headers = {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            };
            const body = {};
            if (badgeUuids) {
                body.badge_uuids = badgeUuids;
            }
            const response = await fetch(`${getApiUrl()}/events/${eventId}/exhibitor_certificate/send/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Send Bulk Certificates Error:', error);
            throw error;
        }
    },

    async getSendPreview(eventId, token, badgeUuids = null) {
        try {
            let url = `${getApiUrl()}/events/${eventId}/exhibitor_certificate/send/preview/`;
            if (badgeUuids) {
                const uuidsParam = Array.isArray(badgeUuids) ? badgeUuids.join(',') : badgeUuids;
                url += `?badge_uuids=${encodeURIComponent(uuidsParam)}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Send Preview Error:', error);
            throw error;
        }
    },

    async getBulkSendProgress(eventId, token, progressUuid) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/exhibitor_certificate/send/progress/${progressUuid}/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Bulk Send Progress Error:', error);
            throw error;
        }
    }
};
