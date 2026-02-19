import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Search, Filter, Globe, Building2 } from 'lucide-react';
import AdditionalRequirementsOrders from './AdditionalRequirementsOrders';
import './Companies.css';

const Companies = () => {
    const { selectedEvent, token } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper to get active tab from URL or default to 'exhibitors'
    const getActiveTab = () => searchParams.get('tab') || 'exhibitors';

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const activeTab = getActiveTab();

    const handleTabChange = (tabName) => {
        // preserve other params if needed, or simple switch
        // For simple tab switch we might want to clear other params or keep them?
        // Usually tab switch clears specific params of the other tab, but here we can just set tab
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tabName);
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

    useEffect(() => {
        const fetchCompanies = async () => {
            if (!selectedEvent || activeTab !== 'exhibitors') return;

            setLoading(true);
            setError(null);

            try {
                // Token from context
                const data = await eventService.getCompanies(selectedEvent.id, token, page, 20, 'obf_number', 'desc', debouncedSearch);
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
    }, [selectedEvent, page, debouncedSearch, activeTab, token]);

    const handleCompanyClick = (companyId) => {
        navigate(`/event/${selectedEvent.id}/companies/${companyId}`);
    };

    return (
        <div className="companies-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Companies</h1>
                    {activeTab === 'exhibitors' && <p className="page-subtitle">Total: {total} exhibitors</p>}
                </div>

                <div className="flex gap-2">
                    {activeTab === 'exhibitors' && (
                        <div className="actions-bar" style={{ margin: 0 }}>
                            <div className="search-box">
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    className="search-input"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-secondary">
                                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                                Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button
                    className={`pb-2 px-1 font-medium text-sm transition-colors relative ${activeTab === 'exhibitors'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => handleTabChange('exhibitors')}
                >
                    Exhibitors
                </button>
                <button
                    className={`pb-2 px-1 font-medium text-sm transition-colors relative ${activeTab === 'additional_requirements'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => handleTabChange('additional_requirements')}
                >
                    Additional Requirements
                </button>
            </div>

            {activeTab === 'exhibitors' ? (
                <>
                    {error && <div className="alert-error">{error}</div>}

                    <div className="companies-table-container">
                        <table className="companies-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Details</th>
                                    <th>Stall</th>
                                    <th>Category</th>
                                    <th>Badges</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="loading-row">
                                            <Loader2 className="spinner" size={24} />
                                        </td>
                                    </tr>
                                ) : companies.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-row">No companies found.</td>
                                    </tr>
                                ) : (
                                    companies.map((company) => (
                                        <tr
                                            key={company.id}
                                            className="clickable-row"
                                            onClick={() => handleCompanyClick(company.id)}
                                        >
                                            <td>
                                                <div className="company-cell">
                                                    {company.company_logo ? (
                                                        <img src={company.company_logo} alt={company.company_name} className="company-logo-sm" />
                                                    ) : (
                                                        <div className="company-icon-placeholder">
                                                            <Building2 size={16} />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="company-name">{company.company_name}</div>
                                                        <div className="company-slug">{company.company_slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="meta-info">
                                                    <div className="meta-item">OBF: {company.obf_number}</div>
                                                    {company.sales_person && <div className="meta-item">Sales: {company.sales_person}</div>}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="stall-info">{company.stall_number || '-'}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-category">{company.category}</span>
                                            </td>
                                            <td>
                                                <div className="badge-stats">
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

                    <div className="pagination">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>
                        <span className="page-info">Page {page}</span>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={companies.length < 20 || loading}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <AdditionalRequirementsOrders eventId={selectedEvent.id} />
            )}
        </div>
    );
};

export default Companies;
