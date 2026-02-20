import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, ArrowLeft, Building2, MapPin, Globe, Phone, Ticket, LayoutDashboard, User } from 'lucide-react';

const CompanyDetails = () => {
    const { selectedEvent, token } = useAuth();
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
                // Token from context
                const data = await eventService.getCompanyDetails(selectedEvent.id, companyId, token);
                setCompany(data);
            } catch (err) {
                setError('Failed to load company details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedEvent && companyId && token) {
            fetchDetails();
        }
    }, [selectedEvent, companyId, token]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4">
                <Loader2 className="animate-spin text-accent" size={32} />
                <p>Loading Company Details...</p>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="text-center p-12 text-text-secondary">
                <p className="mb-4">{error || 'Company not found.'}</p>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] mx-auto animate-fade-in">
            <div className="mb-8">
                <button
                    className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors bg-transparent border-none cursor-pointer p-0 mb-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} /> Back to List
                </button>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-border pb-6 gap-4">
                    <div className="flex items-center gap-6">
                        {company.company_logo ? (
                            <img src={company.company_logo} alt={company.company_name} className="w-20 h-20 object-contain bg-white rounded-md shadow-sm border border-border shrink-0" />
                        ) : (
                            <div className="w-20 h-20 bg-bg-tertiary rounded-md flex items-center justify-center text-text-secondary shrink-0">
                                <Building2 size={32} />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold mb-2 text-text-primary">{company.company_name}</h1>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide bg-purple-100 text-purple-800">{company.category}</span>
                                {company.stall_number && <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-semibold tracking-wide bg-bg-tertiary text-text-primary font-mono border border-border">Stall: {company.stall_number}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center shrink-0">
                        {/* Add actions here if needed */}
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/event/${selectedEvent.id}/companies?tab=additional_requirements&company_ids=${company.id}`)}
                        >
                            View Orders
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Info */}
                <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3"><Building2 size={18} /> Overview</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">OBF Number</label>
                            <span className="text-[0.9375rem] text-text-primary break-words">{company.obf_number}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Space Details</label>
                            <span className="text-[0.9375rem] text-text-primary break-words">{company.space} sq.m ({company.stall_detail?.space_type})</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Location</label>
                            <span className="text-[0.9375rem] text-text-primary break-words">{company.location || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Website</label>
                            {company.website ? (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-2 text-[0.9375rem] text-text-primary break-words underline decoration-border underline-offset-[3px] hover:text-text-link hover:decoration-current transition-colors">
                                    {company.website} <Globe size={12} />
                                </a>
                            ) : '-'}
                        </div>
                    </div>
                </div>

                {/* Badge Stats */}
                <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3"><Ticket size={18} /> Badge Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-bg-secondary p-4 rounded-md flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-text-secondary mb-1">Total Limit</span>
                            <span className="text-xl font-bold text-text-primary">{company.badge_limit}</span>
                        </div>
                        <div className="bg-bg-secondary p-4 rounded-md flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-text-secondary mb-1">Issued</span>
                            <span className="text-xl font-bold text-text-primary">{company.badge_issued}</span>
                        </div>
                        <div className="bg-bg-secondary p-4 rounded-md flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-text-secondary mb-1">Remaining</span>
                            <span className="text-xl font-bold text-text-primary">{company.remain_badge_limit_count}</span>
                        </div>
                        <div className="bg-bg-secondary p-4 rounded-md flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-text-secondary mb-1">Handed Over?</span>
                            <span className={`text-xl font-bold ${company.all_badges_handed_over ? 'text-green-600' : 'text-yellow-600'}`}>
                                {company.all_badges_handed_over ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Contact / Handover */}
                <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3"><Phone size={18} /> Contact & Handover</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Sales Person</label>
                            <span className="text-[0.9375rem] text-text-primary break-words">{company.sales_person || '-'}</span>
                        </div>
                        {company.handover_details && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-text-secondary font-medium">Handover Phone</label>
                                    <span className="text-[0.9375rem] text-text-primary break-words">{company.handover_details.phone_number || '-'}</span>
                                </div>
                                {company.handover_details.remarks && company.handover_details.remarks.length > 0 && (
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-text-secondary font-medium">Latest Remark</label>
                                        <span className="text-[0.9375rem] text-text-primary break-words">{company.handover_details.remarks[0].remarks}</span>
                                        <small className="text-xs text-text-tertiary mt-1">{company.handover_details.remarks[0].date}</small>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* System / Metadata */}
                <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3"><LayoutDashboard size={18} /> System Info</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Exhibitor UID</label>
                            <span className="text-[0.9375rem] text-text-primary break-words font-mono text-sm">{company.uid}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Payment Made</label>
                            <span className="text-[0.9375rem] text-text-primary break-words">{company.is_payment_made ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-text-secondary font-medium">Locked</label>
                            <span className="text-[0.9375rem] text-text-primary break-words">{company.is_company_submit_locked ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
