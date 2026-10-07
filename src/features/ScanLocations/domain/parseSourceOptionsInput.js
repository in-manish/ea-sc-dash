/**
 * Read the options pasted or uploaded as JSON. Accepts an array of options, {"options": [...]}, a single
 * {"source_option": {...}}, or an array of {"source_option": {...}, "target_options": [...]} items.
 * Targets are ignored: the mapping is chosen on the screen.
 */
export function parseSourceOptionsInput(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return { options: [], error: 'Paste or upload the options first.' };
  let data;
  try {
    data = JSON.parse(trimmed);
  } catch {
    return { options: [], error: 'That is not valid JSON.' };
  }
  let items = null;
  if (Array.isArray(data)) items = data;
  else if (Array.isArray(data?.options)) items = data.options;
  else if (data?.source_option) items = [data];
  if (!items) return { options: [], error: 'Use an array of options, for example [{"id": "119", "title": "..."}].' };

  const options = items
    .map((item) => (item && typeof item === 'object' && item.source_option ? item.source_option : item))
    .filter((item) => item && typeof item === 'object');
  if (options.length === 0) return { options: [], error: 'No options found.' };
  if (options.some((item) => String(item.id ?? '').trim() === '')) {
    return { options: [], error: 'Every option needs an id.' };
  }
  return { options, error: '' };
}
