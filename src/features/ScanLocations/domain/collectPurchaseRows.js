import { purchasePage } from './purchasePage';

export const PURCHASE_PAGE_SIZE = 100;
const MAX_PAGES = 200;

/**
 * Walk badge-permissions page by page (`page` + `size`) until every page is in.
 * A page that adds no new uuid stops the walk (the server repeated a page).
 */
export async function collectPurchaseRows(fetchPage, onPage) {
  const rows = [];
  const seen = new Set();
  let page = 1;
  let totalPages = 1;
  let expected = 0;
  let fetchedPages = 0;

  const report = () => onPage?.({ page, totalPages, loaded: rows.length, total: expected });

  do {
    report();
    const payload = purchasePage(await fetchPage(page, PURCHASE_PAGE_SIZE));
    if (page === 1) {
      totalPages = Math.max(1, payload.totalPages);
      expected = payload.total;
    }
    let added = 0;
    payload.rows.forEach((row) => {
      const id = row?.uuid == null ? '' : String(row.uuid);
      if (id && seen.has(id)) return;
      if (id) seen.add(id);
      rows.push(row);
      added += 1;
    });
    fetchedPages += 1;
    report();
    if (added === 0 || (expected > 0 && rows.length >= expected)) break;
    page += 1;
  } while (page <= totalPages && page <= MAX_PAGES);

  return { rows, pages: fetchedPages };
}
