import { useState } from 'react';
import { createEmailTemplate } from '../api/emailTemplateApi';
import {
  buildCreateEmailTemplatePayload,
  emptyCreateEmailTemplateForm,
} from '../domain/buildCreateEmailTemplatePayload';

export default function useCreateEmailTemplate(token) {
  const [form, setForm] = useState(emptyCreateEmailTemplateForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setForm(emptyCreateEmailTemplateForm());
    setFieldErrors({});
    setError('');
  };

  const patch = (patchValues) => {
    setForm((prev) => ({ ...prev, ...patchValues }));
  };

  const submit = async () => {
    setIsSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const created = await createEmailTemplate(
        token,
        buildCreateEmailTemplatePayload(form)
      );
      reset();
      return created;
    } catch (err) {
      setFieldErrors(err.fields || {});
      setError(err.message || 'Failed to create email template.');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { form, patch, fieldErrors, error, isSaving, submit, reset };
}
