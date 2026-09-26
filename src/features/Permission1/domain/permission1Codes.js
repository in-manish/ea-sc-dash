/**
 * Event permission1 code map and the attendee "A|B" wire format.
 *
 * Example: permission1WireValue(['a', 'B']) -> "A|B"
 */

const CODE_RE = /^[A-Z0-9]$/;
const CODE_SEQUENCE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

/** Next free code, letters first: A, then B, then C. */
export function nextPermission1Code(rows) {
  const used = new Set(
    (rows || [])
      .map((row) => String(row?.code || '').trim().toUpperCase())
      .filter((code) => CODE_RE.test(code)),
  );
  return CODE_SEQUENCE.find((code) => !used.has(code)) || '';
}

/** Letters and digits still available for this row, including its current code. */
export function permission1CodeChoices(rows, index) {
  const used = new Set();
  (rows || []).forEach((row, rowIndex) => {
    if (rowIndex === index) return;
    const code = String(row?.code || '').trim().toUpperCase();
    if (CODE_RE.test(code)) used.add(code);
  });
  const choices = CODE_SEQUENCE.filter((code) => !used.has(code));
  const current = String(rows?.[index]?.code || '').trim().toUpperCase();
  if (CODE_RE.test(current) && !choices.includes(current)) {
    return [current, ...choices];
  }
  return choices;
}

export function permission1CodeMap(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const map = {};
  Object.entries(value).forEach(([key, label]) => {
    map[String(key)] = label == null ? '' : String(label);
  });
  return map;
}

export function codeMapToRows(value) {
  return Object.entries(permission1CodeMap(value)).map(([code, label]) => ({
    code: String(code).trim().toUpperCase(),
    label: String(label),
  }));
}

/** Drop incomplete rows. Call only after validatePermission1Rows passes. */
export function rowsToCodeMap(rows) {
  const map = {};
  (rows || []).forEach((row) => {
    const code = String(row?.code || '').trim().toUpperCase();
    const label = String(row?.label || '').trim();
    if (!CODE_RE.test(code) || !label) return;
    map[code] = label;
  });
  return map;
}

/** Error string, or null when the rows can be saved. */
export function validatePermission1Rows(rows) {
  const seen = new Set();
  for (const row of rows || []) {
    const code = String(row?.code || '').trim().toUpperCase();
    const label = String(row?.label || '').trim();
    if (!code && !label) continue;
    if (!CODE_RE.test(code)) {
      return 'Each permission 1 code must be one letter or digit.';
    }
    if (seen.has(code)) {
      return `Permission 1 code "${code}" is listed more than once.`;
    }
    seen.add(code);
    if (!label) return `Permission 1 code "${code}" needs a label.`;
  }
  return null;
}

export function permission1Selection(value) {
  const parts = Array.isArray(value)
    ? value
    : String(value || '').split('|');
  const codes = [];
  parts.forEach((part) => {
    const code = String(part || '').trim().toUpperCase();
    if (code && !codes.includes(code)) codes.push(code);
  });
  return codes;
}

/**
 * Create omits an empty selection. Update sends "|" so the API clears stored codes.
 * Example: permission1WireValue([], { clearWhenEmpty: true }) -> "|"
 */
export function permission1WireValue(codes, { clearWhenEmpty = false } = {}) {
  const list = permission1Selection(codes);
  if (!list.length) return clearWhenEmpty ? '|' : null;
  return list.join('|');
}

/** Omit the field when the event has no codes, so a blank map does not clear the badge. */
export function permission1PatchValue(codes, codeMap) {
  const configured = Object.keys(rowsToCodeMap(codeMapToRows(codeMap)));
  if (!configured.length) return null;
  return permission1WireValue(codes, { clearWhenEmpty: true });
}
