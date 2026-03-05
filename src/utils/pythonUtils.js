/**
 * Converts a JS object to a Python-style literal string.
 * - Single quotes for strings
 * - True/False/None for booleans and null
 */
export const toPythonString = (obj) => {
    if (obj === null) return 'None';
    if (typeof obj === 'boolean') return obj ? 'True' : 'False';
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') {
        // Use single quotes and escape existing single quotes
        return `'${obj.replace(/'/g, "\\'")}'`;
    }
    if (Array.isArray(obj)) {
        return `[${obj.map(toPythonString).join(', ')}]`;
    }
    if (typeof obj === 'object') {
        const entries = Object.entries(obj).map(([k, v]) => `'${k}': ${toPythonString(v)}`);
        return `{${entries.join(', ')}}`;
    }
    return 'None';
};

/**
 * Sanitizes a Python-style literal string into a standard JSON string.
 */
export const pythonToJson = (str) => {
    if (typeof str !== 'string' || !str) return '{}';

    // Check if it's already valid JSON
    try {
        JSON.parse(str);
        return str;
    } catch (e) {
        // Basic replacement for common Python literals
        let sanitized = str
            .replace(/'/g, '"')
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false')
            .replace(/\bNone\b/g, 'null');

        // Try to validate the sanitized string
        try {
            JSON.parse(sanitized);
            return sanitized;
        } catch (err) {
            console.warn('Failed to fully sanitize Python string', err);
            return sanitized; // Return best effort
        }
    }
};

/**
 * Parses a Python-style literal string into a JS object.
 */
export const parsePythonString = (str) => {
    try {
        return JSON.parse(pythonToJson(cleanPythonString(str)));
    } catch (e) {
        return {};
    }
};

/**
 * Cleans a string by removing potential outer quotes (pasted from console/logs).
 */
export const cleanPythonString = (str) => {
    if (typeof str !== 'string') return str;
    let trimmed = str.trim();
    // Remove wrapping double quotes or single quotes
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return trimmed.substring(1, trimmed.length - 1).trim();
    }
    return trimmed;
};
