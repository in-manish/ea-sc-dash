import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { meetingService } from '../../services/meetingService';
import { useAuth } from '../../contexts/AuthContext';
import { Search, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';

const MeetingList = () => {
    const { id: eventId } = useParams();
    const { token } = useAuth();
    
    const [filters, setFilters] = useState({
        email: '',
        name: '',
        evc_id: '',
        badge_id: ''
    });
    
    const [page, setPage] = useState(1);
    const [size] = useState(20);
    const [data, setData] = useState({ count: 0, results: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getCleanFilters = () => {
        const clean = { page, size };
        Object.keys(filters).forEach(k => {
            if (filters[k]) clean[k] = filters[k].trim();
        });
        return clean;
    };

    const fetchMeetings = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await meetingService.getAdminMeetings(token, eventId, getCleanFilters());
            setData(response);
        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.detail || 'Failed to fetch meetings');
        } finally {
            setLoading(false);
        }
    }, [token, eventId, page, size, filters]); // include filters to fetch specific search

    useEffect(() => {
        fetchMeetings();
    }, [page]); // Re-fetch on page change

    const handleSearch = (e) => {
        e.preventDefault();
        if (page === 1) {
            fetchMeetings();
        } else {
            setPage(1); // changing page to 1 will trigger useEffect
        }
    };

    const handleClear = () => {
        setFilters({ email: '', name: '', evc_id: '', badge_id: '' });
        if (page === 1) {
            // setTimeout to let state update, or just use a flag. 
            // the cleaner way is to trigger fetch directly with empty filters
            setLoading(true);
            meetingService.getAdminMeetings(token, eventId, { page: 1, size })
                .then(res => setData(res))
                .catch(err => setError(err.response?.data?.msg || 'Failed to fetch meetings'))
                .finally(() => setLoading(false));
        } else {
            setPage(1);
        }
    };

    const totalPages = Math.ceil(data.count / size);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Filter Form */}
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6 border-b border-border">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        placeholder="Search email..."
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Search name..."
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">EVC IDs (comma-separated)</label>
                    <input
                        type="text"
                        name="evc_id"
                        value={filters.evc_id}
                        onChange={handleFilterChange}
                        placeholder="e.g. 101,202"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Badge IDs (comma-separated)</label>
                    <input
                        type="text"
                        name="badge_id"
                        value={filters.badge_id}
                        onChange={handleFilterChange}
                        placeholder="e.g. 11,22"
                        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
                    />
                </div>
                
                <div className="lg:col-span-4 flex gap-3 mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white border-none rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Search size={16} />
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-bg-secondary text-text-primary border border-border rounded-lg font-medium hover:bg-bg-tertiary transition-colors disabled:opacity-50"
                    >
                        Clear
                    </button>
                    {loading && <RefreshCw size={20} className="animate-spin text-text-secondary ml-2 self-center" />}
                </div>
            </form>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-red-600 text-sm">{error}</div>
                </div>
            )}

            {/* Data Table */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Meetings</h3>
                    <div className="text-sm text-text-secondary">
                        Total Records: <strong className="text-text-primary">{data.count}</strong>
                    </div>
                </div>

                <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-bg-secondary text-text-secondary uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 border-b border-border">ID / Status</th>
                                <th className="px-4 py-3 border-b border-border">Schedule</th>
                                <th className="px-4 py-3 border-b border-border">Sender</th>
                                <th className="px-4 py-3 border-b border-border">Receiver</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.results || []).map((meeting) => (
                                <tr key={meeting.meeting_id} className="border-b border-border last:border-0 hover:bg-bg-secondary/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-text-primary">#{meeting.meeting_id}</div>
                                        <div className="mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                meeting.status === 'ACCEPT' ? 'bg-green-500/10 text-green-600' :
                                                meeting.status === 'REQUEST' ? 'bg-blue-500/10 text-blue-600' :
                                                meeting.status === 'REJECT' ? 'bg-red-500/10 text-red-600' :
                                                'bg-bg-secondary text-text-secondary'
                                            }`}>
                                                {meeting.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-text-primary">{meeting.meeting_date}</div>
                                        <div className="text-xs text-text-secondary">
                                            {meeting.meeting_start_time} - {meeting.meeting_end_time} ({meeting.duration}m)
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-text-primary">{meeting.sender?.name || 'N/A'}</div>
                                        <div className="text-xs text-text-secondary">{meeting.sender?.email}</div>
                                        <div className="text-[10px] text-text-tertiary mt-0.5">EVC: {meeting.sender?.evc_id} | Badge: {meeting.sender?.badge_id}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-text-primary">{meeting.receiver?.name || 'N/A'}</div>
                                        <div className="text-xs text-text-secondary">{meeting.receiver?.email}</div>
                                        <div className="text-[10px] text-text-tertiary mt-0.5">EVC: {meeting.receiver?.evc_id} | Badge: {meeting.receiver?.badge_id}</div>
                                    </td>
                                </tr>
                            ))}
                            {(!data.results || data.results.length === 0) && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-text-tertiary">No meetings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-text-secondary">
                            Page <strong className="text-text-primary">{page}</strong> of <strong className="text-text-primary">{totalPages}</strong>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="p-2 bg-bg-secondary text-text-primary border border-border rounded-lg hover:bg-bg-tertiary transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || loading}
                                className="p-2 bg-bg-secondary text-text-primary border border-border rounded-lg hover:bg-bg-tertiary transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingList;
