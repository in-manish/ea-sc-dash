import { ACCEPT_TYPES, MAX_FILE_BYTES } from '../constants';

export function isAcceptedImage(file) {
  if (!file) return false;
  if (ACCEPT_TYPES.includes(file.type)) return true;
  const name = (file.name || '').toLowerCase();
  return /\.(jpe?g|png|webp|avif)$/.test(name);
}

export function validateImageFile(file) {
  if (!file) return 'No file selected.';
  if (!isAcceptedImage(file)) {
    return 'Unsupported file. Use JPG, PNG, WebP, or AVIF.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'File is too large (max 80 MB). Try a smaller image.';
  }
  return null;
}
