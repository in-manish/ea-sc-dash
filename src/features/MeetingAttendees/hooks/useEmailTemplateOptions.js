import { useEffect, useState } from 'react';
import { emailTemplateApi } from '../../../services/emailTemplateApi';
import { isMeetingTemplateType } from '../domain/meetingTemplates';

/** Active meeting templates (type starts with `meeting_`), loaded only when `enabled` (the send dialog is open). */
export function useEmailTemplateOptions({ eventId, token, enabled }) {
  const [loaded, setLoaded] = useState({ key: '', templates: [], error: '' });
  const key = enabled && eventId && token ? String(eventId) : '';

  useEffect(() => {
    if (!key) return undefined;
    let active = true;
    emailTemplateApi
      .getEmailTemplates(eventId, token, { size: 100, sortBy: 'email_name' })
      .then((payload) => {
        const rows = Array.isArray(payload?.results) ? payload.results : [];
        const templates = rows
          .filter((row) => row.is_active !== false && isMeetingTemplateType(row.template_type))
          .map((row) => ({
            id: row.id,
            name: row.email_name || row.template_type || `Template ${row.id}`,
            type: row.template_type || '',
            subject: row.subject || '',
            content: row.email_content || '',
          }));
        if (active) setLoaded({ key, templates, error: '' });
      })
      .catch(() => active && setLoaded({ key, templates: [], error: 'Could not load email templates.' }));
    return () => {
      active = false;
    };
  }, [key, eventId, token]);

  const ready = loaded.key === key;
  return {
    templates: ready ? loaded.templates : [],
    error: ready ? loaded.error : '',
    loading: Boolean(key) && !ready,
  };
}
