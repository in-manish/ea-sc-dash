export const MAX_HTML_FILE_BYTES = 1024 * 1024;

export function mergeImportedHtml(current, imported, mode) {
  const existing = String(current || '');
  const next = String(imported || '');
  if (!existing.trim() || mode === 'replace') return next;
  return `${existing}\n${next}`;
}

export function extractEmailHtml(text) {
  const raw = String(text || '').trim();
  if (!raw) return '';
  const isDocument = /<html[\s>]/i.test(raw) || /<body[\s>]/i.test(raw);
  if (!isDocument) return raw;

  const styles = [...raw.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi)]
    .map((match) => match[0])
    .join('\n');
  const body = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const inner = body ? body[1].trim() : raw;
  return [styles, inner].filter(Boolean).join('\n');
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
    reader.onload = () => {
      try {
        resolve(extractEmailHtml(String(reader.result || '')));
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Could not read that file.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsText(file);
  });
}
