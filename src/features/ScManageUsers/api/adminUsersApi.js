import { getApiUrl } from '../../../config';

const authHeaders = (token) => ({
  Accept: 'application/json',
  Authorization: `Token ${token}`,
});

const parseError = async (response, fallback) => {
  const body = await response.json().catch(() => ({}));
  const message = body.error || body.detail || body.message || fallback;
  const err = new Error(message);
  err.status = response.status;
  err.body = body;
  return err;
};

/** Admin: get one user. GET /evc/admin/users/{userId}/ */
export async function fetchAdminUser(token, userId) {
  const response = await fetch(
    `${getApiUrl()}/evc/admin/users/${userId}/`,
    { method: 'GET', headers: authHeaders(token) }
  );

  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'User not found'
        : response.status === 403
          ? 'Admin or staff access required'
          : `Failed to load user (${response.status})`;
    throw await parseError(response, fallback);
  }

  return response.json();
}
