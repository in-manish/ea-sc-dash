import { useState } from 'react';
import { CATEGORY_OPTIONS } from '../constants';
import { typeBody, validateTypeForm } from '../domain/ratingForms';
import { useRatingForm } from '../hooks/useRatingForm';
import RatingField from './RatingField';
import { inputClass } from './inputClass';
import RatingFormFooter from './RatingFormFooter';

/** Create or edit a rating type. `type` is null when creating. */
export default function RatingTypeForm({ type, onSave, onClose }) {
  const [values, setValues] = useState({
    name: type?.name || '',
    description: type?.description || '',
    category: type?.category || 'interaction_based',
    isActive: type?.isActive ?? true,
  });
  const set = (patch) => setValues((prev) => ({ ...prev, ...patch }));
  const form = useRatingForm({
    values,
    validate: validateTypeForm,
    submit: () => onSave(typeBody(values)),
  });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-4">
      <RatingField
        label="Name"
        error={form.fields.name}
        hint={type ? 'Apps look a type up by this name. Rename only if you know nothing uses it.' : 'Letters and underscores, e.g. meeting_rating.'}
      >
        <input value={values.name} maxLength={100} onChange={(e) => set({ name: e.target.value })} className={inputClass(form.fields.name)} />
      </RatingField>
      <RatingField label="Description" error={form.fields.description}>
        <textarea
          value={values.description}
          rows={2}
          onChange={(e) => set({ description: e.target.value })}
          className={`${inputClass(form.fields.description)} h-auto py-2`}
        />
      </RatingField>
      <fieldset className="border-0 p-0 m-0">
        <legend className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Kind of rating</legend>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border p-3 text-sm ${
                values.category === option.value ? 'border-accent bg-accent/5' : 'border-border'
              }`}
            >
              <input type="radio" className="sr-only" checked={values.category === option.value} onChange={() => set({ category: option.value })} />
              <span className="font-semibold text-text-primary block">{option.label}</span>
              <span className="text-xs text-text-tertiary">{option.hint}</span>
            </label>
          ))}
        </div>
        {form.fields.rating_category ? <span className="text-xs text-red-600">{form.fields.rating_category}</span> : null}
      </fieldset>
      <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
        <input type="checkbox" checked={values.isActive} onChange={(e) => set({ isActive: e.target.checked })} />
        Active (new scale values can only be added to active types)
      </label>
      <RatingFormFooter message={form.message} saving={form.saving} onClose={onClose} submitLabel={type ? 'Save changes' : 'Create type'} />
    </form>
  );
}
