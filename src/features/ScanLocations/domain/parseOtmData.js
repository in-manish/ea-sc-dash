const TAGS = /<[^>]*>/g;

function text(value) {
  return String(value ?? '').trim();
}

function plain(html) {
  return text(html).replace(TAGS, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * GET get-form-question → the options to push to EA. A choice becomes an option only when it has a
 * badge_permission. id is the choice value; price, date and times come from the badge_permission.
 * Choices without one (free or ordinary choices) are counted as skipped.
 */
export function parseOtmOptions(response) {
  const data = response?.data;
  const questions = Array.isArray(data) ? data : [data];
  const options = [];
  let skipped = 0;
  questions.forEach((question) => {
    (Array.isArray(question?.choices) ? question.choices : []).forEach((choice) => {
      const permission = choice?.badge_permission;
      const id = text(choice?.value);
      if (!id || !permission || typeof permission !== 'object') {
        skipped += 1;
        return;
      }
      options.push({
        id,
        price: text(permission.price ?? choice.value_usd ?? id),
        title: text(permission.title) || plain(choice.text) || `Option ${id}`,
        date: text(permission.date),
        start_time: text(permission.start_time),
        end_time: text(permission.end_time),
      });
    });
  });
  const questionName = text(questions[0]?.title) || text(questions[0]?.name);
  return { options, skipped, questionName };
}

/**
 * GET badge-permissions → backfill records. Attendees with a null badge_permission bought nothing with a
 * permission and are not sent. EA matches the badge_permission to an option by price.
 */
export function parseOtmPurchases(response) {
  const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
  const records = [];
  rows.forEach((row) => {
    const uuid = text(row?.uuid);
    if (uuid && row?.badge_permission && typeof row.badge_permission === 'object') {
      records.push({ uuid, badge_permission: row.badge_permission });
    }
  });
  return { records, total: rows.length, withoutPermission: rows.length - records.length };
}

/** Split records into the chunks EA accepts (at most 500 per call). */
export function chunkRecords(records, size = 500) {
  const chunks = [];
  for (let start = 0; start < records.length; start += size) chunks.push(records.slice(start, start + size));
  return chunks;
}
