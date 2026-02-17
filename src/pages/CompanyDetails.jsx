import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, ArrowLeft, Building2, MapPin, Globe, Phone, Ticket, LayoutDashboard, User } from 'lucide-react';
import './CompanyDetails.css';

const CompanyDetails = () => {
    const { selectedEvent } = useAuth();
    const { companyId } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!selectedEvent || !companyId) return;

            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const data = await eventService.getCompanyDetails(selectedEvent.id, companyId, token);
                setCompany(data);
            } catch (err) {
                setError('Failed to load company details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [selectedEvent, companyId]);

    if (loading) {
        return (
            <div className="loading-container">
                <Loader2 className="spinner" size={32} />
                <p>Loading Company Details...</p>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="error-container">
                <p>{error || 'Company not found.'}</p>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="company-details-page animate-fade-in">
            <div className="details-header">
                <button className="back-link" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Back to List
                </button>

                <div className="header-content">
                    <div className="company-branding">
                        {company.company_logo ? (
                            <img src={company.company_logo} alt={company.company_name} className="company-logo-lg" />
                        ) : (
                            <div className="company-icon-placeholder-lg">
                                <Building2 size={32} />
                            </div>
                        )}
                        <div>
                            <h1 className="company-title">{company.company_name}</h1>
                            <div className="company-meta">
                                <span className="badge badge-category">{company.category}</span>
                                {company.stall_number && <span className="badge badge-stall">Stall: {company.stall_number}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="header-actions">
                        {/* Add actions here if needed */}
                    </div>
                </div>
            </div>

            <div className="details-grid">
                {/* Main Info */}
                <div className="details-card">
                    <h3 className="card-title"><Building2 size={18} /> Overview</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <label>OBF Number</label>
                            <span>{company.obf_number}</span>
                        </div>
                        <div className="info-item">
                            <label>Space Details</label>
                            <span>{company.space} sq.m ({company.stall_detail?.space_type})</span>
                        </div>
                        <div className="info-item">
                            <label>Location</label>
                            <span>{company.location || '-'}</span>
                        </div>
                        <div className="info-item">
                            <label>Website</label>
                            {company.website ? (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="link-flex">
                                    {company.website} <Globe size={12} />
                                </a>
                            ) : '-'}
                        </div>
                    </div>
                </div>

                {/* Badge Stats */}
                <div className="details-card">
                    <h3 className="card-title"><Ticket size={18} /> Badge Statistics</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Total Limit</span>
                            <span className="stat-value">{company.badge_limit}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Issued</span>
                            <span className="stat-value">{company.badge_issued}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Remaining</span>
                            <span className="stat-value">{company.remain_badge_limit_count}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Handed Over?</span>
                            <span className={`stat-value ${company.all_badges_handed_over ? 'text-success' : 'text-warning'}`}>
                                {company.all_badges_handed_over ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact / Handover */}
                <div className="details-card">
                    <h3 className="card-title"><Phone size={18} /> Contact & Handover</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <label>Sales Person</label>
                            <span>{company.sales_person || '-'}</span>
                        </div>
                        {company.handover_details && (
                            <>
                                <div className="info-item">
                                    <label>Handover Phone</label>
                                    <span>{company.handover_details.phone_number || '-'}</span>
                                </div>
                                {company.handover_details.remarks && company.handover_details.remarks.length > 0 && (
                                    <div className="info-item">
                                        <label>Latest Remark</label>
                                        <span>{company.handover_details.remarks[0].remarks}</span>
                                        <small className="text-muted">{company.handover_details.remarks[0].date}</small>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* System / Metadata */}
                <div className="details-card">
                    <h3 className="card-title"><LayoutDashboard size={18} /> System Info</h3>
                    <div className="info-list">
                        <div className="info-item">
                            <label>Exhibitor UID</label>
                            <span className="text-mono">{company.uid}</span>
                        </div>
                        <div className="info-item">
                            <label>Payment Made</label>
                            <span>{company.is_payment_made ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="info-item">
                            <label>Locked</label>
                            <span>{company.is_company_submit_locked ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
