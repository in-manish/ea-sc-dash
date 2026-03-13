import { getApiUrl } from '../config';

const getHeaders = (token) => {
    const baseUrl = getApiUrl();
    const origin = new URL(baseUrl).origin;

    return {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Origin': origin,
        'Referer': `${origin}/`,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
    };
};

export const companyProductService = {
    async getCompanyProducts(eventId, token, options = {}) {
        const { page = 1, page_size = 20, search = '', is_active } = options;
        try {
            const queryParams = new URLSearchParams({
                page,
                page_size,
            });
            if (search) queryParams.append('search', search);
            if (is_active !== undefined) queryParams.append('is_active', is_active);

            const response = await fetch(`${getApiUrl()}/events/${eventId}/company-products/?${queryParams}`, {
                method: 'GET',
                headers: getHeaders(token)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Get Company Products Error:', error);
            throw error;
        }
    },

    async createCompanyProduct(eventId, token, data) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/company-products/`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Create Company Product Error:', error);
            throw error;
        }
    },

    async updateCompanyProduct(eventId, productId, token, data) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/company-products/${productId}/`, {
                method: 'PATCH',
                headers: getHeaders(token),
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Update Company Product Error:', error);
            throw error;
        }
    },

    async deleteCompanyProduct(eventId, productId, token) {
        try {
            const response = await fetch(`${getApiUrl()}/events/${eventId}/company-products/${productId}/`, {
                method: 'DELETE',
                headers: getHeaders(token)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Delete Company Product Error:', error);
            throw error;
        }
    },

    async copyCompanyProducts(targetEventId, token, sourceEventId, products) {
        // Based on the requirement "make api request with source detail for target event to create"
        // and following the logic of copyAdditionalRequirements in eventService, 
        // but here we might need to loop if there's no bulk copy endpoint.
        // Assuming we loop for now as no bulk copy is mentioned in the doc.
        try {
            const results = [];
            for (const product of products) {
                const newProduct = await this.createCompanyProduct(targetEventId, token, {
                    name: product.name,
                    is_active: product.is_active
                });
                results.push(newProduct);
            }
            return results;
        } catch (error) {
            console.error('Copy Company Products Error:', error);
            throw error;
        }
    }
};
