/** attendee_page_sponsor_detail: free-form object; these three keys get their own inputs, the rest is edited as JSON. */
export const SPONSOR_KNOWN_KEYS = ['title', 'background_image', 'website'];

export function sponsorDetailOf(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function sponsorExtras(value) {
    const detail = sponsorDetailOf(value);
    return Object.fromEntries(Object.entries(detail).filter(([key]) => !SPONSOR_KNOWN_KEYS.includes(key)));
}

/** Merge the three known inputs and the extra keys; empty known values are left out. */
export function buildSponsorDetail(known, extras) {
    const detail = { ...extras };
    SPONSOR_KNOWN_KEYS.forEach((key) => {
        const val = known[key];
        if (val !== undefined && val !== null && String(val) !== '') detail[key] = val;
    });
    return detail;
}

/** Parse the extras textarea: '' -> {}, a JSON object -> object, anything else -> null (invalid). */
export function parseSponsorExtras(text) {
    if (!String(text).trim()) return {};
    try {
        const parsed = JSON.parse(text);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}
