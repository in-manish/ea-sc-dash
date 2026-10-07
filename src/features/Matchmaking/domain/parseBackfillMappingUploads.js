import { parseBackfillMappingResult } from './parseBackfillMappingResult';

function formatBytes(n) {
    const size = Number(n) || 0;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function parseUploader(value) {
    if (!value || typeof value !== 'object') return null;
    return {
        id: value.id ?? null,
        username: value.username || '',
        email: value.email || '',
    };
}

export function parseMappingUploadRow(row) {
    if (!row || typeof row !== 'object') return null;
    return {
        id: row.id,
        fileName: row.file_name || 'mapping.csv',
        fileSize: Number(row.file_size) || 0,
        fileSizeLabel: formatBytes(row.file_size),
        checksum: row.checksum_sha256 || '',
        forms: Array.isArray(row.forms) ? row.forms.map(String) : [],
        saved: Number(row.saved) || 0,
        errorCount: Number(row.error_count) || 0,
        warningCount: Number(row.warning_count) || 0,
        ignoredCount: Number(row.ignored_count) || 0,
        uploadedBy: parseUploader(row.uploaded_by),
        createdAt: row.created_at || null,
        content: typeof row.content === 'string' ? row.content : null,
        report: row.report ? parseBackfillMappingResult(row.report) : null,
    };
}

export function parseMappingUploadList(data) {
    const results = Array.isArray(data?.results)
        ? data.results.map(parseMappingUploadRow).filter(Boolean)
        : [];
    return {
        total: Number(data?.total) || 0,
        page: Number(data?.page) || 1,
        pageSize: Number(data?.page_size) || 20,
        results,
    };
}

export const MAPPING_UPLOAD_PAGE_SIZES = [20, 50, 100];
