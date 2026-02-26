import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReportService from '../../services/reportService';
import { Loader2, Download, Search, Filter, AlertCircle, RefreshCw, User, Building, Clock, Mail, Phone, Briefcase, X, AlignLeft, Calendar, CheckCircle2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const MeetingReports = () => {
    const { selectedEvent, token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL
    const page = parseInt(searchParams.get('p') || '1');
    const sortBy = searchParams.get('sort') || 'name';
    const sortOrder = searchParams.get('order') || 'asc';

    // Parse filters from URL
    const filters = React.useMemo(() => ({
        attendee_type: searchParams.get('att')?.split(',').filter(Boolean) || [],
        reg_type: searchParams.get('reg')?.split(',').filter(Boolean) || [],
        date: searchParams.get('date') || ''
    }), [searchParams]);

    const setPage = (newPage) => {
        setSearchParams(params => {
            params.set('p', String(newPage));
            return params;
        });
    };

    const setSortBy = (newSort) => {
        setSearchParams(params => {
            params.set('sort', newSort);
            return params;
        });
    };

    const setSortOrder = (newOrder) => {
        setSearchParams(params => {
            params.set('order', newOrder);
            return params;
        });
    };

    const setFilters = (updateFn) => {
        const newFilters = typeof updateFn === 'function' ? updateFn(filters) : updateFn;
        setSearchParams(params => {
            if (newFilters.attendee_type.length > 0) params.set('att', newFilters.attendee_type.join(','));
            else params.delete('att');

            if (newFilters.reg_type.length > 0) params.set('reg', newFilters.reg_type.join(','));
            else params.delete('reg');

            if (newFilters.date) params.set('date', newFilters.date);
            else params.delete('date');

            params.set('p', '1'); // Reset page
            return params;
        });
    };

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 20;
    const [exporting, setExporting] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const fetchReports = useCallback(async () => {
        if (!selectedEvent?.id || !token) return;

        try {
            setLoading(true);
            setError(null);

            const params = {
                page,
                size: pageSize,
                sort_by: sortBy,
                order_by: sortOrder,
                ...filters
            };

            const response = await ReportService.getMeetingReports(selectedEvent.id, params);

            if (response.details) {
                setData(response.details);
                setTotal(response.total || 0);
            } else {
                throw new Error('Failed to fetch meeting reports.');
            }
        } catch (err) {
            console.error('Error fetching meeting reports:', err);
            setError(err.message || 'An error occurred while fetching reports.');
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [selectedEvent?.id, token, page, pageSize, sortBy, sortOrder, filters]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleExport = async () => {
        if (!selectedEvent?.id || data.length === 0) return;

        try {
            setExporting(true);
            // reg_ids: "*" means export all based on current filters 
            // but the API doc says reg_ids is required and if includes "*" it's async.
            // For now let's use all currently visible IDs or just a placeholder if we want all.
            // The doc says: "If reg_ids does not include * and count < 21: immediate CSV download. Otherwise: async task, email sent later."

            const payload = {
                reg_ids: ["*"]
            };

            const response = await ReportService.exportMeetingDetails(selectedEvent.id, payload);

            if (response.msg) {
                alert(response.msg);
            } else {
                alert('Export initiated successfully.');
            }
        } catch (err) {
            console.error('Error exporting meeting reports:', err);
            alert('An error occurred while exporting the report.');
        } finally {
            setExporting(false);
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setPage(1);
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[100vw]">
            {/* Header row */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-text-primary">Meeting Reports ({total})</h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto self-end">
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                                ${Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== '')
                                    ? 'bg-accent/10 border-accent text-accent shadow-sm'
                                    : 'bg-bg-secondary border-border text-text-secondary hover:bg-bg-tertiary'}`}
                        >
                            <Filter size={16} />
                            Filters {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== '') && `(${Object.values(filters).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : (curr ? 1 : 0)), 0)})`}
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={exporting || loading || data.length === 0}
                            className={`flex items-center gap-2 bg-accent text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                                ${exporting || loading || data.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-md'}`}
                        >
                            {exporting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Download size={16} />
                            )}
                            <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
                        </button>
                    </div>
                </div>

                {/* Active Filter Pills */}
                {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== '') && (
                    <div className="flex flex-wrap gap-2 py-1 animate-fade-in">
                        {Object.entries(filters).map(([key, value]) => {
                            if (Array.isArray(value)) {
                                return value.map(val => (
                                    <div key={`${key}-${val}`} className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 transition-all hover:bg-accent/15">
                                        <span className="opacity-70 uppercase text-[10px] font-bold tracking-wider">{key.replace('_', ' ')}:</span>
                                        <span>{val}</span>
                                        <button
                                            className="p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                                            onClick={() => {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    [key]: prev[key].filter(v => v !== val)
                                                }));
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ));
                            } else if (value) {
                                return (
                                    <div key={`${key}-${value}`} className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 transition-all hover:bg-accent/15">
                                        <span className="opacity-70 uppercase text-[10px] font-bold tracking-wider">{key.replace('_', ' ')}:</span>
                                        <span>{value}</span>
                                        <button
                                            className="p-0.5 rounded-full hover:bg-accent/20 transition-colors"
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, [key]: '' }));
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                );
                            }
                            return null;
                        })}
                        <button
                            className="text-xs font-bold text-text-tertiary hover:text-accent transition-colors px-2"
                            onClick={() => {
                                setFilters({ attendee_type: [], reg_type: [], date: '' });
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 border border-red-100 shadow-sm animate-pulse">
                    <AlertCircle size={18} className="shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Data Table */}
            <div className="flex flex-col bg-bg-primary rounded-xl overflow-hidden border border-border shadow-sm flex-1 w-full relative">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-bg-secondary sticky top-0 z-10 w-full text-text-secondary font-semibold text-[0.85rem] uppercase tracking-wider border-b border-border">
                            <tr>
                                <th className="py-3 px-4 min-w-[200px] whitespace-nowrap cursor-pointer hover:bg-bg-tertiary transition-colors" onClick={() => handleSort('name')}>
                                    <div className="flex items-center gap-2">
                                        <User size={14} /> Attendee {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[180px] whitespace-nowrap cursor-pointer hover:bg-bg-tertiary transition-colors" onClick={() => handleSort('company')}>
                                    <div className="flex items-center gap-2">
                                        <Building size={14} /> Company {sortBy === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">Type</th>
                                <th className="py-3 px-4 min-w-[100px] whitespace-nowrap text-center cursor-pointer hover:bg-bg-tertiary" onClick={() => handleSort('confirmed')}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <CheckCircle2 size={14} className="text-green-500" /> Conf. {sortBy === 'confirmed' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[100px] whitespace-nowrap text-center cursor-pointer hover:bg-bg-tertiary" onClick={() => handleSort('sent_pending')}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <ArrowUpRight size={14} className="text-amber-500" /> Sent {sortBy === 'sent_pending' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[100px] whitespace-nowrap text-center cursor-pointer hover:bg-bg-tertiary" onClick={() => handleSort('received_pending')}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <ArrowDownLeft size={14} className="text-blue-500" /> Recv. {sortBy === 'received_pending' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                                <th className="py-3 px-4 min-w-[120px] whitespace-nowrap text-center cursor-pointer hover:bg-bg-tertiary" onClick={() => handleSort('total_request_send_received')}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        Total {sortBy === 'total_request_send_received' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-text-secondary">
                                        <Loader2 size={24} className="animate-spin text-accent mx-auto mb-2" />
                                        <span>Loading meeting data...</span>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-text-secondary">
                                        <div className="bg-bg-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-text-tertiary">
                                            <Search size={20} />
                                        </div>
                                        <span className="font-medium text-text-primary block mb-1">No meeting reports found</span>
                                        <span className="text-xs">Adjust your filters to see more results</span>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr key={index} className="hover:bg-bg-tertiary transition-colors group">
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-text-primary truncate" title={item.name}>{item.name || '-'}</span>
                                                <span className="text-xs text-text-tertiary">ID: {item.reg_id}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-text-primary text-sm truncate" title={item.company}>{item.company || '-'}</span>
                                                <span className="text-xs text-text-secondary truncate">{item.designation || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                {item.attendee_type || '-'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 align-top text-center font-bold text-text-primary">
                                            {item.confirmed || 0}
                                        </td>
                                        <td className="py-3 px-4 align-top text-center font-bold text-text-primary">
                                            {item.sent_pending || 0}
                                        </td>
                                        <td className="py-3 px-4 align-top text-center font-bold text-text-primary">
                                            {item.received_pending || 0}
                                        </td>
                                        <td className="py-3 px-4 align-top text-center">
                                            <span className="px-2 py-1 rounded-md bg-bg-secondary font-bold text-accent">
                                                {item.total_request_send_received || 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && data.length > 0 && (
                    <div className="p-4 border-t border-border bg-bg-secondary/30 flex items-center justify-between text-sm w-full">
                        <div className="text-text-secondary font-medium">
                            Showing <span className="text-text-primary font-semibold">{(page - 1) * pageSize + 1}</span> to <span className="text-text-primary font-semibold">{Math.min(page * pageSize, total)}</span> of <span className="text-text-primary font-semibold">{total}</span> entries
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

            {/* Filter Drawer */}
            <div
                className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isFilterDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsFilterDrawerOpen(false)}
            >
                <div
                    className={`absolute top-0 right-0 w-full max-w-[400px] h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-border ${isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-bg-secondary/20">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary tracking-tight">Meeting Filters</h3>
                            <p className="text-xs text-text-secondary mt-1">Refine attendee meeting data</p>
                        </div>
                        <button
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                        {/* Registration Type Filter */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-[0.7rem] font-bold text-text-tertiary uppercase tracking-[0.15em] flex items-center gap-2">
                                <AlignLeft size={14} className="text-accent" /> Registration Type
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['ONLINE', 'ON_SPOT', 'PRE_REG'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            const current = filters.reg_type;
                                            const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
                                            setFilters({ ...filters, reg_type: next });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 
                                            ${filters.reg_type.includes(type)
                                                ? 'bg-accent text-white border-accent shadow-sm scale-[1.02]'
                                                : 'bg-bg-secondary border-border text-text-secondary hover:border-accent/40'}`}
                                    >
                                        {type.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Attendee Category Filter */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-[0.7rem] font-bold text-text-tertiary uppercase tracking-[0.15em] flex items-center gap-2">
                                <User size={14} className="text-accent" /> Attendee Category
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['Exhibitor', 'Visitor', 'VIP', 'Speaker', 'Media', 'Contractor'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            const current = filters.attendee_type;
                                            const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
                                            setFilters({ ...filters, attendee_type: next });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 
                                            ${filters.attendee_type.includes(type)
                                                ? 'bg-accent text-white border-accent shadow-sm'
                                                : 'bg-bg-secondary border-border text-text-secondary hover:border-accent/40'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-[0.7rem] font-bold text-text-tertiary uppercase tracking-[0.15em] flex items-center gap-2">
                                <Calendar size={14} className="text-accent" /> Filter by Date
                            </h4>
                            <div className="flex flex-col gap-3">
                                {selectedEvent?.start_date && selectedEvent?.end_date && (
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            const start = new Date(selectedEvent.start_date);
                                            const end = new Date(selectedEvent.end_date);
                                            const days = [];
                                            let current = new Date(start);
                                            while (current <= end) {
                                                // Use local date string YYYY-MM-DD
                                                const year = current.getFullYear();
                                                const month = String(current.getMonth() + 1).padStart(2, '0');
                                                const day = String(current.getDate()).padStart(2, '0');
                                                days.push(`${year}-${month}-${day}`);
                                                current.setDate(current.getDate() + 1);
                                            }
                                            return days.map((date, index) => (
                                                <button
                                                    key={date}
                                                    type="button"
                                                    onClick={() => {
                                                        const next = filters.date === date ? '' : date;
                                                        setFilters({ ...filters, date: next });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer
                                                        ${filters.date === date
                                                            ? 'bg-accent text-white border-accent shadow-sm scale-[1.02]'
                                                            : 'bg-bg-secondary border-border text-text-secondary hover:border-accent/40'}`}
                                                >
                                                    Day {index + 1} ({new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })})
                                                </button>
                                            ));
                                        })()}
                                    </div>
                                )}
                                <input
                                    type="date"
                                    className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                                    value={filters.date}
                                    onChange={(e) => {
                                        setFilters({ ...filters, date: e.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border bg-bg-secondary/30 flex gap-3">
                        <button
                            onClick={() => {
                                setFilters({ attendee_type: [], reg_type: [], date: '' });
                                setIsFilterDrawerOpen(false);
                            }}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-text-secondary bg-bg-primary border border-border hover:bg-bg-secondary transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-accent hover:bg-accent-hover transition-all shadow-md shadow-accent/20"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingReports;
