import React from 'react';
import { COMPANY_KINDS } from '../domain/companyFormDefaults';

const fieldClass =
  'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10';

const CreateCompanyProfileFields = ({ form, setField, isEdit = false }) => {
  const isParent = form.kind === COMPANY_KINDS.PARENT;
  const showExistingLogo =
    isEdit && form.existingLogoUrl && !form.removeLogo && !(form.company_logo instanceof File);

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
        {isEdit ? 'Profile' : 'Optional profile'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Category</label>
          {isEdit ? (
            <div className={`${fieldClass} text-text-primary`}>
              {form.category || '—'}
            </div>
          ) : (
            <input
              className={fieldClass}
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
            />
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Stall number</label>
          <input
            className={fieldClass}
            value={form.stall_number}
            onChange={(e) => setField('stall_number', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Address</label>
        <input
          className={fieldClass}
          value={form.address}
          onChange={(e) => setField('address', e.target.value)}
        />
      </div>

      {isParent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Space (sqm)
            </label>
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={form.space}
              onChange={(e) => setField('space', e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Badge limit
            </label>
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={form.badge_limit}
              onChange={(e) => setField('badge_limit', e.target.value)}
              placeholder="Auto from space if empty"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Products{isEdit ? '' : ' (comma-separated)'}
        </label>
        {isEdit ? (
          <div className={`${fieldClass} text-text-primary min-h-[42px]`}>
            {form.productsText || '—'}
          </div>
        ) : (
          <input
            className={fieldClass}
            value={form.productsText}
            onChange={(e) => setField('productsText', e.target.value)}
            placeholder="Yarn, Fabric"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['facebook', 'instagram', 'twitter', 'linkedin'].map((key) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary capitalize">
              {key}
            </label>
            <input
              className={fieldClass}
              value={form[key]}
              onChange={(e) => setField(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Logo</label>
        {showExistingLogo && (
          <div className="flex items-center gap-4 mb-2">
            <img
              src={form.existingLogoUrl}
              alt="Current logo"
              className="w-16 h-16 object-contain bg-white rounded-md border border-border"
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
          className="w-full text-sm text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-accent/10 file:text-accent file:text-sm file:font-medium"
          onChange={(e) => {
            setField('company_logo', e.target.files?.[0] || null);
            if (e.target.files?.[0]) setField('removeLogo', false);
          }}
        />
        {isEdit && !showExistingLogo && !form.company_logo && (
          <p className="text-xs text-text-tertiary">No logo uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default CreateCompanyProfileFields;
