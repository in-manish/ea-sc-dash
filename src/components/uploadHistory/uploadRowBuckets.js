/** Split an upload record into total / success / rejected row lists. */
export function uploadRowBuckets(rec) {
    const successRows = Array.isArray(rec.success) ? rec.success : [];
    const rejectedRows = Array.isArray(rec.rejectee) ? rec.rejectee : [];
    const allRows = Array.isArray(rec.upload_data) ? rec.upload_data : [];
    const totalCount = allRows.length || successRows.length + rejectedRows.length;
    return { successRows, rejectedRows, allRows, totalCount };
}
