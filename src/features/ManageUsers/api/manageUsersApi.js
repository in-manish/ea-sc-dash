import { getApiUrl } from '../../../config';

const authHeaders = (token) => ({
    Accept: 'application/json, text/plain, */*',
    Authorization: `Token ${token}`,
});

const parseError = async (response, fallback) => {
    const body = await response.json().catch(() => ({}));
    const message = body.message || body.detail || fallback;
    const err = new Error(message);
    err.status = response.status;
    err.body = body;
    return err;
};

/**
 * Paginated organizer user list with filters/search.
 * @param {string} token
 * @param {Object} options
 */
export async function listManageUsers(token, options = {}) {
    const {
        search,
        permission,
        email,
        phone_number,
        username,
        page = 1,
        size = 20,
    } = options;

    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('size', String(size));
    if (search?.trim()) params.set('search', search.trim());
    if (permission?.trim()) params.set('permission', permission.trim());
    if (email?.trim()) params.set('email', email.trim());
    if (phone_number?.trim()) params.set('phone_number', phone_number.trim());
    if (username?.trim()) params.set('username', username.trim());

    const response = await fetch(`${getApiUrl()}/manage/users/?${params.toString()}`, {
        method: 'GET',
        headers: authHeaders(token),
    });

    if (response.status === 401 || response.status === 403) {
        const err = new Error('Organizer access required to manage users.');
        err.status = response.status;
        throw err;
    }

    if (!response.ok) {
        throw await parseError(response, `Failed to load users (${response.status})`);
    }

    const json = await response.json();
    return {
        total: json.total ?? 0,
        page: json.page ?? page,
        size: json.size ?? size,
        data: Array.isArray(json.data) ? json.data : [],
    };
}

/**
 * Create a user (organizer manage API).
 * Requires username, password, and at least one of email or phone_number.
 * @param {string} token
 * @param {Object} payload
 */
export async function createManageUser(token, payload) {
    const response = await fetch(`${getApiUrl()}/manage/users/`, {
        method: 'POST',
        headers: {
            ...authHeaders(token),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 401 || response.status === 403) {
        const err = new Error('Organizer access required to create users.');
        err.status = response.status;
        throw err;
    }

    if (!response.ok) {
        throw await parseError(response, `Failed to create user (${response.status})`);
    }

    return response.json();
}

/**
 * Fetch one user by id with permissions.
 * @param {string} token
 * @param {string|number} userId
 */
export async function getManageUser(token, userId) {
    const response = await fetch(`${getApiUrl()}/manage/users/${userId}/`, {
        method: 'GET',
        headers: authHeaders(token),
    });

    if (response.status === 401 || response.status === 403) {
        const err = new Error('Organizer access required to view users.');
        err.status = response.status;
        throw err;
    }

    if (response.status === 404) {
        throw await parseError(response, 'User not found.');
    }

    if (!response.ok) {
        throw await parseError(response, `Failed to load user (${response.status})`);
    }

    return response.json();
}

/**
 * Patch profile fields and/or password. Does not change permissions.
 * After update, user must still have email or phone_number.
 */
export async function updateManageUser(token, userId, payload) {
    const response = await fetch(`${getApiUrl()}/manage/users/${userId}/`, {
        method: 'PATCH',
        headers: {
            ...authHeaders(token),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (response.status === 401 || response.status === 403) {
        const err = new Error('Organizer access required to update users.');
        err.status = response.status;
        throw err;
    }

    if (response.status === 404) {
        throw await parseError(response, 'User not found.');
    }

    if (!response.ok) {
        throw await parseError(response, `Failed to update user (${response.status})`);
    }

    return response.json();
}

/**
 * Replace user permissions (full set).
 * @param {string} token
 * @param {string|number} userId
 * @param {string[]} permissions
 */
export async function setManageUserPermissions(token, userId, permissions) {
    const response = await fetch(`${getApiUrl()}/manage/users/${userId}/permissions/`, {
        method: 'PUT',
        headers: {
            ...authHeaders(token),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: Array.isArray(permissions) ? permissions : [] }),
    });

    if (response.status === 401 || response.status === 403) {
        const err = new Error('Organizer access required to update permissions.');
        err.status = response.status;
        throw err;
    }

    if (response.status === 404) {
        throw await parseError(response, 'User not found.');
    }

    if (!response.ok) {
        throw await parseError(response, `Failed to update permissions (${response.status})`);
    }

    return response.json();
}
