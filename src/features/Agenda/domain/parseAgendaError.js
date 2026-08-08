export function parseAgendaError(result, status) {
  if (!result || typeof result !== 'object') {
    return `HTTP error! status: ${status}`;
  }

  if (result.details) {
    if (typeof result.details === 'string') return result.details;
    if (typeof result.details === 'object') {
      return Object.entries(result.details)
        .map(([field, msgs]) => {
          const text = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
          return `${field}: ${text}`;
        })
        .join('\n');
    }
  }

  return result.error || result.message || `HTTP error! status: ${status}`;
}
