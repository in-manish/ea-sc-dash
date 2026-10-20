import { useState } from 'react';
import { X } from 'lucide-react';
import { boostScopeList, toggleBoostScope } from '../domain/companyBoost';

const fieldClass =
  'w-full py-2.5 px-3.5 border border-blue-300 rounded-md text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

const chipBase = 'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all';

// Category codes the exhibitor list API understands in `category=`.
const CATEGORY_OPTIONS = ['NTO', 'STB', 'INTL', 'NTL'];

function OptionChips({ title, options, selected, onToggle }) {
  if (!options.length) return null;
  const selectedKeys = new Set(selected.map((s) => s.toLowerCase()));
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-text-secondary m-0">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onToggle(name)}
            className={`${chipBase} ${
              selectedKeys.has(name.toLowerCase())
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-text-secondary border-border hover:border-blue-400'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Top-of-form control for boosting a company to the top of the exhibitor listing. */
export default function BoostRankField({ form, setField, productOptions = [] }) {
  const [custom, setCustom] = useState('');
  const scope = boostScopeList(form.boost_scope);

  const toggle = (name) => setField('boost_scope', toggleBoostScope(scope, name));

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    if (!scope.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setField('boost_scope', [...scope, value]);
    }
    setCustom('');
  };

  return (
    <div className="rounded-lg border border-blue-300 bg-blue-50 p-4 space-y-3">
      <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide m-0">
        Boosted company
      </p>
      <div className="space-y-1.5 max-w-xs">
        <label className="text-xs font-medium text-text-secondary" htmlFor="boost-rank">
          Boost rank
        </label>
        <input
          id="boost-rank"
          className={fieldClass}
          type="number"
          min="1"
          step="1"
          inputMode="numeric"
          value={form.boost_rank}
          onChange={(e) => setField('boost_rank', e.target.value)}
          placeholder="Blank if not boosted"
        />
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-text-secondary m-0">
            Boost scope (none selected = boost on every listing)
          </p>
          <div className="flex flex-wrap gap-2 min-h-[2rem]">
            {scope.length === 0 && (
              <span className="text-xs text-text-tertiary py-1.5">All listings</span>
            )}
            {scope.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white"
              >
                {name}
                <button
                  type="button"
                  aria-label={`Remove ${name}`}
                  onClick={() => toggle(name)}
                  className="rounded-full p-0.5 hover:bg-blue-700"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <OptionChips title="Products" options={productOptions} selected={scope} onToggle={toggle} />
        <OptionChips
          title="Categories"
          options={CATEGORY_OPTIONS}
          selected={scope}
          onToggle={toggle}
        />

        <div className="space-y-1.5 max-w-md">
          <label className="text-xs font-medium text-text-secondary" htmlFor="boost-scope">
            Add your own
          </label>
          <div className="flex gap-2">
            <input
              id="boost-scope"
              className={fieldClass}
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder="Type a product or category, press Enter"
            />
            <button type="button" className="btn btn-secondary" onClick={addCustom}>
              Add
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-blue-900/80 m-0">
        Rank 1 shows first in the exhibitor list. With a scope, the boost applies only when the list
        is filtered by one of those products/categories.
      </p>
    </div>
  );
}
