import React from 'react';
import { COMPANY_KINDS } from '../domain/companyFormDefaults';

const fieldClass =
  'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10';

const EditCompanyLimitsFields = ({ form, setField }) => {
  const isParent = form.kind === COMPANY_KINDS.PARENT;

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
        Limits & status
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isParent && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Space (sqm)</label>
            <input
              className={fieldClass}
              type="number"
              min="0"
              value={form.space}
              onChange={(e) => setField('space', e.target.value)}
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Badge limit</label>
          <input
            className={fieldClass}
            type="number"
            min="0"
            value={form.badge_limit}
            onChange={(e) => setField('badge_limit', e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Meeting diary limit
          </label>
          <input
            className={fieldClass}
            type="number"
            min="0"
            value={form.meeting_diary_limit}
            onChange={(e) => setField('meeting_diary_limit', e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-text-secondary">Sales person</label>
          <input
            className={fieldClass}
            value={form.sales_person}
            onChange={(e) => setField('sales_person', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-accent"
            checked={form.is_badge_printed}
            onChange={(e) => setField('is_badge_printed', e.target.checked)}
          />
          Badge printed
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-accent"
            checked={form.is_payment_made}
            onChange={(e) => setField('is_payment_made', e.target.checked)}
          />
          Payment made
        </label>
      </div>
    </div>
  );
};

export default EditCompanyLimitsFields;
