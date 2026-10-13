/** EA EmailTemplateType values. One active row per (template_type, event). */

export const EMAIL_TEMPLATE_TYPE_CUSTOM = 'custom';

const BADGE_PLACEHOLDERS = ['name', 'email', 'event_name', 'att_type', 'reg_id'];
const POC_PLACEHOLDERS = ['name', 'email', 'username', 'password', 'event_name', 'portal_link'];

function badgeType(value, label) {
  return {
    value,
    label,
    group: 'Badge',
    description: `Registration / badge message for ${label.toLowerCase()}.`,
    email_name: label,
    subject: '{{event_name}} registration',
    placeholders: BADGE_PLACEHOLDERS,
  };
}

const MEETING_PLACEHOLDERS = [
  'user_name',
  'name',
  'company_name',
  'event_name',
  'pending_requests_count',
  'pending_sent_count',
  'confirmed_meetings_count',
  'declined_meetings_count',
  'pending_company_names_text',
  'pending_company_names_more',
];

// Starter for emails sent from Meetings → Meeting Attendees. Any type slug that starts with
// `meeting_` gets this starter, so each attendee type can have its own template.
export const MEETING_TEMPLATE_TYPE = {
  value: 'meeting_pending_requests',
  label: 'Meeting requests reminder',
  group: 'Meeting',
  description:
    'Not automatic. Sent when an organizer emails attendees from Meetings → Meeting Attendees. Only one template per type per event: for another attendee type, create a custom type that starts with meeting_ (for example meeting_pending_requests_exhibitor).',
  email_name: 'Meeting requests reminder',
  subject: '{{user_name}}, you have {{pending_requests_count}} meeting request(s) on {{event_name}}',
  placeholders: MEETING_PLACEHOLDERS,
  body: [
    '<p>Hi {{user_name}},</p>',
    '<p>You have {{pending_requests_count}} meeting request(s) waiting for your reply at {{event_name}}.</p>',
    '{% if pending_company_names_text %}<p>Requests from: {{pending_company_names_text}}',
    '{% if pending_company_names_more %} and {{pending_company_names_more}} more{% endif %}.</p>{% endif %}',
    '<p>Confirmed meetings so far: {{confirmed_meetings_count}}.</p>',
  ].join(''),
};

export const EMAIL_TEMPLATE_TYPES = [
  {
    value: 'exhibitor_attendee_added_welcome',
    label: 'Exhibitor attendee added welcome',
    group: 'Exhibitor',
    description: 'Automatic. Sent when a non-POC exhibitor attendee is added with an email. Used by the live welcome flow, so avoid reusing it for other mailings.',
    email_name: 'Exhibitor attendee added welcome',
    subject: "You've been added to {{event_name}}",
    placeholders: [
      'name',
      'email',
      'event_name',
      'company_name',
      'invitee_trade_visitor_link',
    ],
    body: [
      '<p>Hi {{name}},</p>',
      '<p>You have been added as an exhibitor attendee for {{event_name}} representing {{company_name}}.</p>',
      '<p>Complimentary trade visitor invite: {{invitee_trade_visitor_link}}</p>',
    ].join(''),
  },
  {
    value: 'exhibitor_action_email',
    label: 'Exhibitor action email',
    group: 'Exhibitor',
    description:
      'Not automatic. Sent only when triggered (per exhibitor attendee), e.g. to ask exhibitors to share their invite link and promote their participation. Use {{company_id}} for the exh_id in links.',
    email_name: 'Exhibitor action email',
    subject: '{{event_name}}: invite your contacts and promote your participation',
    placeholders: ['name', 'email', 'event_name', 'company_name', 'company_id'],
  },
  {
    value: 'password_msg_for_exhibitor_poc',
    label: 'Exhibitor POC password',
    group: 'Exhibitor',
    description: 'Portal login password for the exhibitor point of contact.',
    email_name: 'Exhibitor POC password',
    subject: '{{event_name}} exhibitor portal login',
    placeholders: POC_PLACEHOLDERS,
  },
  {
    value: 'password_msg_for_coexhibitor_poc',
    label: 'Co-exhibitor POC password',
    group: 'Exhibitor',
    description: 'Portal login password for a co-exhibitor point of contact.',
    email_name: 'Co-exhibitor POC password',
    subject: '{{event_name}} co-exhibitor portal login',
    placeholders: [...POC_PLACEHOLDERS, 'parent_exhibitor_name'],
  },
  MEETING_TEMPLATE_TYPE,
  badgeType('badge_msg_for_visitor', 'Visitor badge'),
  badgeType('badge_msg_for_non_visitor', 'Non-visitor badge'),
  badgeType('badge_msg_for_vip', 'VIP badge'),
  badgeType('badge_msg_for_hosted_buyer', 'Hosted buyer badge'),
  badgeType('badge_msg_for_hosted_buyer_corporate', 'Hosted buyer corporate badge'),
  badgeType('badge_msg_for_hosted_buyer_wedding_planner', 'Hosted buyer wedding planner badge'),
  badgeType('badge_msg_for_buyer_corporate', 'Buyer corporate badge'),
  badgeType('badge_msg_for_vip_buyer', 'VIP buyer badge'),
];

export const EMAIL_TEMPLATE_TYPE_GROUPS = ['Exhibitor', 'Meeting', 'Badge'];

export function getEmailTemplateType(value) {
  return EMAIL_TEMPLATE_TYPES.find((item) => item.value === value) || null;
}

export function isKnownEmailTemplateType(value) {
  return Boolean(getEmailTemplateType(value));
}

export function knownTemplateTypeValues() {
  return EMAIL_TEMPLATE_TYPES.map((item) => item.value);
}

export function formatTemplateTypeLabel(value) {
  const known = getEmailTemplateType(value);
  if (known) return known.label;
  if (!value) return 'Custom';
  return String(value).replace(/_/g, ' ');
}

export function normalizeTemplateType(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, '_');
}

export function mergeTemplateTypeOptions(apiTypes = []) {
  const seen = new Set();
  const out = [];
  [...knownTemplateTypeValues(), ...apiTypes].forEach((value) => {
    const key = String(value || '').trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push(key);
  });
  return out;
}
