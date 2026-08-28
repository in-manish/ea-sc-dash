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

export const EMAIL_TEMPLATE_TYPES = [
  {
    value: 'exhibitor_attendee_added_welcome',
    label: 'Exhibitor attendee added welcome',
    group: 'Exhibitor',
    description: 'Sent when a non-POC exhibitor attendee is created with an email.',
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
  badgeType('badge_msg_for_visitor', 'Visitor badge'),
  badgeType('badge_msg_for_non_visitor', 'Non-visitor badge'),
  badgeType('badge_msg_for_vip', 'VIP badge'),
  badgeType('badge_msg_for_hosted_buyer', 'Hosted buyer badge'),
  badgeType('badge_msg_for_hosted_buyer_corporate', 'Hosted buyer corporate badge'),
  badgeType('badge_msg_for_hosted_buyer_wedding_planner', 'Hosted buyer wedding planner badge'),
  badgeType('badge_msg_for_buyer_corporate', 'Buyer corporate badge'),
  badgeType('badge_msg_for_vip_buyer', 'VIP buyer badge'),
];

export const EMAIL_TEMPLATE_TYPE_GROUPS = ['Exhibitor', 'Badge'];

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
