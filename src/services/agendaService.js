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

export const agendaService = {
    async getAgendas(eventId, token, page = 1, size = 20, search = '') {
        try {
            const queryParams = new URLSearchParams({
                page,
                size,
                search
            });

            const response = await fetch(`${getApiUrl()}/events/${eventId}/agenda/list/?${queryParams}`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get Agendas Error:', error);
            throw error;
        }
    },

    async createAgenda(eventId, token, formData) {
        try {
            const headers = getHeaders(token);
            // Browser sets Content-Type for FormData

            const response = await fetch(`${getApiUrl()}/events/${eventId}/agenda/create/`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || result.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Create Agenda Error:', error);
            throw error;
        }
    },

    async updateAgenda(eventId, agendaId, token, formData) {
        try {
            const headers = getHeaders(token);

            const response = await fetch(`${getApiUrl()}/events/${eventId}/agenda/${agendaId}/edit/`, {
                method: 'PATCH',
                headers: headers,
                body: formData
            });

            if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(result.error || result.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update Agenda Error:', error);
            throw error;
        }
    },

    async deleteAgenda(eventId, agendaId, token) {
        // Based on typical pattern, if delete exists
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/agenda/${agendaId}/delete/`, {
                method: 'DELETE',
                headers: getHeaders(token)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Delete Agenda Error:', error);
            throw error;
        }
    }
};
