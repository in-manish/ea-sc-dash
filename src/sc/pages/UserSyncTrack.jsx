import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { RefreshCw, Loader2, AlertCircle, CheckCircle2, Clock, ShieldAlert, ChevronLeft, ChevronRight, Mail, Phone, Calendar } from 'lucide-react';

const UserSyncTrack = () => {
    const { token } = useAuth();
    const [syncTracks, setSyncTracks] = useState([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(20);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

        // Filter states
    const [selectedStatuses, setSelectedStatuses] = useState({
        pending: true,
        failed: false,
        success: false
    });

    const fetchSyncTrack = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // Build status parameter (comma-separated active statuses)
        const activeStatuses = Object.entries(selectedStatuses)
            .filter(([_, enabled]) => enabled)
            .map(([status]) => status)
            .join(',');

        try {
            const data = await userService.getUserSyncTrack({
                status: activeStatuses || undefined,
                page: currentPage,
                page_size: pageSize
            }, token);

            setSyncTracks(data.results || []);
            setCount(data.count || 0);
        } catch (err) {
            console.error('Failed to fetch user sync tracks:', err);
            setError(err.message || 'Failed to load sync tracks.');
        } finally {
            setIsLoading(false);
        }
    }, [token, currentPage, pageSize, selectedStatuses]);

    useEffect(() => {
        if (token) {
            fetchSyncTrack();
        }
    }, [token, fetchSyncTrack]);

    const handleStatusToggle = (status) => {
        setSelectedStatuses(prev => {
            const updated = { ...prev, [status]: !prev[status] };
            // Ensure at least one status is active, otherwise deselecting all yields no filters
            return updated;
        });
        setCurrentPage(1); // Reset page on filter change
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Pagination helper calculations
    const totalPages = Math.ceil(count / pageSize) || 1;
    const startRange = (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, count);

    return (
        <div className="max-w-[1200px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 pb-4 border-b border-border">
                <div>
                    <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">Snapcard Tracking</span>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">User Sync Track</h1>
                    <p className="text-sm text-text-secondary">Monitor user data sync status, track failures, and retry projection details</p>
                </div>
                <button
                    onClick={fetchSyncTrack}
                    disabled={isLoading}
                    className="btn btn-secondary flex items-center gap-2 py-1.5 px-3 text-sm h-8 border border-border"
                >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filter and Summary Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-bg-primary border border-border rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider mr-2">Filter Status:</span>
                    <button
                        onClick={() => handleStatusToggle('pending')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                            selectedStatuses.pending
                                ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm'
                                : 'bg-transparent text-text-secondary border-border hover:bg-bg-secondary'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => handleStatusToggle('failed')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                            selectedStatuses.failed
                                ? 'bg-red-500 text-white border-red-600 font-bold shadow-sm'
                                : 'bg-transparent text-text-secondary border-border hover:bg-bg-secondary'
                        }`}
                    >
                        Failed
                    </button>
                    <button
                        onClick={() => handleStatusToggle('success')}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                            selectedStatuses.success
                                ? 'bg-success text-white border-success-hover font-bold shadow-sm'
                                : 'bg-transparent text-text-secondary border-border hover:bg-bg-secondary'
                        }`}
                    >
                        Success
                    </button>
                </div>

                <div className="text-xs text-text-secondary">
                    Showing <span className="font-semibold text-text-primary">{count > 0 ? `${startRange}-${endRange}` : '0'}</span> of <span className="font-semibold text-text-primary">{count}</span> records
                </div>
            </div>

            {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-3 mb-6 animate-fade-in">
                    <ShieldAlert size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Table Area */}
            <div className="bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary/50 border-b border-border text-text-tertiary text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Sync Status</th>
                                <th className="px-6 py-4">Retries</th>
                                <th className="px-6 py-4">Timestamps</th>
                                <th className="px-6 py-4">Error Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5"><div className="h-4 bg-bg-tertiary rounded w-36 mb-2"></div><div className="h-3 bg-bg-tertiary rounded w-24"></div></td>
                                        <td className="px-6 py-5"><div className="h-6 bg-bg-tertiary rounded w-16"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 bg-bg-tertiary rounded w-8"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 bg-bg-tertiary rounded w-24 mb-1"></div><div className="h-3 bg-bg-tertiary rounded w-20"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 bg-bg-tertiary rounded w-48"></div></td>
                                    </tr>
                                ))
                            ) : syncTracks.length > 0 ? (
                                syncTracks.map((row, index) => (
                                    <tr key={index} className="hover:bg-bg-secondary/20 transition-colors">
                                        {/* User Details */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-text-primary">{row.user?.name || 'No Name'}</span>
                                                <span className="text-[11px] text-text-tertiary font-medium">ID: #{row.user?.id}</span>
                                                <div className="flex flex-col gap-0.5 mt-2 text-xs text-text-secondary">
                                                    {row.user?.email && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Mail size={11} className="text-text-tertiary" /> {row.user.email}
                                                        </span>
                                                    )}
                                                    {row.user?.phone_number && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone size={11} className="text-text-tertiary" /> {row.user.phone_number}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-semibold ${
                                                row.status === 'success' ? 'bg-[#dcfce7] text-[#166534]' :
                                                row.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {row.status === 'success' && <CheckCircle2 size={12} />}
                                                {row.status === 'pending' && <Clock size={12} />}
                                                {row.status === 'failed' && <AlertCircle size={12} />}
                                                <span className="capitalize">{row.status}</span>
                                            </span>
                                        </td>

                                        {/* Retry Count */}
                                        <td className="px-6 py-5">
                                            <span className={`font-semibold text-sm ${row.retry_count > 0 ? 'text-danger font-bold' : 'text-text-secondary'}`}>
                                                {row.retry_count}
                                            </span>
                                        </td>

                                        {/* Timestamps */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1 text-[11px] text-text-secondary">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-text-tertiary uppercase">Modified</span>
                                                    <span>{formatDate(row.modified_at)}</span>
                                                </div>
                                                <div className="flex flex-col mt-1">
                                                    <span className="text-[10px] font-bold text-text-tertiary uppercase">Last Synced</span>
                                                    <span>{formatDate(row.last_synced_at)}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Error Message */}
                                        <td className="px-6 py-5 max-w-xs">
                                            {row.last_error ? (
                                                <div className="text-xs text-danger bg-red-50/50 p-2.5 rounded-lg border border-red-100/60 font-mono break-all max-h-[100px] overflow-y-auto">
                                                    {row.last_error}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-text-tertiary font-mono">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-text-tertiary">
                                            <AlertCircle size={48} strokeWidth={1} />
                                            <p className="text-sm font-medium">No sync logs found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border bg-bg-secondary/20 flex justify-between items-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isLoading}
                            className="btn btn-secondary flex items-center gap-1.5 py-1 px-3 text-xs disabled:opacity-50"
                        >
                            <ChevronLeft size={14} /> Previous
                        </button>

                        <div className="text-xs font-semibold text-text-secondary">
                            Page {currentPage} of {totalPages}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || isLoading}
                            className="btn btn-secondary flex items-center gap-1.5 py-1 px-3 text-xs disabled:opacity-50"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSyncTrack;
