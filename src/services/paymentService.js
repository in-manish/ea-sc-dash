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

export const paymentService = {
    // -- Admin Payment Management (Organizer) --

    getAdminPayments: async (token, params = {}) => {
        const queryParams = new URLSearchParams(params);
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await fetch(`${getApiUrl()}/payment/admin-list/${queryString}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    exportAdminPayments: async (token, params = {}) => {
        const queryParams = new URLSearchParams({ ...params, export: 'csv' });
        const response = await fetch(`${getApiUrl()}/payment/admin-list/?${queryParams.toString()}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.blob();
    },

    refundAdminPayment: async (token, data) => {
        const response = await fetch(`${getApiUrl()}/payment/admin-list/`, {
            method: 'POST',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    updatePaymentStatus: async (token, data) => {
        const response = await fetch(`${getApiUrl()}/payment/admin-list/`, {
            method: 'PUT',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    cancelPayment: async (token, paymentId) => {
        const response = await fetch(`${getApiUrl()}/payment/admin-list/`, {
            method: 'DELETE',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payment_id: paymentId })
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    // -- Config APIs --

    getPaymentMode: async (token) => {
        const response = await fetch(`${getApiUrl()}/payment/mode/`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    setPaymentMode: async (token, mode) => {
        const response = await fetch(`${getApiUrl()}/payment/mode/`, {
            method: 'PUT',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mode })
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    getConfigs: async (token) => {
        const response = await fetch(`${getApiUrl()}/payment/config/`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    createConfig: async (token, data) => {
        const response = await fetch(`${getApiUrl()}/payment/config/`, {
            method: 'POST',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    testConfig: async (token, data) => {
        const response = await fetch(`${getApiUrl()}/payment/config/`, {
            method: 'PUT',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    deactivateConfig: async (token, configId) => {
        const response = await fetch(`${getApiUrl()}/payment/config/`, {
            method: 'DELETE',
            headers: {
                ...getHeaders(token),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ config_id: configId })
        });
        if (!response.ok) {
            let errData;
            try { errData = await response.json(); } catch (e) { }
            throw { response: { data: errData } };
        }
        return await response.json();
    },

    // -- Currency APIs --

    getCurrencies: async (token, search = '', limit = 50) => {
        const queryParams = new URLSearchParams({ search, limit });
        const response = await fetch(`${getApiUrl()}/payment/currencies/?${queryParams.toString()}`, {
            method: 'GET',
            headers: getHeaders(token)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    }
};
