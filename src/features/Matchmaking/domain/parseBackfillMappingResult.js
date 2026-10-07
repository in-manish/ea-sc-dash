const asIssueList = (items) =>
    (Array.isArray(items) ? items : [])
        .map((item) => ({
            row: item?.row ?? null,
            reason: item?.reason || item?.message || String(item || ''),
        }))
        .filter((item) => item.reason);

/** Normalize mapping-csv dry-run / save response for the UI. */
export function parseBackfillMappingResult(data) {
    if (!data || typeof data !== 'object') {
        return {
            saved: 0,
            ignored: [],
            warnings: [],
            errors: [],
            forms: [],
            dryRun: false,
            uploadId: null,
        };
    }
    return {
        saved: Number(data.saved) || 0,
        ignored: asIssueList(data.ignored),
        warnings: asIssueList(data.warnings),
        errors: asIssueList(data.errors),
        forms: Array.isArray(data.forms) ? data.forms.map(String) : [],
        dryRun: Boolean(data.dry_run),
        uploadId: data.upload_id == null ? null : data.upload_id,
    };
}

export const BACKFILL_LOG_STATUSES = ['done', 'no_badge', 'no_mapping', 'error'];

export function parseBackfillLogs(data) {
    const counts = data?.counts && typeof data.counts === 'object' ? data.counts : {};
    return {
        counts,
        total: Number(data?.total) || 0,
        page: Number(data?.page) || 1,
        pageSize: Number(data?.page_size) || 50,
        results: Array.isArray(data?.results) ? data.results : [],
    };
}
