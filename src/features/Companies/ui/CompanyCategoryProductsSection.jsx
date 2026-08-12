import React from 'react';
import CompanyProductSelectFields from './CompanyProductSelectFields';

const fieldClass =
  'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10';

/** Category + products grouped for company edit. */
const CompanyCategoryProductsSection = ({
  form,
  setField,
  productOptions,
  productOptionsLoading,
  productOptionsError,
  hasProductQuestion,
  onSetupProductQuestion,
}) => (
  <div className="space-y-4 border-t border-border pt-4">
    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
      Category & products
    </p>

    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-secondary">Category</label>
      <input
        className={fieldClass}
        value={form.category}
        onChange={(e) => setField('category', e.target.value)}
        placeholder="e.g. Hotel, Travel"
      />
    </div>

    <CompanyProductSelectFields
      selected={form.products || []}
      options={productOptions}
      loading={productOptionsLoading}
      error={productOptionsError}
      hasProductQuestion={hasProductQuestion}
      onSetupProductQuestion={onSetupProductQuestion}
      onChange={(products) => setField('products', products)}
    />
  </div>
);

export default CompanyCategoryProductsSection;
