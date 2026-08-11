import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { Loader2, Users } from 'lucide-react';
import CoExhibitorsTable from './CoExhibitorsTable';

const PAGE_SIZE = 20;

const CoExhibitorsList = ({ eventId, parentExhibitorId, headerAction, token }) => {
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
            <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-text-tertiary" />
                    <h3 className="text-sm font-semibold uppercase text-text-tertiary m-0">
                        Co-exhibitors
                    </h3>
                </div>
                {headerAction}
            </div>

            {error && (
                <div className="m-4 bg-red-50 text-red-800 p-4 border border-red-200 rounded-md text-sm">
                    {error}
                </div>
            )}

            <CoExhibitorsTable
                companies={companies}
                loading={loading}
                eventId={eventId}
                onRowClick={(id) => navigate(`/event/${eventId}/companies/${id}`)}
            />

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
