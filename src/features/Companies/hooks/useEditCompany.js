import { useState, useCallback, useEffect } from 'react';
import { companyApi } from '../api/companyApi';
import { companyToForm } from '../domain/companyFromApi';
import { buildCompanyPatchFormData } from '../domain/buildCompanyPatchFormData';
import { validateEditCompanyForm } from '../domain/companyFormDefaults';

export function useEditCompany({ eventId, companyId, token, onSaved }) {
  const [form, setForm] = useState(null);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!eventId || !companyId || !token) return undefined;
    let active = true;
    setLoading(true);
    setLoadError('');
    companyApi
      .getCompany(eventId, companyId, token)
      .then((company) => {
        if (!active) return;
        const mapped = companyToForm(company);
        setForm(mapped);
        setInitial(mapped);
      })
      .catch((err) => {
        if (active) setLoadError(err.message || 'Failed to load company.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [eventId, companyId, token]);

  const setField = useCallback((key, value) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const submit = useCallback(async () => {
    if (!form || !initial) return null;
    const localError = validateEditCompanyForm(form);
    if (localError) {
      setError(localError);
      return null;
    }
    setSaving(true);
    setError('');
    try {
      const updated = await companyApi.updateCompany(
        eventId,
        companyId,
        token,
        buildCompanyPatchFormData(form, initial)
      );
      onSaved?.(updated);
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update company.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [eventId, companyId, token, form, initial, onSaved]);

  return { form, setField, loading, saving, error, loadError, submit };
}
