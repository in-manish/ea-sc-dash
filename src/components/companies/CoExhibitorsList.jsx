import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Loader2, Building2, Users } from 'lucide-react';

const PAGE_SIZE = 20;

const CoExhibitorsList = ({ eventId, parentExhibitorId, token }) => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchCoExhibitors = async () => {
            if (!eventId || !parentExhibitorId || !token) return;

            setLoading(true);
            setError(null);

            try {
                const data = await eventService.getCompanies(
                    eventId,
                    token,
                    page,
                    PAGE_SIZE,
                    'obf_number',
                    'desc',
                    '',
                    { parent_exhibitor_id: parentExhibitorId }
                );
                setCompanies(data.results || []);
            } catch (err) {
                setError('Failed to load co-exhibitors.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoExhibitors();
    }, [eventId, parentExhibitorId, token, page]);

    return (
        <div className="bg-bg-primary border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                <Users size={16} className="text-text-tertiary" />
                <h3 className="text-sm font-semibold uppercase text-text-tertiary m-0">
                    Co-exhibitors
                </h3>
            </div>

            {error && (
                <div className="m-4 bg-red-50 text-red-800 p-4 border border-red-200 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                                Company
                            </th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                                Details
                            </th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                                Stall
                            </th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                                Category
                            </th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                                Badges
                            </th>
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
                                <td colSpan="5" className="text-center p-12 text-text-secondary text-sm">
                                    No co-exhibitors registered under this exhibitor.
                                </td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr
                                    key={company.id}
                                    className="cursor-pointer transition-colors duration-200 hover:bg-bg-secondary [&>td]:border-b [&>td]:border-border group"
                                    onClick={() => navigate(`/event/${eventId}/companies/${company.id}`)}
                                >
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="flex items-center gap-4">
                                            {company.company_logo ? (
                                                <img
                                                    src={company.company_logo}
                                                    alt={company.company_name}
                                                    className="w-10 h-10 object-contain bg-white rounded-sm border border-border"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-bg-tertiary rounded-sm flex items-center justify-center text-text-secondary">
                                                    <Building2 size={16} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-text-primary text-sm flex items-center gap-2">
                                                    {company.company_name}
                                                    <span className="text-[10px] font-mono text-text-tertiary opacity-40">
                                                        #{company.id}
                                                    </span>
                                                </div>
                                                {company.company_slug && (
                                                    <div className="text-xs text-text-tertiary mt-0.5">
                                                        {company.company_slug}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="flex flex-col gap-1 text-[0.8125rem] text-text-secondary">
                                            <div>OBF: {company.obf_number || '-'}</div>
                                            {company.sales_person && <div>Sales: {company.sales_person}</div>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="font-mono font-semibold bg-bg-tertiary py-1 px-2 rounded-sm inline-block text-[0.8125rem] text-text-primary">
                                            {company.stall_number || '-'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        {company.category ? (
                                            <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 tracking-wide">
                                                {company.category}
                                            </span>
                                        ) : (
                                            <span className="text-text-tertiary text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="flex flex-col gap-1 text-xs text-text-secondary">
                                            <span>Limit: {company.badge_limit ?? '-'}</span>
                                            <span>Issued: {company.badge_issued ?? '-'}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && companies.length > 0 && (
                <div className="flex justify-end items-center gap-4 px-6 py-4 border-t border-border">
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-text-secondary">Page {page}</span>
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        disabled={companies.length < PAGE_SIZE || loading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CoExhibitorsList;
