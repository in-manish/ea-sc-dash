import React from 'react';
import { COMPANY_KINDS } from '../domain/companyFormDefaults';
import CompanyLogoFields from './CompanyLogoFields';

const fieldClass =
  'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10';

const CreateCompanyProfileFields = ({ form, setField, isEdit = false }) => {
  const isParent = form.kind === COMPANY_KINDS.PARENT;

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
        {isEdit ? 'Profile' : 'Optional profile'}
      </p>

      {!isEdit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Category</label>
            <input
              className={fieldClass}
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
            />
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
      )}

      {isEdit && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Stall number</label>
          <input
            className={fieldClass}
            value={form.stall_number}
            onChange={(e) => setField('stall_number', e.target.value)}
          />
        </div>
      )}

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

      {!isEdit && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Products (comma-separated)
          </label>
          <input
            className={fieldClass}
            value={form.productsText}
            onChange={(e) => setField('productsText', e.target.value)}
            placeholder="Yarn, Fabric"
          />
        </div>
      )}

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

      {!isEdit && <CompanyLogoFields form={form} setField={setField} />}
    </div>
  );
};

export default CreateCompanyProfileFields;
