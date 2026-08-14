/**
 * Single exhibitor/co-exhibitor POC password reset.
 * Identify with badge_id, then company_id. Do not send email or bulk_email.
 */
export function exhibitorPasswordResetPayload({ badgeId, companyId } = {}) {
  const body = {};
  if (badgeId != null && badgeId !== '') body.badge_id = Number(badgeId);
  if (companyId != null && companyId !== '') {
    body.company_id = Number(companyId);
  }
  return body;
}

export function hasExhibitorPasswordResetTarget(payload) {
  return payload?.badge_id != null || payload?.company_id != null;
}
