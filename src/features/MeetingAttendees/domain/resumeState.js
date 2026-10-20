export const RESUME_PARAM = 'resume';

const keyFor = (eventId) => `meetingAttendeesResume:${eventId}`;

/** Remember the filters and selection while the admin creates a template elsewhere. */
export function saveResume(eventId, state) {
  try {
    sessionStorage.setItem(keyFor(eventId), JSON.stringify(state));
  } catch {
    /* storage can be blocked; the admin just starts again */
  }
}

/** Read once and forget. */
export function loadResume(eventId) {
  try {
    const raw = sessionStorage.getItem(keyFor(eventId));
    sessionStorage.removeItem(keyFor(eventId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
