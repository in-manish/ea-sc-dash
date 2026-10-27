import { ratingRequest } from './ratingHttp';

/** Admin config endpoints (organizer only): `rating/types/`, `rating/applicable-ratings/`, `rating/options/`. */
export const listRatingTypes = (token) => ratingRequest(token, 'rating/types/');
export const createRatingType = (token, body) => ratingRequest(token, 'rating/types/', { method: 'POST', body });
export const updateRatingType = (token, id, body) =>
  ratingRequest(token, `rating/types/${id}/`, { method: 'PATCH', body });
export const deleteRatingType = (token, id) => ratingRequest(token, `rating/types/${id}/`, { method: 'DELETE' });

export const listScales = (token, typeId) =>
  ratingRequest(token, 'rating/applicable-ratings/', { query: { rating_type_id: typeId } });
export const createScale = (token, body) =>
  ratingRequest(token, 'rating/applicable-ratings/', { method: 'POST', body });
export const updateScale = (token, id, body) =>
  ratingRequest(token, `rating/applicable-ratings/${id}/`, { method: 'PATCH', body });
export const deleteScale = (token, id) =>
  ratingRequest(token, `rating/applicable-ratings/${id}/`, { method: 'DELETE' });

// Always filter by one scale: the unfiltered list groups by rating value, which merges different types.
export const listOptionsForScale = (token, scaleId) =>
  ratingRequest(token, 'rating/options/', { query: { applicable_rating_id: scaleId } });
export const createOption = (token, body) => ratingRequest(token, 'rating/options/', { method: 'POST', body });
export const updateOption = (token, id, body) =>
  ratingRequest(token, `rating/options/${id}/`, { method: 'PATCH', body });
export const deleteOption = (token, id) => ratingRequest(token, `rating/options/${id}/`, { method: 'DELETE' });
