/** Parse CSV text into headers + row objects for in-browser preview. */
export function parseCsvText(text, { maxRows = 50 } = {}) {
  const lines = String(text || '')
    .replace(/^\uFEFF/, '')
    .split(/\r\n|\n|\r/)
    .filter((line) => line.trim() !== '');
  if (!lines.length) {
    return { headers: [], rows: [], truncated: false, rowCount: 0 };
  }

  const headers = splitCsvLine(lines[0]);
  const rows = [];
  let truncated = false;
  for (let i = 1; i < lines.length; i += 1) {
    if (rows.length >= maxRows) {
      truncated = true;
      break;
    }
    const cells = splitCsvLine(lines[i]);
    if (!cells.some((c) => String(c || '').trim() !== '')) continue;
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });
    rows.push(row);
  }
  return { headers, rows, truncated, rowCount: rows.length };
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  cells.push(current);
  return cells.map((c) => c.trim());
}

export function isCsvFileName(name) {
  return /\.csv$/i.test(String(name || ''));
}
