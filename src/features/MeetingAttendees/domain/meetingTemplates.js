export const MEETING_SLUG_PREFIX = 'meeting_';

/** "Hosted Buyer - International" -> "meeting_hosted_buyer_international" */
export function meetingTemplateSlug(attendeeTypeName) {
  const slug = String(attendeeTypeName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return `${MEETING_SLUG_PREFIX}${slug || 'attendee'}`;
}

export function isMeetingTemplateType(templateType) {
  return String(templateType || '').startsWith(MEETING_SLUG_PREFIX);
}

/** { typeId: template | null } — the template whose type slug matches the attendee type. */
export function templatesByAttendeeType(types, templates) {
  const bySlug = new Map(templates.map((template) => [template.type, template]));
  return Object.fromEntries(types.map((type) => [type.id, bySlug.get(meetingTemplateSlug(type.name)) || null]));
}

/** Pre-selected choice per attendee type: its own template, when it exists. */
export function defaultTemplateChoices(types, templates) {
  const own = templatesByAttendeeType(types, templates);
  return Object.fromEntries(
    types.filter((type) => own[type.id]).map((type) => [type.id, String(own[type.id].id)]),
  );
}

/** Opens the Communication → Email → Templates editor for `slug`, and comes back to `returnTo` when done. */
export function buildCreateTemplateUrl(eventId, slug, returnTo) {
  const params = new URLSearchParams({
    tab: 'email',
    email_tab: 'templates',
    create_type: slug,
    return_to: returnTo,
  });
  return `/event/${eventId}/communication?${params.toString()}`;
}
