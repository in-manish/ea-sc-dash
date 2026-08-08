import { getApiUrl } from '../config';

const getAuthHeaders = (token) => ({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`,
});

const parseError = async (response) => {
    try {
        const data = await response.json();
        if (data.detail) return data.detail;
        if (Array.isArray(data)) return data.join(' ');
        const messages = Object.entries(data).flatMap(([field, errs]) =>
            (Array.isArray(errs) ? errs : [errs]).map((e) => `${field}: ${e}`)
        );
        return messages.join(' ') || 'Request failed';
    } catch {
        return 'Request failed';
    }
};

const fetchBrand = async (params) => {
    const response = await fetch(`${getApiUrl()}/brands/?${params}`, {
        headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
        const error = await parseError(response);
        throw Object.assign(new Error(error), { status: response.status });
    }
    return response.json();
};

export const brandService = {
    /** Public: resolve brand by portal hostname (no auth) */
    getBrandByPortalHost: async (host) => {
        const params = new URLSearchParams({ exhibitor_portal_host: host });
        return fetchBrand(params);
    },

    /** Public: resolve brand by website (no auth) */
    getBrandByWebsite: async (website) => {
        const params = new URLSearchParams({ website });
        return fetchBrand(params);
    },

    /** Fetch single brand by portal host and/or website (no auth) */
    getBrand: async ({ exhibitor_portal_host, website } = {}) => {
        const params = new URLSearchParams();
        if (exhibitor_portal_host?.trim()) params.set('exhibitor_portal_host', exhibitor_portal_host.trim());
        if (website?.trim()) params.set('website', website.trim());
        if (!params.toString()) {
            throw Object.assign(new Error('Provide exhibitor_portal_host or website.'), { status: 400 });
        }
        return fetchBrand(params);
    },

    /** Organizer: list all brands */
    listBrands: async (token) => {
        const response = await fetch(`${getApiUrl()}/brands/list/`, {
            headers: getAuthHeaders(token),
        });
        if (!response.ok) {
            const error = await parseError(response);
            throw Object.assign(new Error(error), { status: response.status });
        }
        return response.json();
    },

    /** Organizer: create brand */
    createBrand: async (token, payload) => {
        const response = await fetch(`${getApiUrl()}/brands/create/`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await parseError(response);
            throw Object.assign(new Error(error), { status: response.status });
        }
        return response.json();
    },

    /** Organizer: partial update brand */
    updateBrand: async (token, brandId, payload) => {
        const response = await fetch(`${getApiUrl()}/brands/${brandId}/`, {
            method: 'PATCH',
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await parseError(response);
            throw Object.assign(new Error(error), { status: response.status });
        }
        return response.json();
    },
};
