import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Search, Filter, Globe, Building2 } from 'lucide-react';
import './Companies.css';

const Companies = () => {
    const { selectedEvent } = useAuth();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

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
            if (!selectedEvent) return;

            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
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

        fetchCompanies();
    }, [selectedEvent, page, debouncedSearch]);

    const handleCompanyClick = (companyId) => {
        navigate(`/event/${selectedEvent.id}/companies/${companyId}`);
    };

    return (
        <div className="companies-page animate-fade-in">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Companies</h1>
                    <p className="page-subtitle">Total: {total} exhibitors</p>
                </div>

                <div className="actions-bar">
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
            </div>

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
        </div>
    );
};

export default Companies;
