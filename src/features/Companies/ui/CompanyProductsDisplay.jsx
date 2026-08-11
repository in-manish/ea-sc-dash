import React from 'react';
import { Package } from 'lucide-react';

/** Read-only category + product chips for company detail. */
const CompanyProductsDisplay = ({ category, products }) => {
  const list = Array.isArray(products) ? products.filter(Boolean) : [];
  const categoryLabel = (category || '').trim();

  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm mt-8">
      <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3">
        <Package size={18} /> Category & products
      </h3>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <p className="text-xs text-text-secondary font-medium">Category</p>
          {categoryLabel ? (
            <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800">
              {categoryLabel}
            </span>
          ) : (
            <p className="text-sm text-text-tertiary">No category set.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-text-secondary font-medium">Products</p>
          {list.length === 0 ? (
            <p className="text-sm text-text-tertiary">No products set for this company.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {list.map((name) => (
                <span
                  key={name}
                  className="inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-bg-secondary text-text-primary border border-border"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProductsDisplay;
