/**
 * One page of GET badge-permissions.
 * Shape: { data: { data: rows, total, page, totalPages } }. An older bare array is a single page.
 */
export function purchasePage(body) {
  const data = body?.data;
  if (Array.isArray(data)) return { rows: data, totalPages: 1, total: data.length };
  const rows = Array.isArray(data?.data) ? data.data : [];
  const reported = Number(data?.totalPages);
  const total = Number(data?.total);
  let totalPages = Number.isFinite(reported) && reported >= 1 ? reported : 1;
  if (Number.isFinite(total) && rows.length > 0 && total > rows.length) {
    totalPages = Math.max(totalPages, Math.ceil(total / rows.length));
  }
  return { rows, totalPages, total: Number.isFinite(total) ? total : rows.length };
}
