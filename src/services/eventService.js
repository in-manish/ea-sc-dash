const BASE_URL = 'https://reconnect.stage-eventapp-reconnect.fairfest.in/events';

const getHeaders = (token) => ({
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    'Authorization': `Token ${token}`,
    'Connection': 'keep-alive',
    'Origin': 'https://stage-reconnect.fairfest.in',
    'Referer': 'https://stage-reconnect.fairfest.in/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"'
});

export const eventService = {
    async getAttendees(eventId, token, page = 1, size = 50, sortBy = 'modified_at', sortOrder = 'desc') {
        try {
            const queryParams = new URLSearchParams({
                page,
                size,
                sort_by: sortBy,
                sort_order: sortOrder
            });

            const response = await fetch(`${BASE_URL}/${eventId}/attendees/search?${queryParams}`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Attendees Error:', error);
            throw error;
        }
    },

    async getCompanies(eventId, token, page = 1, size = 20, sortBy = 'obf_number', sortOrder = 'desc', search = '') {
        // Note: The curl command shows a different base URL for companies list: https://reconnect.stage-eventapp-reconnect.fairfest.in/evc/events/...
        // I need to handle this URL difference safely.
        // The base URL const is 'https://reconnect.stage-eventapp-reconnect.fairfest.in/events'
        // The company list URL is 'https://reconnect.stage-eventapp-reconnect.fairfest.in/evc/events/9/company_list/...'

        // Constructing the specific URL for company list
        const companyListUrl = `https://reconnect.stage-eventapp-reconnect.fairfest.in/evc/events/${eventId}/company_list/`;

        try {
            const queryParams = new URLSearchParams({
                from: (page - 1) * size, // API uses 'from' (offset) instead of page number
                size,
                sort_by: sortBy,
                sort_order: sortOrder,
                q: search
            });

            const response = await fetch(`${companyListUrl}?${queryParams}`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Companies Error:', error);
            throw error;
        }
    },

    async getCompanyDetails(eventId, companyId, token) {
        // URL: https://reconnect.stage-eventapp-reconnect.fairfest.in/events/9/companies/2772/
        try {
            const response = await fetch(`${BASE_URL}/${eventId}/companies/${companyId}/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Company Details Error:', error);
            throw error;
        }
    },

    async getEventDetails(eventId, token) {
        try {
            const response = await fetch(`${BASE_URL}/${eventId}/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Event Details Error:', error);
            throw error;
        }
    },

    async updateEvent(eventId, token, formData) {
        try {
            // Note: When sending FormData, do NOT set Content-Type header manually.
            // The browser will set it to multipart/form-data with the correct boundary.
            const headers = getHeaders(token);
            delete headers['Content-Type']; // Ensure no content type is forcing JSON

            const response = await fetch(`${BASE_URL}/${eventId}/`, {
                method: 'PATCH',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update Event Error:', error);
            throw error;
        }
    }
};
