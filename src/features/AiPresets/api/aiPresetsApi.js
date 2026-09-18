import { getApiUrl } from '../../../config';
import { MATCHMAKING_PRESET_KEY } from '../constants';
import { normalizePresetList } from '../domain/normalizePresetList';
import { parseAiPresetError } from '../domain/parseAiPresetError';
import { buildPreviewQuery } from '../domain/previewQuery';

function authHeaders(token, json = false) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
    ...(json ? { 'Content-Type': 'application/json' } : {}),
  };
}

async function throwIfFailed(response) {
  if (response.ok || response.status === 204) return;
  const result = await response.json().catch(() => ({}));
  throw parseAiPresetError(result, response.status);
}

function presetUrl(keyOrId) {
  return `${getApiUrl()}/ai/presets/${encodeURIComponent(keyOrId)}/`;
}

/** GET /ai/presets/ */
export async function listPresets(token) {
  const response = await fetch(`${getApiUrl()}/ai/presets/`, {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return normalizePresetList(await response.json());
}

/** GET /ai/presets/:keyOrId/ */
export async function getPreset(token, keyOrId) {
  const response = await fetch(presetUrl(keyOrId), {
    method: 'GET',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
  return response.json();
}

/** POST /ai/presets/ — 201 created. */
export async function createPreset(token, payload) {
  const response = await fetch(`${getApiUrl()}/ai/presets/`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  await throwIfFailed(response);
  return response.json();
}

/** PATCH /ai/presets/:keyOrId/ — only fields to change. */
export async function patchPreset(token, keyOrId, payload) {
  const response = await fetch(presetUrl(keyOrId), {
    method: 'PATCH',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  await throwIfFailed(response);
  return response.json();
}

/** PUT /ai/presets/:keyOrId/ — full writable object. */
export async function putPreset(token, keyOrId, payload) {
  const response = await fetch(presetUrl(keyOrId), {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  });
  await throwIfFailed(response);
  return response.json();
}

/** DELETE /ai/presets/:id/ — 204 empty body. Numeric id only. */
export async function deletePreset(token, id) {
  const response = await fetch(presetUrl(id), {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  await throwIfFailed(response);
}

/**
 * GET /ai/presets/mm_seeking_mapper/preview/?event_id=
 * Fills the matchmaking catalog. Does not call the LLM.
 * Optional: user_query, filters (people-list pill JSON).
 */
export async function previewSeekingMapper(token, { eventId, userQuery, filters } = {}) {
  const query = buildPreviewQuery({ eventId, userQuery, filters });
  const response = await fetch(
    `${getApiUrl()}/ai/presets/${MATCHMAKING_PRESET_KEY}/preview/?${query}`,
    { method: 'GET', headers: authHeaders(token) },
  );
  await throwIfFailed(response);
  return response.json();
}

export const aiPresetsApi = {
  listPresets,
  getPreset,
  createPreset,
  patchPreset,
  putPreset,
  deletePreset,
  previewSeekingMapper,
};
