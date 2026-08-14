export const MAX_HTML_FILE_BYTES = 1024 * 1024;

export function mergeImportedHtml(current, imported, mode) {
  const existing = String(current || '');
  const next = String(imported || '');
  if (!existing.trim() || mode === 'replace') return next;
  return `${existing}\n${next}`;
}

export function readHtmlFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'));
      return;
    }
    if (file.size > MAX_HTML_FILE_BYTES) {
      reject(new Error('File is larger than 1 MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsText(file);
  });
}
