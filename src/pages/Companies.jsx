import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Search, Filter, Globe, Building2, X, Printer, ShoppingCart, Settings } from 'lucide-react';
import AdditionalRequirementsOrders from './AdditionalRequirementsOrders';
import ARManager from './ARManager';

const Companies = () => {
    const { selectedEvent, token } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper to get active tab and view from URL
    const activeTab = searchParams.get('tab') || 'exhibitors';
    const arView = searchParams.get('ar_view') || 'orders';

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    // Search and Filter State
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    // Initialize filters from searchParams
    const getInitialFilters = () => {
        const filters = {};
        const filterKeys = [
            'country', 'location', 'category', 'parent_exhibitor_id',
            'parent_exhibitor_only', 'is_badge_printed', 'registered_co_exhibitor_count'
        ];

        filterKeys.forEach(key => {
            const val = searchParams.get(key);
            if (val) filters[key] = val;
        });

        return filters;
    };

    const [filters, setFilters] = useState(getInitialFilters());

    const handleTabChange = (tabName) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tabName);
        if (tabName !== 'additional_requirements') {
            newParams.delete('ar_view');
        }
        setSearchParams(newParams);
    };

    const handleARViewChange = (viewName) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('ar_view', viewName);
        setSearchParams(newParams);
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on search
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Update searchParams for persistence
    useEffect(() => {
        if (activeTab !== 'exhibitors') return;

        const params = new URLSearchParams(searchParams);
        if (page > 1) params.set('page', page);
        else params.delete('page');

        if (debouncedSearch) params.set('q', debouncedSearch);
        else params.delete('q');

        const filterKeys = [
            'country', 'location', 'category', 'parent_exhibitor_id',
            'parent_exhibitor_only', 'is_badge_printed', 'registered_co_exhibitor_count'
        ];

        filterKeys.forEach(key => {
            if (filters[key]) params.set(key, filters[key]);
            else params.delete(key);
        });

        setSearchParams(params, { replace: true });
    }, [page, debouncedSearch, filters, activeTab]);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (!selectedEvent || activeTab !== 'exhibitors') return;

            setLoading(true);
            setError(null);

            try {
                // Token from context
                const data = await eventService.getCompanies(
                    selectedEvent.id,
                    token,
                    page,
                    20,
                    'obf_number',
                    'desc',
                    debouncedSearch,
                    filters
                );
                setCompanies(data.results);
                setTotal(data.exhibitor_count || 0); // Using exhibitor_count as total based on API response
            } catch (err) {
                setError('Failed to load companies. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedEvent && token) {
            fetchCompanies();
        }
    }, [selectedEvent, page, debouncedSearch, activeTab, filters, token]);

    const handleCompanyClick = (companyId) => {
        navigate(`/event/${selectedEvent.id}/companies/${companyId}`);
    };

    return (
        <div className="w-full animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary m-0">Companies</h1>
                    {activeTab === 'exhibitors' && <p className="text-sm text-text-secondary mt-1">Total: {total} exhibitors</p>}
                </div>

                <div className="flex gap-2">
                    {activeTab === 'exhibitors' && (
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    className="w-60 py-2 pr-4 pl-9 border border-border rounded-md text-sm outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button
                                className={`btn ${Object.keys(filters).length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setIsFilterDrawerOpen(true)}
                            >
                                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                                Filter {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
                            </button>
                            {Object.keys(filters).length > 0 && (
                                <button className="btn btn-ghost btn-sm" onClick={() => setFilters({})}>
                                    Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border mb-6">
                <button
                    className={`pb-2 px-1 font-medium text-sm transition-colors relative ${activeTab === 'exhibitors'
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                    onClick={() => handleTabChange('exhibitors')}
                >
                    Exhibitors
                </button>
                <button
                    className={`pb-2 px-1 font-medium text-sm transition-colors relative ${activeTab === 'additional_requirements'
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                    onClick={() => handleTabChange('additional_requirements')}
                >
                    Additional Requirements
                </button>
            </div>

            {activeTab === 'additional_requirements' && (
                <div className="mb-6 flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg inline-flex">
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${arView === 'orders' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                        onClick={() => handleARViewChange('orders')}
                    >
                        <ShoppingCart size={16} />
                        Requirement Orders
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${arView === 'setup' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                        onClick={() => handleARViewChange('setup')}
                    >
                        <Settings size={16} />
                        Requirement Setup
                    </button>
                </div>
            )}

            {activeTab === 'exhibitors' && (
                <>
                    {error && <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">{error}</div>}

                    <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Company</th>
                                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Details</th>
                                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Stall</th>
                                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Category</th>
                                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Badges</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-12 text-text-secondary">
                                            <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                                        </td>
                                    </tr>
                                ) : companies.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-12 text-text-secondary">No companies found.</td>
                                    </tr>
                                ) : (
                                    companies.map((company) => (
                                        <tr
                                            key={company.id}
                                            className="cursor-pointer transition-colors duration-200 hover:bg-bg-secondary [&>td]:border-b [&>td]:border-border group"
                                            onClick={() => handleCompanyClick(company.id)}
                                        >
                                            <td className="py-4 px-6 align-middle group-last:border-b-0">
                                                <div className="flex items-center gap-4">
                                                    {company.company_logo ? (
                                                        <img src={company.company_logo} alt={company.company_name} className="w-10 h-10 object-contain bg-white rounded-sm border border-border" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-bg-tertiary rounded-sm flex items-center justify-center text-text-secondary">
                                                            <Building2 size={16} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-text-primary text-sm flex items-center">
                                                            {company.company_name}
                                                            {company.is_badge_printed && (
                                                                <Printer
                                                                    size={14}
                                                                    className="ml-2 text-green-600"
                                                                    title="Badge Printed"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-text-tertiary mt-0.5">{company.company_slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 align-middle group-last:border-b-0">
                                                <div className="flex flex-col gap-1 text-[0.8125rem] text-text-secondary">
                                                    <div>OBF: {company.obf_number}</div>
                                                    {company.sales_person && <div>Sales: {company.sales_person}</div>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 align-middle group-last:border-b-0">
                                                <div className="font-mono font-semibold bg-bg-tertiary py-1 px-2 rounded-sm inline-block text-[0.8125rem] text-text-primary">{company.stall_number || '-'}</div>
                                            </td>
                                            <td className="py-4 px-6 align-middle group-last:border-b-0">
                                                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 tracking-wide">{company.category}</span>
                                            </td>
                                            <td className="py-4 px-6 align-middle group-last:border-b-0">
                                                <div className="flex flex-col gap-1 text-xs text-text-secondary">
                                                    <span>Limit: {company.badge_limit}</span>
                                                    <span>Issued: {company.badge_issued}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end items-center gap-4 mt-6">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-text-secondary">Page {page}</span>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={companies.length < 20 || loading}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {activeTab === 'additional_requirements' && arView === 'orders' && (
                <AdditionalRequirementsOrders eventId={selectedEvent.id} />
            )}

            {activeTab === 'additional_requirements' && arView === 'setup' && (
                <ARManager eventId={selectedEvent.id} />
            )}

            {/* Filter Drawer */}
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1100] transition-opacity duration-300 ${isFilterDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsFilterDrawerOpen(false)}>
                <div className={`absolute top-0 right-0 w-[400px] h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h3 className="text-lg font-bold m-0 text-text-primary">Filters</h3>
                        <button className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary" onClick={() => setIsFilterDrawerOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Locations</h4>
                            <input
                                type="text"
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                placeholder="Enter location (e.g. Mumbai, New Delhi)"
                                value={filters.location || ''}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Country</h4>
                            <input
                                type="text"
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                placeholder="Enter country..."
                                value={filters.country || ''}
                                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Category</h4>
                            <input
                                type="text"
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                placeholder="Enter category (e.g. Hotel, Travel)"
                                value={filters.category || ''}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Parent Exhibitor ID</h4>
                            <input
                                type="text"
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                placeholder="Enter ID..."
                                value={filters.parent_exhibitor_id || ''}
                                onChange={(e) => setFilters({ ...filters, parent_exhibitor_id: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Parent Exhibitor Only</h4>
                            <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-accent"
                                    checked={filters.parent_exhibitor_only === 'true'}
                                    onChange={(e) => {
                                        const newFilters = { ...filters };
                                        if (e.target.checked) newFilters.parent_exhibitor_only = 'true';
                                        else delete newFilters.parent_exhibitor_only;
                                        setFilters(newFilters);
                                    }}
                                />
                                <span className="text-sm text-text-primary">Only show parent exhibitors</span>
                            </label>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Badge Printed</h4>
                            <select
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                value={filters.is_badge_printed || ''}
                                onChange={(e) => {
                                    const newFilters = { ...filters };
                                    if (e.target.value) newFilters.is_badge_printed = e.target.value;
                                    else delete newFilters.is_badge_printed;
                                    setFilters(newFilters);
                                }}
                            >
                                <option value="">All</option>
                                <option value="true">Printed</option>
                                <option value="false">Not Printed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Co-Exhibitor Count</h4>
                            <select
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                value={filters.registered_co_exhibitor_count || ''}
                                onChange={(e) => {
                                    const newFilters = { ...filters };
                                    if (e.target.value) newFilters.registered_co_exhibitor_count = e.target.value;
                                    else delete newFilters.registered_co_exhibitor_count;
                                    setFilters(newFilters);
                                }}
                            >
                                <option value="">All</option>
                                <option value="lt1">No Co-Exhibitors</option>
                                <option value="gt1">Has Co-Exhibitors</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border flex gap-4 bg-bg-secondary">
                        <button className="btn btn-secondary w-full" onClick={() => setFilters({})}>
                            Reset All
                        </button>
                        <button className="btn btn-primary w-full" onClick={() => setIsFilterDrawerOpen(false)}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Companies;
