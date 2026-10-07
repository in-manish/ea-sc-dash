import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { validatePermissionCodeName } from '../domain/permissionCodeForm';
import { permissionCodePatch, validatePermissionWindow } from '../domain/permissionWindow';
import PermissionWindowFields from './PermissionWindowFields';

const emptyFields = (row) => ({
  name: row.name || '',
  from_date: row.from_date || '',
  end_date: row.end_date || '',
  from_time: row.from_time || '',
  end_time: row.end_time || '',
  is_active: row.is_active !== false,
});

export default function PermissionCodeEditForm({ row, onSave, onCancel }) {
  const [form, setForm] = useState(() => emptyFields(row));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const nameCheck = validatePermissionCodeName(form.name);
    const windowErrors = validatePermissionWindow(form);
    const fields = { ...windowErrors };
    if (nameCheck.error) fields.name = nameCheck.error;
    if (Object.keys(fields).length) {
      setErrors(fields);
      setMessage('Fix the highlighted fields before saving.');
      return;
    }
    const patch = permissionCodePatch(row, { ...form, name: nameCheck.name });
    if (!Object.keys(patch).length) {
      onCancel();
      return;
    }
    setSaving(true);
    setErrors({});
    setMessage('');
    try {
      await onSave(row.id, patch);
    } catch (err) {
      setErrors(err.fields || {});
      setMessage(err.message || 'Failed to update the permission code.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-text-primary m-0">Edit {row.code}</p>
      {message ? <p className="text-sm text-danger whitespace-pre-line m-0">{message}</p> : null}
      <label className="block max-w-md">
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Name</span>
        <input
          value={form.name}
          maxLength={255}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full h-10 px-3 border border-border rounded-md text-sm bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <span className="text-xs text-danger mt-1 block">{errors.name}</span> : null}
      </label>
      <PermissionWindowFields
        value={form}
        onChange={(next) => setForm({ ...form, ...next })}
        errors={errors}
      />
      <div className="flex gap-3">
        <button type="button" onClick={save} disabled={saving} className="text-sm font-semibold text-accent disabled:opacity-50">
          {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-text-secondary">Cancel</button>
      </div>
    </div>
  );
}
