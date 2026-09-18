import { useState } from 'react';
import { createPreset, patchPreset } from '../api/aiPresetsApi';
import { emptyPresetForm, formFromPreset } from '../constants';
import { buildCreatePayload, buildPatchPayload, validatePresetForm } from '../domain/presetPayload';

export function useAiPresetEditor({ token, onUnauthorized }) {
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(emptyPresetForm());
  const [editingKey, setEditingKey] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const close = () => {
    setMode(null);
    setEditingKey('');
    setForm(emptyPresetForm());
    setFieldErrors({});
    setError('');
  };

  const startCreate = () => {
    setMode('create');
    setEditingKey('');
    setForm(emptyPresetForm());
    setFieldErrors({});
    setError('');
  };

  const startEdit = (preset) => {
    setMode('edit');
    setEditingKey(preset.preset_key || String(preset.id));
    setForm(formFromPreset(preset));
    setFieldErrors({});
    setError('');
  };

  const patch = (values) => {
    setForm((prev) => ({ ...prev, ...values }));
  };

  const submit = async () => {
    const isCreate = mode === 'create';
    const localErrors = validatePresetForm(form, { isCreate });
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors);
      setError(Object.values(localErrors)[0]);
      return null;
    }
    setIsSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const saved = isCreate
        ? await createPreset(token, buildCreatePayload(form))
        : await patchPreset(token, editingKey, buildPatchPayload(form));
      close();
      return saved;
    } catch (err) {
      if (err.status === 401) onUnauthorized?.();
      setFieldErrors(err.fields || {});
      setError(err.message || 'Failed to save preset.');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    mode,
    form,
    fieldErrors,
    error,
    isSaving,
    isOpen: Boolean(mode),
    isCreate: mode === 'create',
    patch,
    startCreate,
    startEdit,
    close,
    submit,
  };
}
