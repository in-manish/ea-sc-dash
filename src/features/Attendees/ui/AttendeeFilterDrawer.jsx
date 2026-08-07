import { X } from 'lucide-react';
import { ATTENDEE_TYPE_OPTIONS } from '../constants';

const AttendeeFilterDrawer = ({
    isOpen,
    onClose,
    filters,
    setFilters,
    updateFilter,
    toggleAttendeeType,
    toggleBooleanFilter,
    clearFilters,
}) => (
    <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
    >
        <div
            className={`absolute top-0 right-0 w-[400px] h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold m-0">Filters</h3>
                <button
                    className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                        Attendee Type
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {ATTENDEE_TYPE_OPTIONS.map((type) => (
                            <button
                                key={type}
                                className={`py-2 px-3.5 border rounded-full text-xs font-medium transition-all duration-200 ${filters.attendee_type?.includes(type) ? 'bg-accent text-white border-accent' : 'bg-bg-primary border-border text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-secondary'}`}
                                onClick={() => toggleAttendeeType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                            Exhibitor ID
                        </h4>
                        <input
                            type="text"
                            className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                            placeholder="Enter exhibitor ID..."
                            value={filters.exhibitor_id || ''}
                            onChange={(e) => updateFilter('exhibitor_id', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                            Parent Exhibitor ID
                        </h4>
                        <input
                            type="text"
                            className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                            placeholder="Enter parent exhibitor ID..."
                            value={filters.parent_exhibitor_id || ''}
                            onChange={(e) => updateFilter('parent_exhibitor_id', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                        Registration Type
                    </h4>
                    <select
                        className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                        value={filters.reg_type || ''}
                        onChange={(e) => setFilters({ ...filters, reg_type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="ONLINE">Online</option>
                        <option value="ON_SPOT">On Spot</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                            City
                        </h4>
                        <input
                            type="text"
                            className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                            placeholder="Enter city..."
                            value={filters.city || ''}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                            Country
                        </h4>
                        <input
                            type="text"
                            className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                            placeholder="Enter country..."
                            value={filters.country || ''}
                            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                        Status Filters
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { key: 'is_poc', label: 'Point of Contact' },
                            { key: 'check_in', label: 'Checked In' },
                            { key: 'email_sent', label: 'Email Sent' },
                            { key: 'whatsapp_sent', label: 'WhatsApp Sent' },
                        ].map(({ key, label }) => (
                            <label
                                key={key}
                                className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary"
                            >
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-accent"
                                    checked={filters[key] === 'true'}
                                    onChange={(e) => toggleBooleanFilter(key, e.target.checked)}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">
                        Registration Date
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary">From</label>
                            <input
                                type="date"
                                className="p-2 border border-border rounded-md text-sm outline-none"
                                value={filters.created_at_start || ''}
                                onChange={(e) =>
                                    setFilters({ ...filters, created_at_start: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary">To</label>
                            <input
                                type="date"
                                className="p-2 border border-border rounded-md text-sm outline-none"
                                value={filters.created_at_end || ''}
                                onChange={(e) =>
                                    setFilters({ ...filters, created_at_end: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-border flex gap-4 bg-bg-secondary">
                <button className="btn btn-secondary w-full" onClick={clearFilters}>
                    Reset All
                </button>
                <button className="btn btn-primary w-full" onClick={onClose}>
                    Apply Filters
                </button>
            </div>
        </div>
    </div>
);

export default AttendeeFilterDrawer;
