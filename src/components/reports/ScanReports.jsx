import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReportService from '../../services/reportService';
import { eventService } from '../../services/eventService';
import { Loader2, Download, Search, Filter, AlertCircle, RefreshCw, MapPin, Hash, User, Mail, Building, Clock, Map, Phone, Briefcase, X, AlignLeft, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { formatApiDateTime } from '../../utils/formatApiDateTime';

const ScanReports = () => {
    const { selectedEvent } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL
    const page = parseInt(searchParams.get('p') || '1');
    const sortBy = searchParams.get('sort') || 'scanned_at';
    const sortOrder = searchParams.get('order') || 'desc';
    const uniqueRecord = searchParams.get('unique') === 'true';

    // Parse filters from URL
    const filters = React.useMemo(() => ({
        location_id: searchParams.get('loc')?.split(',').filter(Boolean).map(Number) || [],
        date: searchParams.get('date')?.split(',').filter(Boolean) || [],
        att_id: searchParams.get('att')?.split(',').filter(Boolean) || [],
        reg_type: searchParams.get('reg')?.split(',').filter(Boolean) || []
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

    const setUniqueRecord = (val) => {
        setSearchParams(params => {
            if (val) params.set('unique', 'true');
            else params.delete('unique');
            params.set('p', '1'); // Reset page
            return params;
        });
    };

    const setFilters = (updateFn) => {
        const newFilters = typeof updateFn === 'function' ? updateFn(filters) : updateFn;
        setSearchParams(params => {
            if (newFilters.location_id.length > 0) params.set('loc', newFilters.location_id.join(','));
            else params.delete('loc');

            if (newFilters.date.length > 0) params.set('date', newFilters.date.join(','));
            else params.delete('date');

            if (newFilters.att_id.length > 0) params.set('att', newFilters.att_id.join(','));
            else params.delete('att');

            if (newFilters.reg_type.length > 0) params.set('reg', newFilters.reg_type.join(','));
            else params.delete('reg');

            params.set('p', '1'); // Reset page
            return params;
        });
    };

    const [data, setData] = useState([]);
    const [statistics, setStatistics] = useState({
        total: 0,
        location_statistics: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 20;
    const [downloading, setDownloading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [locations, setLocations] = useState([]); // Official list [{id, name, ...}]
    const [locationMap, setLocationMap] = useState({}); // Mapping id -> name

    const { token } = useAuth();

    // Fetch Scan Locations on mount
    useEffect(() => {
        const fetchLocations = async () => {
            if (!selectedEvent?.id || !token) return;
            try {
                const data = await eventService.getScanLocations(selectedEvent.id, token);
                setLocations(data || []);

                // Build a map for quick name lookup by ID
                const map = {};
                (data || []).forEach(loc => {
                    map[loc.id] = loc.name;
                });
                setLocationMap(map);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };
        fetchLocations();
    }, [selectedEvent?.id, token]);

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
                ...filters
            };

            const response = await ReportService.getScanReports(selectedEvent.id, params);
            // Fix data parsing logic since API response structure is flat and doesn't wrap in "success" / "data"
            if (response.scanned_report !== undefined || response.total !== undefined) {
                const reports = response.scanned_report || [];
                setData(reports);
                setStatistics({
                    total: response.total || 0,
                    location_statistics: response.statistics?.location_statistics || {}
                });
            } else if (response.success && response.data) {
                // Fallback for wrapped responses just in case the backend format behaves differently
                const reports = response.data.scanned_report || [];
                setData(reports);
                setStatistics({
                    total: response.data.total || 0,
                    location_statistics: response.data.statistics?.location_statistics || {}
                });
            } else {
                // Determine error state
                throw new Error(response.message || 'Failed to fetch scan reports or no records found.');
            }
        } catch (err) {
            console.error('Error fetching scan reports:', err);
            setError(err.message || 'An error occurred while fetching reports.');
            // Clear on error
            setData([]);
            setStatistics({ total: 0, location_statistics: {} });
        } finally {
            setLoading(false);
        }
    }, [selectedEvent?.id, page, pageSize, sortBy, sortOrder, uniqueRecord, filters]);

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

            if (response.success || response.download_link || response.message) {
                const targetLink = response.download_link || response.data?.download_link;
                const targetMsg = response.message || response.data?.message;

                if (targetLink) {
                    window.open(targetLink, '_blank');
                } else if (targetMsg) {
                    alert(targetMsg);
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
            ? 'bg-green-100 text-green-800 border-green-200 border'
            : 'bg-red-100 text-red-800 border-red-200 border'
            }`}>
            {scannedIn === 'IN' ? 'Check-in' : 'Check-out'}
        </span>
    );

    const DetailItem = ({ icon, label, value }) => {
        if (!value || value === '-' || value === 'null') return null;
        return (
            <div className="flex flex-col gap-1 p-3 bg-bg-primary rounded border border-border/50 hover:bg-bg-secondary/50 transition-colors">
                <span className="text-xs text-text-secondary flex items-center gap-1.5 font-medium tracking-wide">
                    {React.cloneElement(icon, { size: 12, className: 'text-text-tertiary shadow-sm' })} {label}
                </span>
                <span className="text-sm font-semibold text-text-primary pl-[1.125rem]">{value}</span>
            </div>
        );
    };

    // Calculate total pages
    const totalPages = Math.ceil((statistics.total || 0) / pageSize);
    const maxBarCount = Math.max(...Object.values(statistics.location_statistics || {}), 1);

    return (
        <div className="flex flex-col gap-6 w-full max-w-[100vw]">
            {/* Header / Stats row */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-bold text-text-primary">Scan Reports ({statistics.total || 0})</h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto self-end">
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                                ${Object.values(filters).some(f => f.length > 0)
                                    ? 'bg-accent/10 border-accent text-accent shadow-sm'
                                    : 'bg-bg-secondary border-border text-text-secondary hover:bg-bg-tertiary'}`}
                        >
                            <Filter size={16} />
                            Filters {Object.values(filters).some(f => f.length > 0) && `(${Object.values(filters).reduce((acc, curr) => acc + curr.length, 0)})`}
                        </button>

                        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer bg-bg-secondary px-3 py-1.5 rounded-lg border border-border hover:bg-bg-tertiary transition-colors">
                            <input
                                type="checkbox"
                                checked={uniqueRecord}
                                onChange={(e) => {
                                    setUniqueRecord(e.target.checked);
                                }}
                                className="rounded text-accent focus:ring-accent accent-accent"
                            />
                            <span className="select-none font-medium">Unique</span>
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
                            <span className="hidden sm:inline">{downloading ? 'Exporting...' : 'Export'}</span>
                        </button>
                    </div>
                </div>

                {/* Active Filter Pills */}
                {Object.values(filters).some(f => f.length > 0) && (
                    <div className="flex flex-wrap gap-2 py-1 animate-fade-in">
                        {Object.entries(filters).map(([key, value]) => (
                            value.map(val => {
                                // For location_id, try to show the name if we have it in our map
                                let displayVal = val;
                                if (key === 'location_id' && locationMap[val]) {
                                    displayVal = locationMap[val];
                                }

                                return (
                                    <div key={`${key}-${val}`} className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 transition-all hover:bg-accent/15">
                                        <span className="opacity-70 uppercase text-[10px] font-bold tracking-wider">{key.replace('_', ' ')}:</span>
                                        <span>{displayVal}</span>
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
                                );
                            })
                        ))}
                        <button
                            className="text-xs font-bold text-text-tertiary hover:text-accent transition-colors px-2"
                            onClick={() => {
                                setFilters({ location_id: [], date: [], att_id: [], reg_type: [] });
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Location Statistics Bar Graph */}
                {Object.keys(statistics.location_statistics || {}).length > 0 && (
                    <div className="bg-bg-primary border border-border rounded-xl p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2 pb-3 border-b border-border/50">
                            <AlignLeft size={16} className="text-accent" /> Gate-wise Scan Distribution
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                            {Object.entries(statistics.location_statistics).map(([location, count]) => (
                                <div key={location} className="flex items-center gap-3 group">
                                    <span className="w-24 text-xs font-semibold text-text-secondary truncate text-right group-hover:text-text-primary transition-colors" title={location}>
                                        {location}
                                    </span>
                                    <div className="flex-1 h-3 bg-bg-secondary rounded-full overflow-hidden relative shadow-inner">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${(count / maxBarCount) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-10 text-xs font-bold text-text-primary text-left">
                                        {count}
                                    </span>
                                </div>
                            ))}
                        </div>
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
                                        <div className="bg-bg-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-text-tertiary">
                                            <Search size={20} />
                                        </div>
                                        <span className="font-medium text-text-primary block mb-1">No reports found</span>
                                        <span className="text-xs">Adjust your filters to see more results</span>
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        onClick={() => setSelectedRecord(item)}
                                        className="hover:bg-bg-tertiary transition-colors cursor-pointer group"
                                    >
                                        <td className="py-3 px-4 font-medium text-text-primary whitespace-nowrap align-top">
                                            {formatApiDateTime(item.scanned_at)}
                                        </td>
                                        <td className="py-3 px-4 align-top">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-text-primary truncate group-hover:text-accent transition-colors" title={item.user?.name}>{item.user?.name || '-'}</span>
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
                                                <span className="font-medium text-text-primary text-sm truncate group-hover:text-accent transition-colors" title={item.user?.company}>{item.user?.company || '-'}</span>
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
                            <h3 className="text-lg font-bold text-text-primary tracking-tight">Report Filters</h3>
                            <p className="text-xs text-text-secondary mt-1">Refine your scan report data</p>
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

                        {/* Location Filter */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-[0.7rem] font-bold text-text-tertiary uppercase tracking-[0.15em] flex items-center gap-2">
                                <MapPin size={14} className="text-accent" /> Available Locations
                            </h4>
                            <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {locations.map(loc => (
                                    <label key={loc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary/50 cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            checked={filters.location_id.includes(loc.id)}
                                            onChange={() => {
                                                const current = filters.location_id;
                                                const next = current.includes(loc.id) ? current.filter(l => l !== loc.id) : [...current, loc.id];
                                                setFilters({ ...filters, location_id: next });
                                            }}
                                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent"
                                        />
                                        <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{loc.name}</span>
                                        <span className="ml-auto text-[10px] font-bold text-text-tertiary bg-bg-secondary px-1.5 py-0.5 rounded-md">
                                            {statistics.location_statistics?.[loc.name] || 0}
                                        </span>
                                    </label>
                                ))}
                                {locations.length === 0 && (
                                    <p className="text-xs text-text-tertiary italic p-2 text-center">No locations available</p>
                                )}
                            </div>
                        </div>

                        {/* Date Filter */}
                        <div className="flex flex-col gap-3">
                            <h4 className="text-[0.7rem] font-bold text-text-tertiary uppercase tracking-[0.15em] flex items-center gap-2">
                                <Calendar size={14} className="text-accent" /> Filter by Date
                            </h4>
                            <div className="flex flex-col gap-4">
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
                                                        const current = filters.date;
                                                        const next = current.includes(date) ? current.filter(d => d !== date) : [...current, date];
                                                        setFilters({ ...filters, date: next });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer
                                                        ${filters.date.includes(date)
                                                            ? 'bg-accent text-white border-accent shadow-sm scale-[1.02]'
                                                            : 'bg-bg-secondary border-border text-text-secondary hover:border-accent/40'}`}
                                                >
                                                    Day {index + 1} ({new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })})
                                                </button>
                                            ));
                                        })()}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-2">
                                    <input
                                        type="date"
                                        className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent transition-colors"
                                        onChange={(e) => {
                                            if (e.target.value && !filters.date.includes(e.target.value)) {
                                                setFilters({ ...filters, date: [...filters.date, e.target.value] });
                                            }
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {filters.date.map(d => (
                                            <div key={d} className="flex items-center gap-1.5 bg-bg-tertiary border border-border px-2 py-1 rounded text-xs font-medium">
                                                {d}
                                                <button onClick={() => setFilters({ ...filters, date: filters.date.filter(x => x !== d) })} className="text-text-tertiary hover:text-red-500">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                            const current = filters.att_id;
                                            const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
                                            setFilters({ ...filters, att_id: next });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 
                                            ${filters.att_id.includes(type)
                                                ? 'bg-accent text-white border-accent shadow-sm'
                                                : 'bg-bg-secondary border-border text-text-secondary hover:border-accent/40'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border bg-bg-secondary/30 flex gap-3">
                        <button
                            onClick={() => {
                                setFilters({ location_id: [], date: [], att_id: [], reg_type: [] });
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

            {/* Record Detail Modal */}
            {selectedRecord && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] opacity-100 transition-opacity"
                    onClick={() => setSelectedRecord(null)}
                >
                    <div
                        className="bg-bg-primary rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all border border-border/60"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg-secondary/20">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">Scan Record Details</h3>
                                <p className="text-xs text-text-secondary mt-1">Viewing full report payload for attendee</p>
                            </div>
                            <button
                                onClick={() => setSelectedRecord(null)}
                                className="p-2 rounded-full hover:bg-bg-secondary text-text-secondary transition-colors focus:ring-2 focus:ring-accent outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex flex-col gap-6 bg-bg-primary/50">
                            {/* Group 1: User Info */}
                            <div className="bg-bg-secondary/20 border border-border/80 rounded-xl p-5 shadow-sm">
                                <h4 className="text-[0.8rem] font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-border/30">
                                    <div className="bg-accent/10 p-1.5 rounded-md"><User size={16} className="text-accent" /></div> Attendee Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    <DetailItem icon={<User />} label="Name" value={selectedRecord.user?.name} />
                                    <DetailItem icon={<Mail />} label="Email" value={selectedRecord.user?.email} />
                                    <DetailItem icon={<Phone />} label="Phone" value={selectedRecord.user?.phone} />
                                    <DetailItem icon={<Building />} label="Company" value={selectedRecord.user?.company} />
                                    <DetailItem icon={<Briefcase />} label="Designation" value={selectedRecord.user?.designation} />
                                    <DetailItem icon={<Hash />} label="Registration Type" value={selectedRecord.user?.reg_type} />
                                    <DetailItem icon={<Hash />} label="Attendee Category" value={selectedRecord.user?.attendee_type?.name} />
                                    <DetailItem icon={<Map />} label="City" value={selectedRecord.user?.city} />
                                    <DetailItem icon={<MapPin />} label="State/Country" value={`${selectedRecord.user?.state || ''} ${selectedRecord.user?.country || ''}`.trim() || null} />
                                    <DetailItem icon={<Building />} label="Company Address" value={selectedRecord.user?.company_address} />
                                    <DetailItem icon={<User />} label="Event Login Code" value={selectedRecord.user?.event_login_code} />
                                </div>
                            </div>

                            {/* Group 2: Scan Info */}
                            <div className="bg-bg-secondary/20 border border-border/80 rounded-xl p-5 shadow-sm">
                                <h4 className="text-[0.8rem] font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-border/30">
                                    <div className="bg-accent/10 p-1.5 rounded-md"><Clock size={16} className="text-accent" /></div> Scan & Device Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DetailItem icon={<Clock />} label="Scanned At" value={formatApiDateTime(selectedRecord.scanned_at)} />
                                    <DetailItem icon={<MapPin />} label="Location / Gate" value={selectedRecord.location?.name} />
                                    <DetailItem icon={<Hash />} label="Device ID" value={selectedRecord.device_id || 'N/A'} />
                                    <div className="flex flex-col gap-1 p-3 bg-bg-primary rounded border border-border/50">
                                        <span className="text-xs text-text-secondary flex items-center gap-1.5 font-medium tracking-wide">
                                            Status
                                        </span>
                                        <div className="mt-1">
                                            <StatusBadge scannedIn={selectedRecord.scanned_in} />
                                        </div>
                                    </div>
                                    {selectedRecord.location?.created_at && (
                                        <DetailItem icon={<Clock />} label="Gate Creation" value={formatApiDateTime(selectedRecord.location.created_at)} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanReports;

