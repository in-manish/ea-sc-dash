import { buildFilterBody } from './attendeeFilters';

/** Types that share one template are sent as one entry. */
export function groupTemplates(templateByType) {
  const byTemplate = new Map();
  Object.entries(templateByType).forEach(([typeId, templateId]) => {
    if (!templateId) return;
    const list = byTemplate.get(templateId) || [];
    list.push(Number(typeId));
    byTemplate.set(templateId, list);
  });
  return [...byTemplate.entries()].map(([templateId, typeIds]) => ({
    attendee_type_ids: typeIds,
    template_id: Number(templateId),
  }));
}

/** Specific people (uuids) win over send_to_all, same as the API. */
export function buildSendBody(filters, { selectAll, selectedUuids, templateByType, maxCompanies }) {
  const body = {
    ...buildFilterBody(filters),
    templates: groupTemplates(templateByType),
    max_companies: maxCompanies,
  };
  if (selectAll) body.send_to_all = true;
  else body.uuids = selectedUuids;
  return body;
}

export function missingTemplateTypeIds(typeIds, templateByType) {
  return typeIds.filter((id) => !templateByType[id]);
}
