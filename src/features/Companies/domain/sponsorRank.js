/** Positive whole-number sponsor rank (1, 2, 3…), or null when unset or invalid. */
export function positiveSponsorRank(value) {
  if (value == null || String(value).trim() === '') return null;
  const n = Number(String(value).trim());
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}
