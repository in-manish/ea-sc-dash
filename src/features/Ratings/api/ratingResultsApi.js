import { ratingRequest } from './ratingHttp';

/** GET rating/profile/summary/ — needs `evc_id` or `badge_uuid`. */
export const getRatingSummary = (token, query) => ratingRequest(token, 'rating/profile/summary/', { query });

/** GET rating/profile/detail/ — paginated ratings received, plus analytics. */
export const getRatingDetail = (token, query) => ratingRequest(token, 'rating/profile/detail/', { query });
