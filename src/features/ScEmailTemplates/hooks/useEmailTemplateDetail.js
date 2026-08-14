import { useCallback, useEffect, useState } from 'react';
import {
  fetchEmailTemplate,
  patchEmailTemplate,
  putEmailTemplate,
} from '../api/emailTemplateApi';
import {
  buildPutEmailTemplatePayload,
  templateToForm,
} from '../domain/buildCreateEmailTemplatePayload';

/** Load GET-one, PUT full save, PATCH archive/reactivate. */
export default function useEmailTemplateDetail(token, templateId) {
  const [template, setTemplate] = useState(null);
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const applyTemplate = (data) => {
    setTemplate(data);
    setForm(templateToForm(data));
  };

  useEffect(() => {
    if (!token || templateId == null) {
      setTemplate(null);
      setForm(null);
      setError('');
      setFieldErrors({});
      setIsLoading(false);
      return undefined;
    }

    let active = true;
    setIsLoading(true);
    setError('');
    setFieldErrors({});
    setTemplate(null);
    setForm(null);

    fetchEmailTemplate(token, templateId)
      .then((data) => {
        if (active) applyTemplate(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Email template not found');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, templateId]);

  const patch = (values) => {
    setForm((prev) => (prev ? { ...prev, ...values } : prev));
  };

  const runMutation = useCallback(async (request) => {
    setIsSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const updated = await request();
      applyTemplate(updated);
      return updated;
    } catch (err) {
      setFieldErrors(err.fields || {});
      setError(err.message || 'Failed to update email template.');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [token, templateId]);

  const save = () => {
    if (!form) return Promise.resolve(null);
    return runMutation(() =>
      putEmailTemplate(token, templateId, buildPutEmailTemplatePayload(form))
    );
  };

  const setActive = (isActive) =>
    runMutation(() => patchEmailTemplate(token, templateId, { is_active: isActive }));

  const revert = () => {
    if (template) setForm(templateToForm(template));
    setError('');
    setFieldErrors({});
  };

  return {
    template,
    form,
    patch,
    isLoading,
    isSaving,
    error,
    fieldErrors,
    save,
    revert,
    archive: () => setActive(false),
    reactivate: () => setActive(true),
  };
}
