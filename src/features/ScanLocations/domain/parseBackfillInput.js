const KEYS = ['uuid', 'surveyjs_attendee_permission'];

function csvRow(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell.trim());
      cell = '';
    } else cell += char;
  }
  cells.push(cell.trim());
  return cells;
}

/**
 * Backfill records from JSON ([{uuid, surveyjs_attendee_permission}]) or CSV with that header row.
 * An option cell may hold several ids, for example "119,120".
 */
export function parseBackfillInput(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return { records: [], error: 'Paste or upload the records first.' };
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    let data;
    try {
      data = JSON.parse(trimmed);
    } catch {
      return { records: [], error: 'That is not valid JSON.' };
    }
    const records = Array.isArray(data) ? data : data?.records;
    if (!Array.isArray(records) || records.length === 0) return { records: [], error: 'Use a list of records.' };
    return { records, error: '' };
  }
  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim());
  const header = csvRow(lines[0]).map((cell) => cell.toLowerCase());
  const missing = KEYS.filter((key) => !header.includes(key));
  if (missing.length) return { records: [], error: `The CSV needs the columns ${KEYS.join(', ')}.` };
  const records = lines.slice(1).map((line) => {
    const cells = csvRow(line);
    return Object.fromEntries(KEYS.map((key) => [key, cells[header.indexOf(key)] || '']));
  });
  if (records.length === 0) return { records: [], error: 'The CSV has no rows.' };
  return { records, error: '' };
}
