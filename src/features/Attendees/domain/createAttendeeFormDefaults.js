const generateUuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const emptyAttendee = () => ({
  name: '',
  email: '',
  country_code: '',
  phone_number: '',
  designation: '',
  uuid: generateUuid(),
});

export const INITIAL_SHARED = {
  attendee_type: '',
  reg_type: 'ON_SPOT',
  company: '',
  company_address: '',
  city: '',
  state: '',
  country: '',
  website: '',
  exhibitor_id: '',
  created_location: '',
  printNow: false,
  is_matchable: false,
};

export const nullIfEmpty = (v) => {
  const t = typeof v === 'string' ? v.trim() : v;
  return t === '' || t === undefined ? null : t;
};

export function mergeSharedPrefill(prefill) {
  if (!prefill || typeof prefill !== 'object') return { ...INITIAL_SHARED };
  return {
    ...INITIAL_SHARED,
    ...prefill,
    printNow: Boolean(prefill.printNow),
    is_matchable: Boolean(prefill.is_matchable),
  };
}

/** Match preferred type name against loaded attendee types (e.g. Exhibitor). */
export function resolveAttendeeTypeName(preferred, attendeeTypes = []) {
  const want = String(preferred || '').trim().toLowerCase();
  if (!want || !attendeeTypes.length) return preferred || '';

  const exact = attendeeTypes.find(
    (t) => String(t.name || '').trim().toLowerCase() === want,
  );
  if (exact) return exact.name;

  const partial = attendeeTypes.find((t) =>
    String(t.name || '').toLowerCase().includes(want),
  );
  return partial?.name || preferred || '';
}
