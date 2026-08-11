import { useState, useCallback, useEffect } from 'react';
import { companyApi } from '../api/companyApi';
import { buildCompanyFormData } from '../domain/buildCompanyFormData';
import {
  emptyCompanyForm,
  validateCompanyForm,
  COMPANY_KINDS,
} from '../domain/companyFormDefaults';
import { formatCompanySearchLabel } from '../domain/formatCompanySearchLabel';

function parentOverrides(initialParent) {
  if (!initialParent?.id) return {};
  return {
    kind: COMPANY_KINDS.CO_EXHIBITOR,
    parent_exhibitor: String(initialParent.id),
    parent_exhibitor_label: formatCompanySearchLabel({
      company_name: initialParent.company_name,
      obf_number: initialParent.obf_number,
      id: initialParent.id,
    }),
  };
}

export function useCreateCompany({ eventId, token, initialParent = null, onCreated }) {
  const [form, setForm] = useState(() => emptyCompanyForm(parentOverrides(initialParent)));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(emptyCompanyForm(parentOverrides(initialParent)));
    setError('');
  }, [initialParent?.id, initialParent?.company_name, initialParent?.obf_number]);

  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const submit = useCallback(async () => {
    const localError = validateCompanyForm(form);
    if (localError) {
      setError(localError);
      return null;
    }
    setSaving(true);
    setError('');
    try {
      const created = await companyApi.createCompany(
        eventId,
        token,
        buildCompanyFormData(form)
      );
      onCreated?.(created);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to create company.');
      return null;
    } finally {
      setSaving(false);
    }
  }, [eventId, token, form, onCreated]);

  return { form, setField, saving, error, submit };
}
