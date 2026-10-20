/** Boost scope helpers. boost_scope is a list of products/categories; empty = boost on every listing. */
export function boostScopeList(scope) {
  return Array.isArray(scope) ? scope.map((s) => String(s).trim()).filter(Boolean) : [];
}

export function boostScopeToText(scope) {
  return boostScopeList(scope).join(', ');
}

/** Add (or remove, if present) a value, ignoring case. */
export function toggleBoostScope(scope, name) {
  const key = String(name).trim().toLowerCase();
  if (!key) return scope;
  return scope.some((s) => s.toLowerCase() === key)
    ? scope.filter((s) => s.toLowerCase() !== key)
    : [...scope, String(name).trim()];
}

/** Short label for a boosted company, or null when not boosted. */
export function boostLabel(company, positiveRank) {
  if (positiveRank == null) return null;
  const scope = boostScopeList(company?.boost_scope);
  return scope.length ? `Boost #${positiveRank} (${scope.join(', ')})` : `Boost #${positiveRank}`;
}
