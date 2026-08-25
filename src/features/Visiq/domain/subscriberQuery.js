/** Build GET /visiq/subscribers/ query string. */
export function buildSubscriberQuery({ page = 1, size = 10, search = '', status = '' } = {}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('size', String(size));
  const q = String(search || '').trim();
  if (q) params.set('search', q);
  if (status) params.set('status', status);
  return params.toString();
}

export function normalizeSubscriberPage(payload) {
  if (Array.isArray(payload)) {
    return { count: payload.length, results: payload, next: null, previous: null };
  }
  return {
    count: Number(payload?.count) || 0,
    results: Array.isArray(payload?.results) ? payload.results : [],
    next: payload?.next || null,
    previous: payload?.previous || null,
  };
}
