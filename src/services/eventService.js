import { getApiUrl } from '../config';

const getHeaders = (token) => {
    const baseUrl = getApiUrl();
    const origin = new URL(baseUrl).origin;

    return {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
        'Authorization': `Token ${token}`,
        'Connection': 'keep-alive',
        'Origin': origin,
        'Referer': `${origin}/`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
    };
};

export const eventService = {
    async getAttendees(eventId, token, options = {}) {
        const {
            page = 1,
            size = 50,
            sortBy = 'modified_at',
            sortOrder = 'desc',
            searchQuery = '',
            searchType = '',
            filters = {}
        } = options;

        try {
            const queryParams = new URLSearchParams({
                page,
                size,
                sort_by: sortBy,
                sort_order: sortOrder
            });

            if (searchQuery) {
                queryParams.append('search_query', searchQuery);
            }

            if (searchType) {
                queryParams.append('search_type', searchType);
            }

            // Process filters
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== '' && value !== null && value !== undefined) {
                    if (key === 'whatsapp_sent') {
                        queryParams.append('wa_sent', value);
                    } else if (key === 'attendee_type' && Array.isArray(value)) {
                        queryParams.append(key, value.join(','));
                    } else {
                        queryParams.append(key, value);
                    }
                }
            });

            const response = await fetch(`${getApiUrl()}/events/${eventId}/attendees/search?${queryParams}`, {
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

    async getCompanies(eventId, token, page = 1, size = 20, sortBy = 'obf_number', sortOrder = 'desc', search = '', filters = {}, includeStats = false) {
        // Note: The curl command shows a different base URL for companies list: https://reconnect.stage-eventapp-reconnect.fairfest.in/evc/events/...
        // I need to handle this URL difference safely.
        // The base URL const is 'https://reconnect.stage-eventapp-reconnect.fairfest.in/events'
        // The company list URL is 'https://reconnect.stage-eventapp-reconnect.fairfest.in/evc/events/9/company_list/...'

        // Constructing the specific URL for company list
        const companyListUrl = `${getApiUrl()}/evc/events/${eventId}/company_list/`;

        try {
            const queryParams = new URLSearchParams({
                from: (page - 1) * size, // API uses 'from' (offset) instead of page number
                size,
                sort_by: sortBy,
                sort_order: sortOrder,
                q: search
            });

            if (includeStats) {
                queryParams.append('agg', 'true');
            }

            // Process filters
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== '' && value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        // API expects comma-separated values for array filters
                        queryParams.append(key, value.join(','));
                    } else {
                        queryParams.append(key, value);
                    }
                }
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

    async getAdditionalRequirementsOrders(eventId, token, page = 1, size = 10, filters = {}, includeStats = false) {
        // base URL https://reconnect.stage-eventapp-reconnect.fairfest.in/admin/events/9/additional-requirements/orders/list/?status=paid&is_verified=true&payment_mode=offline&date_from=2024-01-01&date_to=2024-12-31

        // Construct URL based on the curl command provided
        // The base URL for this specific endpoint seems to be different or structured differently
        // https://reconnect.stage-eventapp-reconnect.fairfest.in/admin/events/9/additional-requirements/orders/list/

        const adminBaseUrl = `${getApiUrl()}/admin/events/${eventId}/additional-requirements/orders/list/`;

        try {
            const queryParams = new URLSearchParams({
                page,
                page_size: size,
            });

            if (includeStats) {
                queryParams.append('stats', 'true');
            }

            // Process filters
            Object.keys(filters).forEach(key => {
                const value = filters[key];
                if (value !== '' && value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        if (key === 'status') {
                            // Join multiple values with comma for status (e.g. status=paid,pending)
                            queryParams.append(key, value.join(','));
                        } else {
                            // Append multiple values for other keys (e.g. company_ids=1&company_ids=2)
                            value.forEach(item => queryParams.append(key, item));
                        }
                    } else {
                        queryParams.append(key, value);
                    }
                }
            });

            const response = await fetch(`${adminBaseUrl}?${queryParams}`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Additional Requirements Orders Error:', error);
            throw error;
        }
    },

    async sendAROrdersReport(eventId, token, emails, status = ['paid', 'pay_later']) {
        const url = `${getApiUrl()}/admin/events/${eventId}/additional-requirements/orders/report/`;

        try {
            const queryParams = new URLSearchParams();

            if (Array.isArray(status)) {
                status.forEach(s => queryParams.append('status', s));
            } else {
                queryParams.append('status', status);
            }

            if (emails && emails.length > 0) {
                // The API expects comma separated emails
                queryParams.append('send_to_emails', emails.join(','));
            }

            const response = await fetch(`${url}?${queryParams}`, {
                method: 'GET', // Based on the curl command, it's a GET request even though it triggers an action
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Send Report Error:', error);
            throw error;
        }
    },

    async getCompanyDetails(eventId, companyId, token) {
        // URL: https://reconnect.stage-eventapp-reconnect.fairfest.in/events/9/companies/2772/
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/companies/${companyId}/`, {
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
            const response = await fetch(`${getApiUrl()}/events/${eventId}/`, {
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

            const response = await fetch(`${getApiUrl()}/events/${eventId}/`, {
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
    },


    // --- AR Groups APIs ---

    async getARGroups(eventId, token, options = {}) {
        const { is_active, page, page_size } = options;
        try {
            const queryParams = new URLSearchParams();
            if (is_active !== undefined) queryParams.append('is_active', is_active);
            if (page) queryParams.append('page', page);
            if (page_size) queryParams.append('page_size', page_size);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/groups/${queryString}`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Get AR Groups Error:', error);
            throw error;
        }
    },

    async createARGroup(eventId, token, data) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/groups/`, {
                method: 'POST',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Create AR Group Error:', error);
            throw error;
        }
    },

    async updateARGroup(eventId, groupId, token, data) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/groups/${groupId}/`, {
                method: 'PATCH',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Update AR Group Error:', error);
            throw error;
        }
    },

    async deleteARGroup(eventId, groupId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/groups/${groupId}/`, {
                method: 'DELETE',
                headers: getHeaders(token)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Delete AR Group Error:', error);
            throw error;
        }
    },

    // --- AR Products APIs ---

    async getARProducts(eventId, groupId, token, options = {}) {
        const { is_active, page, page_size } = options;
        try {
            const queryParams = new URLSearchParams();
            if (is_active !== undefined) queryParams.append('is_active', is_active);
            if (page) queryParams.append('page', page);
            if (page_size) queryParams.append('page_size', page_size);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/groups/${groupId}/products/${queryString}`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Get AR Products Error:', error);
            throw error;
        }
    },

    async createARProduct(eventId, groupId, token, data, isMultipart = false) {
        try {
            const headers = getHeaders(token);
            if (!isMultipart) {
                headers['Content-Type'] = 'application/json';
            } else {
                delete headers['Content-Type']; // Let browser set boundary for multipart
            }

            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/groups/${groupId}/products/`, {
                method: 'POST',
                headers,
                body: isMultipart ? data : JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Create AR Product Error:', error);
            throw error;
        }
    },

    async updateARProduct(eventId, productId, token, data, isMultipart = false) {
        try {
            const headers = getHeaders(token);
            if (!isMultipart) {
                headers['Content-Type'] = 'application/json';
            } else {
                delete headers['Content-Type'];
            }

            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/products/${productId}/`, {
                method: 'PATCH',
                headers,
                body: isMultipart ? data : JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Update AR Product Error:', error);
            throw error;
        }
    },

    async deleteARProduct(eventId, productId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/additional-requirements/products/${productId}/`, {
                method: 'DELETE',
                headers: getHeaders(token)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Delete AR Product Error:', error);
            throw error;
        }
    }
};
