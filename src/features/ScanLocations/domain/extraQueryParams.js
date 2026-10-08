/**
 * Turn an optional extra query (`key=value&other=1`, with or without a leading ? or &)
 * into entries for get-form-question. eventCode and form_value stay owned by the form picker.
 */
export function extraQueryEntries(raw) {
  const text = String(raw ?? '').replace(/[\r\n]/g, '').trim().replace(/^[?&]+/, '');
  if (!text) return [];
  return [...new URLSearchParams(text).entries()].filter(
    ([key]) => key && key !== 'eventCode' && key !== 'form_value',
  );
}
