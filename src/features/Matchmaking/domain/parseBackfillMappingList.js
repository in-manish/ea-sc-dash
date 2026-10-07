/** Normalize GET surveyjs-backfill/mapping/ response. */
export function parseBackfillMappingList(data) {
    if (!data || typeof data !== 'object') {
        return { forms: [], count: 0, results: [] };
    }
    return {
        forms: Array.isArray(data.forms) ? data.forms.map(String) : [],
        count: Number(data.count) || 0,
        results: Array.isArray(data.results) ? data.results : [],
    };
}
