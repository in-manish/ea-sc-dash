import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Search, Filter, X, ShoppingCart, Settings, Upload, Building2, Bell } from 'lucide-react';
import AdditionalRequirementsOrders from './AdditionalRequirementsOrders';
import ARManager from './ARManager';
import ProductMatchmakingPanel from '../features/Companies/ui/ProductMatchmakingPanel';
import CompanyUploadModal from '../components/companies/CompanyUploadModal';
import CompanyUploadStatus from '../components/companies/CompanyUploadStatus';
import CompanyComprehensiveReportPanel from '../components/companies/CompanyComprehensiveReportPanel';
import { CreateCompanyButton } from '../features/Companies';
import ChecklistReminderTab from '../features/Companies/ui/ChecklistReminderTab';
import ExhibitorsListPanel from '../features/Companies/ui/ExhibitorsListPanel';

const Companies = () => {
    const { selectedEvent, token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper to get active tab and view from URL
    const activeTab = searchParams.get('tab') || 'exhibitors';
    const arView = searchParams.get('ar_view') || 'orders';
    const exhView = searchParams.get('exh_view') || 'list';
    const crView = searchParams.get('cr_view') || 'list';

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
            'parent_exhibitor_only', 'is_badge_printed', 'registered_co_exhibitor_count', 'is_featured', 'is_company_submit_locked', 'hand_over'
        ];

        filterKeys.forEach(key => {
            const val = searchParams.get(key);
            if (val) filters[key] = val;
        });

        return filters;
    };

    const [filters, setFilters] = useState(getInitialFilters());
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadRefreshKey, setUploadRefreshKey] = useState(0);
    const [listRefreshKey, setListRefreshKey] = useState(0);

    const handleExhViewChange = (viewName) => {
        const newParams = new URLSearchParams(searchParams);
        if (viewName === 'list') newParams.delete('exh_view');
        else newParams.set('exh_view', viewName);
        if (viewName !== 'checklist_reminder') newParams.delete('cr_view');
        setSearchParams(newParams);
    };

    const handleTabChange = (tabName) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tabName);
        if (tabName !== 'additional_requirements') {
            newParams.delete('ar_view');
        }
        if (tabName !== 'exhibitors') {
            newParams.delete('exh_view');
            newParams.delete('cr_view');
        }
        setSearchParams(newParams);
    };

    const handleARViewChange = (viewName) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('ar_view', viewName);
        setSearchParams(newParams);
    };

    const handleCrViewChange = (viewName) => {
        const newParams = new URLSearchParams(searchParams);
        if (viewName === 'list') newParams.delete('cr_view');
        else newParams.set('cr_view', viewName);
        setSearchParams(newParams);
    };

    // Legacy: tab=company_products → product matchmaking
    useEffect(() => {
        if (searchParams.get('tab') !== 'company_products') return;
        const next = new URLSearchParams(searchParams);
        next.set('tab', 'product_matchmaking');
        next.delete('prod_view');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    // Legacy: tab=checklist_reminder → Exhibitors sub-view
    useEffect(() => {
        if (searchParams.get('tab') !== 'checklist_reminder') return;
        const next = new URLSearchParams(searchParams);
        next.set('tab', 'exhibitors');
        next.set('exh_view', 'checklist_reminder');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

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
            'parent_exhibitor_only', 'is_badge_printed', 'registered_co_exhibitor_count', 'is_featured', 'is_company_submit_locked', 'hand_over'
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
                console.log("FIRST COMPANY:", data.results?.[0]);
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
    }, [selectedEvent, page, debouncedSearch, activeTab, filters, token, listRefreshKey]);

    return (
        <div className="w-full animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary m-0">Companies</h1>
                    {activeTab === 'exhibitors' && exhView === 'list' && (
                        <p className="text-sm text-text-secondary mt-1">Total: {total} exhibitors</p>
                    )}
                </div>

                <div className="flex gap-2 min-w-0">
                    {activeTab === 'exhibitors' && (
                        <div className="flex gap-3 items-center flex-wrap justify-end">
                            {selectedEvent && (
                                <CreateCompanyButton eventId={selectedEvent.id} />
                            )}
                            <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(true)}>
                                <Upload size={16} style={{ marginRight: '0.5rem' }} />
                                Upload CSV
                            </button>
                            {exhView === 'list' && (
                                <>
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                        <input
                                            type="text"
                                            placeholder="Search companies..."
                                            className="w-48 lg:w-60 py-2 pr-4 pl-9 border border-border rounded-md text-sm outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-white"
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
                                </>
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
                    className={`pb-2 px-1 font-medium text-sm transition-colors relative ${activeTab === 'product_matchmaking'
                        ? 'text-accent border-b-2 border-accent'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                    onClick={() => handleTabChange('product_matchmaking')}
                >
                    Product Matchmaking
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

            {activeTab === 'exhibitors' && (
                <div className="mb-6 flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg inline-flex">
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${exhView === 'list' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                        onClick={() => handleExhViewChange('list')}
                    >
                        <Building2 size={16} />
                        Exhibitors
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${exhView === 'upload_status' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                        onClick={() => handleExhViewChange('upload_status')}
                    >
                        <Upload size={16} />
                        Upload Status
                    </button>
                    <button
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${exhView === 'checklist_reminder' ? 'bg-white text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                        onClick={() => handleExhViewChange('checklist_reminder')}
                    >
                        <Bell size={16} />
                        Checklist Reminder
                    </button>
                </div>
            )}

            {activeTab === 'exhibitors' && exhView === 'list' && selectedEvent && (
                <CompanyComprehensiveReportPanel
                    eventId={selectedEvent.id}
                    token={token}
                    parentExhibitorId={filters.parent_exhibitor_id || ''}
                />
            )}

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

            {activeTab === 'exhibitors' && exhView === 'upload_status' && (
                <CompanyUploadStatus eventId={selectedEvent.id} token={token} refreshKey={uploadRefreshKey} />
            )}

            {activeTab === 'exhibitors' && exhView === 'list' && selectedEvent && (
                <ExhibitorsListPanel
                    eventId={selectedEvent.id}
                    token={token}
                    companies={companies}
                    loading={loading}
                    error={error}
                    page={page}
                    onPageChange={setPage}
                    onUpdated={() => setListRefreshKey((k) => k + 1)}
                />
            )}

            {activeTab === 'exhibitors' && exhView === 'checklist_reminder' && selectedEvent && (
                <ChecklistReminderTab
                    eventId={selectedEvent.id}
                    token={token}
                    view={crView}
                    onViewChange={handleCrViewChange}
                />
            )}

            {activeTab === 'additional_requirements' && arView === 'orders' && (
                <AdditionalRequirementsOrders eventId={selectedEvent.id} />
            )}

            {activeTab === 'additional_requirements' && arView === 'setup' && (
                <ARManager eventId={selectedEvent.id} />
            )}

            {activeTab === 'product_matchmaking' && selectedEvent && (
                <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm animate-fade-in">
                    <ProductMatchmakingPanel eventId={selectedEvent.id} token={token} />
                </div>
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

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Featured</h4>
                            <select
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                value={filters.is_featured || ''}
                                onChange={(e) => {
                                    const newFilters = { ...filters };
                                    if (e.target.value) newFilters.is_featured = e.target.value;
                                    else delete newFilters.is_featured;
                                    setFilters(newFilters);
                                }}
                            >
                                <option value="">All</option>
                                <option value="true">Featured</option>
                                <option value="false">Not Featured</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Handover</h4>
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
                                                const newFilters = { ...filters };
                                                if (opt.value) newFilters.hand_over = opt.value;
                                                else delete newFilters.hand_over;
                                                setFilters(newFilters);
                                                setPage(1);
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Submit Locked</h4>
                            <select
                                className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none transition-colors duration-200 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/10"
                                value={filters.is_company_submit_locked || ''}
                                onChange={(e) => {
                                    const newFilters = { ...filters };
                                    if (e.target.value) newFilters.is_company_submit_locked = e.target.value;
                                    else delete newFilters.is_company_submit_locked;
                                    setFilters(newFilters);
                                }}
                            >
                                <option value="">All</option>
                                <option value="true">Locked</option>
                                <option value="false">Unlocked</option>
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

            {/* Bulk Company Upload Modal */}
            {isUploadModalOpen && selectedEvent && (
                <CompanyUploadModal
                    eventId={selectedEvent.id}
                    token={token}
                    onClose={() => setIsUploadModalOpen(false)}
                    onUploaded={() => {
                        setUploadRefreshKey((k) => k + 1);
                        handleExhViewChange('upload_status');
                    }}
                />
            )}
        </div>
    );
};

export default Companies;
