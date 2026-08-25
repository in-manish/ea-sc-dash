/** Compact outcome line for import list rows. */
export function importOutcomeSummary(job) {
  const created = Number(job?.created_count) || 0;
  const updated = Number(job?.updated_count) || 0;
  const failed = Number(job?.failed_count) || 0;
  return { created, updated, failed, total: created + updated + failed };
}

export function importTagList(job) {
  const tags = job?.tags;
  if (!Array.isArray(tags)) return [];
  return tags.map((t) => (typeof t === 'string' ? t : t?.name)).filter(Boolean);
}

/** Mapping summary: email column + property column count. */
export function importMappingSummary(job) {
  const mapping = job?.mapping;
  if (!mapping || typeof mapping !== 'object') {
    return { emailColumn: null, propertyCount: 0 };
  }
  const emailColumn = mapping.email_column || null;
  const props = mapping.properties;
  const propertyCount = Array.isArray(props)
    ? props.length
    : props && typeof props === 'object'
      ? Object.keys(props).length
      : 0;
  return { emailColumn, propertyCount };
}

export function importHasFile(job) {
  return Boolean(job?.file || job?.original_file_name);
}
