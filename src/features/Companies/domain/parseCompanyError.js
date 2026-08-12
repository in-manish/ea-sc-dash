/** Surface DRF / create-company error bodies for the UI. */
export function parseCompanyError(result, status) {
  if (!result || typeof result !== 'object') {
    return `Request failed (${status})`;
  }

  if (result.ERROR) return String(result.ERROR);
  if (result.detail) {
    return typeof result.detail === 'string'
      ? result.detail
      : JSON.stringify(result.detail);
  }

  const fieldParts = Object.entries(result)
    .filter(([key]) => !['success', 'message', 'msg', 'error'].includes(key))
    .map(([field, msgs]) => {
      const text = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
      return `${field}: ${text}`;
    });

  if (fieldParts.length) return fieldParts.join('\n');

  return (
    result.message ||
    result.msg ||
    result.error ||
    `Request failed (${status})`
  );
}
