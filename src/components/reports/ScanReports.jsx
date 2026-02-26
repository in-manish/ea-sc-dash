import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReportService from '../../services/reportService';
import { Loader2, Download, Search, Filter, AlertCircle, RefreshCw, MapPin, Hash, User, Mail, Building, Clock, Map, Phone, Briefcase } from 'lucide-react';

const ScanReports = () => {
    const { selectedEvent } = useAuth();
    const [data, setData] = useState([]);
    const [statistics, setStatistics] = useState({
        total: 0,
        location_statistics: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState('scanned_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [uniqueRecord, setUniqueRecord] = useState(false);
    const [downloading, setDownloading] = useState(false);

    const fetchReports = useCallback(async () => {
        if (!selectedEvent?.id) return;

        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                size: pageSize,
                sort_by: sortBy,
                sort_order: sortOrder,
                unique_record: uniqueRecord,
            };

            const response = await ReportService.getScanReports(selectedEvent.id, params);

            if (response.success) {
                setData(response.data?.scanned_report || []);
                setStatistics({
                    total: response.data?.total || 0,
                    location_statistics: response.data?.statistics?.location_statistics || {}
                });
            } else {
                throw new Error(response.message || 'Failed to fetch scan reports');
            }
        } catch (err) {
            console.error('Error fetching scan reports:', err);
            setError(err.message || 'An error occurred while fetching reports.');
        } finally {
            setLoading(false);
        }
    }, [selectedEvent?.id, page, pageSize, sortBy, sortOrder, uniqueRecord]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleDownload = async () => {
        if (!selectedEvent?.id) return;

        try {
            setDownloading(true);
            const params = {
                sort_by: sortBy,
                sort_order: sortOrder,
                unique_record: uniqueRecord,
            };

            const response = await ReportService.downloadScanReport(selectedEvent.id, params);

            if (response.success) {
                if (response.data?.download_link) {
                    // Open link directly
                    window.open(response.data.download_link, '_blank');
                } else if (response.data?.message) {
                    // Show message (email flow)
                    alert(response.data.message);
                } else {
                    alert('Export initiated successfully.');
                }
            } else {
                alert(response.message || 'Failed to download report');
            }
        } catch (err) {
            console.error('Error downloading scan report:', err);
            alert('An error occurred while downloading the report.');
        } finally {
            setDownloading(false);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setPage(1); // Reset to first page
    };

    const StatusBadge = ({ scannedIn }) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${scannedIn === 'IN'
                ? 'bg-green-100 text-green-800 border fill-green-500'
                : 'bg-red-100 text-red-800 border fill-red-500'
            }`}>
            {scannedIn === 'IN' ? 'Check-in' : 'Check-out'}
        </span>
    );

    // Calculate total pages
    const totalPages = Math.ceil((statistics.total || 0) / pageSize);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[100vw]">
            {/* Header / Stats row */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-text-primary">Scan Reports ({statistics.total || 0})</h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto self-end">
                        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer bg-bg-secondary px-3 py-1.5 rounded-lg border border-border hover:bg-bg-tertiary transition-colors">
                            <input
                                type="checkbox"
                                checked={uniqueRecord}
                                onChange={(e) => {
                                    setUniqueRecord(e.target.checked);
                                    setPage(1); // Reset page on filter change
                                }}
                                className="rounded text-accent focus:ring-accent"
                            />
                            <span>Unique Records</span>
                        </label>

                        <button
                            onClick={handleDownload}
                            disabled={downloading || loading || data.length === 0}
                            className={`flex items-center gap-2 bg-accent text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                                ${downloading || loading || data.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-md'}`}
                        >
                            {downloading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Download size={16} />
                            )}
                            {downloading ? 'Exporting...' : 'Export CSV'}
                        </button>
                    </div>
                </div>

                {/* Location Statistics Cards */}
                {Object.keys(statistics.location_statistics || {}).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {Object.entries(statistics.location_statistics).map(([location, count]) => (
                            <div key={location} className="bg-bg-primary border border-border rounded-lg p-3 shadow-sm flex flex-col items-center justify-center text-center gap-1">
                                <span className="text-xs text-text-secondary font-medium tracking-wide uppercase line-clamp-1 break-all" title={location}>{location}</span>
                                <span className="text-xl font-bold text-accent">{count}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 border border-red-100">
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Data Table Container */}
            <div className="flex flex-col bg-bg-primary rounded-xl overflow-hidden border border-border shadow-sm flex-1 w-full relative">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-bg-secondary sticky top-0 z-10 w-full text-text-secondary font-semibold text-[0.85rem] uppercase tracking-wider border-b border-border">
                            <tr>
                                <th className="py-3 px-4 min-w-[150px] whitespace-nowrap cursor-pointer hover:bg-bg-tertiary transition-colors" onClick={() => handleSort('scanned_at')}>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} /> Time {sortBy === 'scanned_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[200px] whitespace-nowrap cursor-pointer hover:bg-bg-tertiary transition-colors" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        <User size={14} /> Attendee {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[180px] whitespace-nowrap cursor-pointer hover:bg-bg-tertiary transition-colors" onClick={() => handleSort('company')}>
                                    <div className="flex items-center gap-2">
                                        <Building size={14} /> Details {sortBy === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[160px] whitespace-nowrap cursor-pointer hover:bg-bg-tertiary transition-colors" onClick={() => handleSort('location_name')}>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} /> Location {sortBy === 'location_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-text-secondary">
                                        <Loader2 size={24} className="animate-spin text-accent mx-auto mb-2" />
                                        <span>Loading reports...</span>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-text-secondary">
                                        <div className="bg-bg-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search size={20} className="text-text-tertiary" />
                                        </div>
                                        <span className="font-medium text-text-primary block mb-1">No reports found</span>
                                        <span className="text-xs">Adjust your filters to see more results</span>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr key={item.id} className="hover:bg-bg-secondary/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-text-primary whitespace-nowrap align-top">
                                            {new Date(item.scanned_at).toLocaleString([], {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-text-primary truncate" title={item.user?.name}>{item.user?.name || '-'}</span>
                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                                                    {item.user?.email && <span className="flex items-center gap-1 truncate" title={item.user.email}><Mail size={10} /> {item.user.email}</span>}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
                                                    {item.user?.phone && <span className="flex items-center gap-1 truncate" title={item.user.phone}><Phone size={10} /> {item.user.phone}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-text-primary text-sm truncate" title={item.user?.company}>{item.user?.company || '-'}</span>
                                                <span className="text-xs text-text-secondary flex items-center gap-1 mt-0.5 truncate" title={item.user?.designation}>
                                                    <Briefcase size={10} className="shrink-0" /> {item.user?.designation || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-text-primary text-sm truncate" title={item.location?.name}>{item.location?.name || '-'}</span>
                                                <span className="text-[10px] uppercase font-semibold text-text-tertiary tracking-wider mt-0.5 flex items-center gap-1 truncate">
                                                    <Hash size={10} /> {item.device_id || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top whitespace-nowrap">
                                            <StatusBadge scannedIn={item.scanned_in} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && data.length > 0 && (
                    <div className="p-4 border-t border-border bg-bg-secondary/30 flex items-center justify-between text-sm w-full">
                        <div className="text-text-secondary font-medium">
                            Showing <span className="text-text-primary font-semibold">{(page - 1) * pageSize + 1}</span> to <span className="text-text-primary font-semibold">{Math.min(page * pageSize, statistics.total || 0)}</span> of <span className="text-text-primary font-semibold">{statistics.total || 0}</span> entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`px-3 py-1.5 rounded border border-border text-sm font-medium transition-colors ${page === 1 ? 'opacity-50 cursor-not-allowed bg-bg-secondary text-text-tertiary' : 'bg-bg-primary text-text-primary hover:bg-bg-secondary shadow-sm'
                                    }`}
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1.5 font-medium text-text-primary bg-bg-primary border border-border rounded min-w-[2rem] text-center shadow-sm">
                                {page} <span className="text-text-tertiary mx-1">/</span> {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || totalPages === 0}
                                className={`px-3 py-1.5 rounded border border-border text-sm font-medium transition-colors ${page >= totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed bg-bg-secondary text-text-tertiary' : 'bg-bg-primary text-text-primary hover:bg-bg-secondary shadow-sm'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScanReports;
