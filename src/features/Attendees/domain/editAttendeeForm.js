import { nullIfEmpty } from './createAttendeeFormDefaults';

export function attendeeTypeName(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || '';
}

/** Normalize GET/PATCH response for list/detail views (string type). */
export function normalizeAttendeeForUi(api) {
  if (!api) return api;
  return {
    ...api,
    attendee_type: attendeeTypeName(api.attendee_type) || api.attendee_type,
  };
}

function blankPhone(value) {
  const raw = value == null ? '' : String(value).trim();
  if (!raw || raw === '0') return null;
  return raw.replace(/\D/g, '') || null;
}

/** Map GET response → editable form state. */
export function attendeeToForm(api) {
  return {
    name: api.name || '',
    email: api.email || '',
    country_code: api.country_code != null ? String(api.country_code) : '',
    phone_number: api.phone_number != null ? String(api.phone_number) : '',
    designation: api.designation || '',
    company: api.company || '',
    company_address: api.company_address || '',
    city: api.city || '',
    state: api.state || '',
    country: api.country || '',
    website: api.website || '',
    reg_type: api.reg_type || 'ON_SPOT',
    attendee_type: attendeeTypeName(api.attendee_type),
    exhibitor_id: api.exhibitor_id != null ? String(api.exhibitor_id) : '',
    is_meeting_enabled: api.is_meeting_enabled !== false,
  };
}

export function isExhibitorType(typeName) {
  return String(typeName || '').trim().toLowerCase() === 'exhibitor';
}

export function validateEditAttendeeForm(form) {
  if (!String(form.name || '').trim()) return 'Name is required.';
  if (!String(form.attendee_type || '').trim()) return 'Attendee type is required.';
  if (isExhibitorType(form.attendee_type) && !nullIfEmpty(form.exhibitor_id)) {
    return 'Exhibitor ID is required for Exhibitors.';
  }
  const phone = blankPhone(form.phone_number);
  if (phone && !/^\d{10}$/.test(phone)) {
    return 'Phone number must be a 10 digit numeric value or blank.';
  }
  return null;
}

/**
 * Full PATCH body: mirror GET baseline, overlay form edits.
 * Request attendee_type is the type name string.
 */
export function buildAttendeePatchPayload(form, baseline) {
  const phone = blankPhone(form.phone_number);
  const email = nullIfEmpty(form.email);
  const exhibitorId = nullIfEmpty(form.exhibitor_id);

  return {
    id: baseline.id,
    uuid: baseline.uuid,
    tracking_uuid: baseline.tracking_uuid ?? baseline.uuid,
    name: String(form.name || '').trim(),
    email: email ? email.toLowerCase() : null,
    country_code: nullIfEmpty(form.country_code),
    phone_number: phone,
    designation: nullIfEmpty(form.designation),
    company: nullIfEmpty(form.company),
    company_address: nullIfEmpty(form.company_address),
    city: nullIfEmpty(form.city),
    state: nullIfEmpty(form.state),
    country: nullIfEmpty(form.country),
    website: nullIfEmpty(form.website),
    reg_type: form.reg_type || 'ON_SPOT',
    attendee_type: String(form.attendee_type || '').trim(),
    exhibitor_id: exhibitorId != null ? Number(exhibitorId) : null,
    is_meeting_enabled: Boolean(form.is_meeting_enabled),
    evc_id: baseline.evc_id ?? null,
    created_location: baseline.created_location ?? null,
    printed_at: baseline.printed_at ?? null,
    user_attendee_upload_id: baseline.user_attendee_upload_id ?? null,
    source_metadata: baseline.source_metadata || {},
    created_at: baseline.created_at,
    modified_at: baseline.modified_at,
  };
}
