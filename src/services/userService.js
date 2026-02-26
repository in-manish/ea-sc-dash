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
    };
};

export const userService = {
    /**
     * List staff users of the given type for the event.
     * @param {string|number} eventId 
     * @param {string} orgType One of: print, scan, kiosk, staff-readonly, staff-writereadonly
     * @param {string} token 
     */
    async getStaffUsers(eventId, orgType, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/staff/${orgType}/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Staff Users Error:', error);
            throw error;
        }
    },

    /**
     * Create a new staff user.
     * @param {string|number} eventId 
     * @param {string} orgType 
     * @param {string} token 
     * @param {Object} userData { username, password }
     */
    async createStaffUser(eventId, orgType, token, userData) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/staff/${orgType}/`, {
                method: 'POST',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Create Staff User Error:', error);
            throw error;
        }
    },

    /**
     * Get one staff user by ID.
     * @param {string|number} eventId 
     * @param {string} orgType 
     * @param {string|number} userId 
     * @param {string} token 
     */
    async getStaffUserDetails(eventId, orgType, userId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/staff/${orgType}/${userId}/`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Staff User Details Error:', error);
            throw error;
        }
    },

    /**
     * Update username and/or password of a staff user.
     * @param {string|number} eventId 
     * @param {string} orgType 
     * @param {string|number} userId 
     * @param {string} token 
     * @param {Object} userData { username, password } (optional)
     */
    async updateStaffUser(eventId, orgType, userId, token, userData) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/staff/${orgType}/${userId}/`, {
                method: 'PATCH',
                headers: {
                    ...getHeaders(token),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update Staff User Error:', error);
            throw error;
        }
    },

    /**
     * Delete a staff user.
     * @param {string|number} eventId 
     * @param {string} orgType 
     * @param {string|number} userId 
     * @param {string} token 
     */
    async deleteStaffUser(eventId, orgType, userId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/staff/${orgType}/${userId}/`, {
                method: 'DELETE',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Delete Staff User Error:', error);
            throw error;
        }
    }
};
