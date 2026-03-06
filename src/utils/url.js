import { getApiUrl } from '../config';

export const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${getApiUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
};
