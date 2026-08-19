/** Server Content-Disposition filename: Event-{eventId}-ExhibitorReport.csv */
export function defaultExhibitorReportFilename(eventId) {
  return `Event-${eventId}-ExhibitorReport.csv`;
}

export function filenameFromContentDisposition(header, fallback) {
  if (!header) return fallback;

  const encoded = header.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i);
  if (encoded) {
    const raw = encoded[1].trim().replace(/^["']|["']$/g, '');
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw || fallback;
    }
  }

  const quoted = header.match(/filename\s*=\s*"([^"]+)"/i);
  if (quoted?.[1]) return quoted[1];

  const plain = header.match(/filename\s*=\s*([^;]+)/i);
  if (plain?.[1]) return plain[1].trim().replace(/^["']|["']$/g, '') || fallback;

  return fallback;
}

export function saveExhibitorReportBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
