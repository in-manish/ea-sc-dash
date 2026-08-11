import { Search, X } from 'lucide-react';

const EmailTemplateFilters = ({
    searchInput,
    onSearchChange,
    filters,
    onFilterChange,
    filterOptions,
    onClear,
    hasActiveFilters,
}) => {
    return (
        <div className="bg-bg-primary border border-border rounded-xl p-4 mb-4 shadow-sm space-y-3">
            <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                    Search
                </span>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                        size={16}
                    />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search templates..."
                        className="input-field pl-9 w-full text-sm"
                    />
                </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                        Email Name
                    </span>
                    <select
                        value={filters.email_name}
                        onChange={(e) => onFilterChange('email_name', e.target.value)}
                        className="input-field w-full text-sm py-2"
                    >
                        <option value="">All names</option>
                        {(filterOptions.email_names || []).map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                        Template Type
                    </span>
                    <select
                        value={filters.template_type}
                        onChange={(e) => onFilterChange('template_type', e.target.value)}
                        className="input-field w-full text-sm py-2"
                    >
                        <option value="">All types</option>
                        {(filterOptions.template_types || []).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                        Status
                    </span>
                    <div className="flex gap-2">
                        <select
                            value={filters.is_active}
                            onChange={(e) => onFilterChange('is_active', e.target.value)}
                            className="input-field flex-1 text-sm py-2"
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="px-3 rounded-lg border border-border text-text-tertiary hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                                title="Clear filters"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default EmailTemplateFilters;
