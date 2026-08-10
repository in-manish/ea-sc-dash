import { Search } from 'lucide-react';
import { SC_LIST_ROLE_OPTIONS } from '../../ScAuth/domain/scLoginUser';
import ManageUsersSearchActions from './ManageUsersSearchActions';

export default function ManageUsersFilters({
  filters,
  isLoading,
  showAdvancedFilters,
  onToggleFilters,
  onChange,
  onSubmit,
  onReset,
  onRefresh,
}) {
  const showReset = Object.values(filters).some((v) => v !== '');

  return (
    <div className="bg-bg-primary rounded-lg border border-border shadow-sm mb-6 overflow-hidden">
      <form onSubmit={onSubmit} className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={onChange}
              className="pl-10 input-field"
              placeholder="Search by name, email or phone (partial match)..."
            />
          </div>
          <div className="w-full md:w-[200px]">
            <select
              name="role"
              value={filters.role || ''}
              onChange={onChange}
              className="input-field py-2.5"
              aria-label="Filter by role"
            >
              {SC_LIST_ROLE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <ManageUsersSearchActions
            showAdvancedFilters={showAdvancedFilters}
            onToggleFilters={onToggleFilters}
            onReset={onReset}
            onRefresh={onRefresh}
            isLoading={isLoading}
            showReset={showReset}
          />
        </div>

        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <div className="input-group">
              <label className="input-label">Name Filter</label>
              <input type="text" name="name" value={filters.name} onChange={onChange} className="input-field" placeholder="Case-insensitive name..." />
            </div>
            <div className="input-group">
              <label className="input-label">Email Filter</label>
              <input type="text" name="email" value={filters.email} onChange={onChange} className="input-field" placeholder="Partial email..." />
            </div>
            <div className="input-group">
              <label className="input-label">Phone Filter</label>
              <input type="text" name="phone_number" value={filters.phone_number} onChange={onChange} className="input-field" placeholder="Partial phone..." />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="input-group">
                <label className="input-label">Email Verified</label>
                <select name="is_verified_email" value={filters.is_verified_email} onChange={onChange} className="input-field py-2">
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Phone Verified</label>
                <select name="is_verified_phone_number" value={filters.is_verified_phone_number} onChange={onChange} className="input-field py-2">
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
