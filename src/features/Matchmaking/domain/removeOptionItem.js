/**
 * EA only deletes a saved option/group/value when the save payload carries it with
 * `is_deleted: true` (matchmaking/helpers/match_making.py); leaving it out of the list keeps it.
 * So saved items (with an id) are flagged, and unsaved ones are just dropped.
 */
export function removeOptionItem(items, index) {
    const item = items[index];
    if (item?.id) return items.map((x, i) => (i === index ? { ...x, is_deleted: true } : x));
    return items.filter((_, i) => i !== index);
}

export const isActiveOptionItem = (item) => !item?.is_deleted;

/** Keeps flagged deletions even if their name was cleared, so the backend still deletes them. */
export const shouldSendOptionItem = (item) => Boolean(item?.name) || Boolean(item?.id && item?.is_deleted);
