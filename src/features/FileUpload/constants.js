export const UPLOAD_ENDPOINT = '/uploads/files/';
export const HISTORY_LIMIT = 20;
export const DEFAULT_PANEL_POSITION = { x: 0, y: 80 };
export const PANEL_WIDTH = 360;
export const PANEL_HEIGHT = 520;

export const CONTENT_GROUPS = ['images', 'media-content', 'files'];

export const KEEP_NAME_MAX_LENGTH = 256;
/** Basename: letter/number/underscore, then letter/number/underscore/dot/space/hyphen/parentheses. */
export const KEEP_NAME_PATTERN = /^[A-Za-z0-9_][A-Za-z0-9_. ()-]{0,255}$/;

export const INVALID_FILE_NAME_MSG = 'Invalid file name';
export const LINK_REQUIRED_MSG = 'link is required when is_s3_link is true';
export const INVALID_FILE_LINK_MSG = 'Invalid or unsupported file link';
export const UPLOAD_FAILED_MSG = 'Unable to upload file.';
