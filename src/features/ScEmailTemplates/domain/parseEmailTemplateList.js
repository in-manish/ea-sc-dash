const EMPTY_FILTERS = {
  template_type: [],
  audience: [],
  event: [],
  titles: [],
  from_sender_name: [],
};

export function parseEmailTemplateList(data = {}) {
  const filters = data.filters && typeof data.filters === 'object' ? data.filters : {};
  return {
    count: Number(data.count) || 0,
    results: Array.isArray(data.results) ? data.results : [],
    filters: {
      template_type: Array.isArray(filters.template_type) ? filters.template_type : [],
      audience: Array.isArray(filters.audience) ? filters.audience : [],
      event: Array.isArray(filters.event) ? filters.event : [],
      titles: Array.isArray(filters.titles) ? filters.titles : [],
      from_sender_name: Array.isArray(filters.from_sender_name) ? filters.from_sender_name : [],
    },
  };
}

export function emptyEmailTemplateList() {
  return { count: 0, results: [], filters: EMPTY_FILTERS };
}
