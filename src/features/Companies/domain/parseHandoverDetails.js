/**
 * Normalize company.handover_details from object or JSON string.
 * Supports: { name, designation, signature, phone_number, remarks? }
 */
export function parseHandoverDetails(raw) {
  if (raw == null || raw === '') return null;

  let data = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (typeof data !== 'object' || Array.isArray(data)) return null;

  const name = String(data.name || '').trim();
  const designation = String(data.designation || '').trim();
  const phone = String(data.phone_number || data.phone || '').trim();
  const signature = String(data.signature || '').trim();
  const remarks = Array.isArray(data.remarks) ? data.remarks : [];

  if (!name && !designation && !phone && !signature && remarks.length === 0) {
    return null;
  }

  return {
    name,
    designation,
    phone_number: phone,
    signature,
    remarks,
  };
}

/** True when handover details include a signature image/URL. */
export function hasHandoverSignature(raw) {
  const details = parseHandoverDetails(raw);
  return Boolean(details?.signature);
}
