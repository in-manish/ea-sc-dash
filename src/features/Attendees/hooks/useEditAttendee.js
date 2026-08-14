import { useState, useCallback, useEffect } from 'react';
import { attendeeApi } from '../api/attendeeApi';
import {
  attendeeToForm,
  buildAttendeePatchPayload,
  validateEditAttendeeForm,
  normalizeAttendeeForUi,
} from '../domain/editAttendeeForm';

export default function useEditAttendee({ eventId, uuid, token, onSaved }) {
  const [form, setForm] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(Boolean(uuid));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);

  useEffect(() => {
    if (!eventId || !uuid || !token) return undefined;
    let active = true;
    setLoading(true);
    setLoadError('');
    setError('');
    setFieldErrors(null);
    setForm(null);
    setBaseline(null);

    attendeeApi
      .getAttendee(eventId, uuid, token)
      .then((data) => {
        if (!active) return;
        setBaseline(data);
        setForm(attendeeToForm(data));
      })
      .catch((err) => {
        if (active) setLoadError(err.message || 'Failed to load attendee.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [eventId, uuid, token]);

  const setField = useCallback((key, value) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setFieldErrors((prev) => {
      if (!prev || !prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return Object.keys(next).length ? next : null;
    });
  }, []);

  const submit = useCallback(async () => {
    if (!form || !baseline) return null;
    const localError = validateEditAttendeeForm(form);
    if (localError) {
      setError(localError);
      return null;
    }
    setSaving(true);
    setError('');
    setFieldErrors(null);
    try {
      const updated = await attendeeApi.updateAttendee(
        eventId,
        uuid,
        token,
        buildAttendeePatchPayload(form, baseline),
      );
      const normalized = normalizeAttendeeForUi(updated);
      onSaved?.(normalized);
      return normalized;
    } catch (err) {
      setError(err.message || 'Failed to update attendee.');
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      return null;
    } finally {
      setSaving(false);
    }
  }, [eventId, uuid, token, form, baseline, onSaved]);

  return {
    form,
    setField,
    loading,
    saving,
    error,
    loadError,
    fieldErrors,
    submit,
  };
}
