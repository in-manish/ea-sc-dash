import { useState } from 'react';
import { DEFAULT_SCALE_COLORS } from '../constants';
import { scaleBody, validateScaleForm } from '../domain/ratingForms';
import { useRatingForm } from '../hooks/useRatingForm';
import RatingField from './RatingField';
import { inputClass } from './inputClass';
import RatingFormFooter from './RatingFormFooter';

/** Create or edit one scale value (for example 4 = "Good"). `scale` is null when creating. */
export default function ScaleForm({ scale, nextValue, onSave, onClose }) {
  const startValue = scale?.value ?? nextValue;
  const [values, setValues] = useState({
    value: String(startValue),
    label: scale?.label || '',
    color: scale?.color || DEFAULT_SCALE_COLORS[startValue] || '',
    order: String(scale?.order ?? startValue),
    isActive: scale?.isActive ?? true,
  });
  const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));
  const form = useRatingForm({
    values,
    validate: validateScaleForm,
    submit: () => onSave(scaleBody(values)),
  });
  const errors = {
    value: form.fields.value || form.fields.rating_value || form.fields.non_field_errors,
    label: form.fields.label,
    color: form.fields.color || form.fields.color_code,
    order: form.fields.order || form.fields.display_order,
  };

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <RatingField label="Value" error={errors.value} hint="The number users pick, e.g. 1 to 5.">
          <input type="number" min={1} max={100} value={values.value} onChange={(e) => set({ value: e.target.value })} className={inputClass(errors.value)} />
        </RatingField>
        <RatingField label="Label" error={errors.label} hint="Shown next to the number.">
          <input value={values.label} maxLength={100} placeholder="Good" onChange={(e) => set({ label: e.target.value })} className={inputClass(errors.label)} />
        </RatingField>
        <RatingField label="Colour" error={errors.color}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(values.color) ? values.color : '#94a3b8'}
              onChange={(e) => set({ color: e.target.value })}
              className="h-10 w-12 p-1 border border-border rounded-md bg-bg-primary"
              aria-label="Pick colour"
            />
            <input value={values.color} onChange={(e) => set({ color: e.target.value })} placeholder="#22c55e" className={inputClass(errors.color)} />
          </div>
        </RatingField>
        <RatingField label="Display order" error={errors.order}>
          <input type="number" min={0} value={values.order} onChange={(e) => set({ order: e.target.value })} className={inputClass(errors.order)} />
        </RatingField>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
        <input type="checkbox" checked={values.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
        Active (options can only be added to active values)
      </label>
      <RatingFormFooter message={form.message} saving={form.saving} onClose={onClose} submitLabel={scale ? 'Save changes' : 'Add value'} />
    </form>
  );
}
