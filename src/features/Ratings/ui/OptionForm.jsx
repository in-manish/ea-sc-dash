import { useState } from 'react';
import { optionBody, validateOptionForm } from '../domain/ratingForms';
import { useRatingForm } from '../hooks/useRatingForm';
import RatingField from './RatingField';
import { inputClass } from './inputClass';
import RatingFormFooter from './RatingFormFooter';

/** Create or edit a feedback option (a reason users can tick for a rating value). */
export default function OptionForm({ option, nextOrder, onSave, onClose }) {
  const [values, setValues] = useState({
    title: option?.title || '',
    description: option?.description || '',
    order: option?.order ?? nextOrder,
    isActive: option?.isActive ?? true,
  });
  const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));
  const form = useRatingForm({
    values,
    validate: validateOptionForm,
    submit: () => onSave(optionBody(values)),
  });
  const titleError = form.fields.title || form.fields.non_field_errors;

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
      <RatingField label="Title" error={titleError} hint="Must be unique within this rating value.">
        <input value={values.title} maxLength={255} autoFocus onChange={(e) => set({ title: e.target.value })} className={inputClass(titleError)} />
      </RatingField>
      <RatingField label="Description" error={form.fields.description}>
        <textarea value={values.description} rows={2} onChange={(e) => set({ description: e.target.value })} className={`${inputClass(form.fields.description)} h-auto py-2`} />
      </RatingField>
      <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
        <input type="checkbox" checked={values.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
        Active
      </label>
      <RatingFormFooter message={form.message} saving={form.saving} onClose={onClose} submitLabel={option ? 'Save changes' : 'Add option'} />
    </form>
  );
}
