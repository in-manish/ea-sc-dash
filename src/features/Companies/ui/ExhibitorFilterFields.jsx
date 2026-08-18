const inputClass =
  'w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10';

function FilterField({ title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">{title}</h4>
      {children}
    </div>
  );
}

function setOrDelete(filters, key, value) {
  const next = { ...filters };
  if (value) next[key] = value;
  else delete next[key];
  return next;
}

export default function ExhibitorFilterFields({ filters, setFilters, onPageReset }) {
  return (
    <>
      <FilterField title="Locations">
        <input
          type="text"
          className={inputClass}
          placeholder="Enter location (e.g. Mumbai, New Delhi)"
          value={filters.location || ''}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
      </FilterField>

      <FilterField title="Country">
        <input
          type="text"
          className={inputClass}
          placeholder="Enter country..."
          value={filters.country || ''}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
      </FilterField>

      <FilterField title="Category">
        <input
          type="text"
          className={inputClass}
          placeholder="Enter category (e.g. Hotel, Travel)"
          value={filters.category || ''}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
      </FilterField>

      <FilterField title="Parent Exhibitor ID">
        <input
          type="text"
          className={inputClass}
          placeholder="Enter ID..."
          value={filters.parent_exhibitor_id || ''}
          onChange={(e) => setFilters({ ...filters, parent_exhibitor_id: e.target.value })}
        />
      </FilterField>

      <FilterField title="Parent Exhibitor Only">
        <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary">
          <input
            type="checkbox"
            className="w-4 h-4 accent-accent"
            checked={filters.parent_exhibitor_only === 'true'}
            onChange={(e) => {
              const next = { ...filters };
              if (e.target.checked) next.parent_exhibitor_only = 'true';
              else delete next.parent_exhibitor_only;
              setFilters(next);
            }}
          />
          <span className="text-sm text-text-primary">Only show parent exhibitors</span>
        </label>
      </FilterField>

      <FilterField title="Badge Printed">
        <select
          className={inputClass}
          value={filters.is_badge_printed || ''}
          onChange={(e) => setFilters(setOrDelete(filters, 'is_badge_printed', e.target.value))}
        >
          <option value="">All</option>
          <option value="true">Printed</option>
          <option value="false">Not Printed</option>
        </select>
      </FilterField>

      <FilterField title="Co-Exhibitor Count">
        <select
          className={inputClass}
          value={filters.registered_co_exhibitor_count || ''}
          onChange={(e) =>
            setFilters(setOrDelete(filters, 'registered_co_exhibitor_count', e.target.value))
          }
        >
          <option value="">All</option>
          <option value="lt1">No Co-Exhibitors</option>
          <option value="gt1">Has Co-Exhibitors</option>
        </select>
      </FilterField>

      <FilterField title="Featured">
        <select
          className={inputClass}
          value={filters.is_featured || ''}
          onChange={(e) => setFilters(setOrDelete(filters, 'is_featured', e.target.value))}
        >
          <option value="">All</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
      </FilterField>

      <FilterField title="Handover">
        <div className="flex flex-wrap gap-2 mt-1">
          {[
            { value: '', label: 'All' },
            { value: 'true', label: 'Handed Over' },
            { value: 'false', label: 'Not Handed Over' },
          ].map((opt) => {
            const isActive = (filters.hand_over || '') === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                className={`py-2 px-3.5 border rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-primary border-border text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-secondary'
                }`}
                onClick={() => {
                  setFilters(setOrDelete(filters, 'hand_over', opt.value));
                  onPageReset();
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </FilterField>

      <FilterField title="Submit Locked">
        <select
          className={inputClass}
          value={filters.is_company_submit_locked || ''}
          onChange={(e) =>
            setFilters(setOrDelete(filters, 'is_company_submit_locked', e.target.value))
          }
        >
          <option value="">All</option>
          <option value="true">Locked</option>
          <option value="false">Unlocked</option>
        </select>
      </FilterField>
    </>
  );
}
