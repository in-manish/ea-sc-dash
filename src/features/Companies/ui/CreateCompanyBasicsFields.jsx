import React from 'react';
import { COMPANY_KINDS } from '../domain/companyFormDefaults';
import { formatCompanySearchLabel } from '../domain/formatCompanySearchLabel';
import ParentCompanySearch from './ParentCompanySearch';

const fieldClass =
  'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10';

const CreateCompanyBasicsFields = ({
  form,
  setField,
  eventId,
  token,
  parentLocked,
  isEdit = false,
  countries,
  countriesLoading,
}) => {
  const isCo = form.kind === COMPANY_KINDS.CO_EXHIBITOR;

  return (
    <div className="space-y-4">
      {isEdit ? (
        <span
          className={`inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide ${
            isCo ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isCo ? 'Co-exhibitor' : 'Parent exhibitor'}
        </span>
      ) : (
        !parentLocked && (
          <div className="flex gap-2 p-1 bg-bg-secondary border border-border rounded-lg">
            {[
              { id: COMPANY_KINDS.PARENT, label: 'Parent exhibitor' },
              { id: COMPANY_KINDS.CO_EXHIBITOR, label: 'Co-exhibitor' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  form.kind === opt.id
                    ? 'bg-white text-accent shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setField('kind', opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Company name *
        </label>
        <input
          className={fieldClass}
          value={form.company_name}
          onChange={(e) => setField('company_name', e.target.value)}
          required
        />
        {isEdit && (
          <label className="flex items-start gap-2 text-sm cursor-pointer pt-1">
            <input
              type="checkbox"
              className="w-4 h-4 accent-accent mt-0.5 shrink-0"
              checked={form.apply_title_case}
              onChange={(e) => setField('apply_title_case', e.target.checked)}
            />
            <span>
              <span className="font-medium text-text-primary">
                Format name as Title Case
              </span>
              <span className="block text-xs text-text-tertiary mt-0.5">
                {form.apply_title_case
                  ? 'On — company name will be shown in Title Case (e.g. Acme Corp).'
                  : 'Off — keep the company name as entered (ignore title case).'}
              </span>
            </span>
          </label>
        )}
      </div>

      {isCo ? (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Parent exhibitor *
          </label>
          <ParentCompanySearch
            eventId={eventId}
            token={token}
            value={form.parent_exhibitor}
            label={form.parent_exhibitor_label}
            locked={parentLocked}
            onSelect={(c) => {
              setField('parent_exhibitor', String(c.id));
              setField('parent_exhibitor_label', formatCompanySearchLabel(c));
            }}
            onClear={() => {
              setField('parent_exhibitor', '');
              setField('parent_exhibitor_label', '');
            }}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            OBF number{isEdit ? '' : ' *'}
          </label>
          <input
            className={fieldClass}
            value={form.obf_number}
            onChange={(e) => setField('obf_number', e.target.value)}
            maxLength={10}
            placeholder="e.g. K-57"
            required={!isEdit}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Website
          </label>
          <input
            className={fieldClass}
            value={form.website}
            onChange={(e) => setField('website', e.target.value)}
            placeholder="https://"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Location (country)
          </label>
          <select
            className={fieldClass}
            value={form.location}
            onChange={(e) => setField('location', e.target.value)}
            disabled={countriesLoading}
          >
            <option value="">— Optional —</option>
            {countries.map((c) => (
              <option key={c.key} value={c.key}>
                {c.flag ? `${c.flag} ` : ''}
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Company detail
        </label>
        <textarea
          className={`${fieldClass} min-h-[72px] resize-y`}
          value={form.company_detail}
          onChange={(e) => setField('company_detail', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default CreateCompanyBasicsFields;
