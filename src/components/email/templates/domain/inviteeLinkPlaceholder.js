/** Match EA Company.invitee_count_slug_from_title: 'Hosted Buyer' → hosted_buyer. */

export function inviteeSlugFromTitle(title) {
  return String(title || '').trim().toLowerCase().replaceAll(' ', '_') || '';
}

/** EA send-time key: invitee_{title_slug}_link. */
export function buildInviteeLinkPlaceholder(title) {
  const trimmed = String(title || '').trim();
  const slug = inviteeSlugFromTitle(trimmed);
  if (!slug) return null;
  return {
    name: `invitee_${slug}_link`,
    description: `Complimentary ${trimmed} invitee link`,
    title: trimmed,
  };
}
