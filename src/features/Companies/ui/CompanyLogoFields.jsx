import React from 'react';

const fieldClass =
  'w-full text-sm text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-accent/10 file:text-accent file:text-sm file:font-medium';

/** Logo upload / remove for company create & edit. */
const CompanyLogoFields = ({ form, setField, isEdit = false }) => {
  const showExisting =
    isEdit && form.existingLogoUrl && !form.removeLogo && !(form.company_logo instanceof File);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-secondary">Logo</label>
      {showExisting && (
        <div className="flex items-center gap-4 mb-2">
          <img
            src={form.existingLogoUrl}
            alt="Current logo"
            className="w-20 h-20 object-contain bg-white rounded-md border border-border"
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer text-text-secondary">
            <input
              type="checkbox"
              className="w-4 h-4 accent-accent"
              checked={form.removeLogo}
              onChange={(e) => setField('removeLogo', e.target.checked)}
            />
            Remove logo
          </label>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className={fieldClass}
        onChange={(e) => {
          setField('company_logo', e.target.files?.[0] || null);
          if (e.target.files?.[0]) setField('removeLogo', false);
        }}
      />
      {isEdit && !showExisting && !form.company_logo && (
        <p className="text-xs text-text-tertiary">No logo uploaded.</p>
      )}
      {form.company_logo instanceof File && (
        <p className="text-xs text-text-secondary">Selected: {form.company_logo.name}</p>
      )}
    </div>
  );
};

export default CompanyLogoFields;
