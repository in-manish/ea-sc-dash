import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Search, Filter, Phone, Mail, Globe, X, ShieldCheck, Building2, Calendar, UserCheck, MessageSquare, Send } from 'lucide-react';

const pillColors = {
    attendee_type: "bg-blue-50 text-blue-800 border-blue-200",
    reg_type: "bg-red-50 text-red-800 border-red-200",
    city: "bg-green-50 text-green-800 border-green-200",
    country: "bg-green-50 text-green-800 border-green-200",
    is_poc: "bg-amber-50 text-amber-900 border-amber-200",
    check_in: "bg-purple-50 text-purple-800 border-purple-200",
    email_sent: "bg-pink-50 text-pink-800 border-pink-200",
    whatsapp_sent: "bg-pink-50 text-pink-800 border-pink-200",
    created_at_start: "bg-slate-50 text-slate-700 border-slate-200",
    created_at_end: "bg-slate-50 text-slate-700 border-slate-200",
};

const Attendees = () => {
    const { selectedEvent, token } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [isModalMaximized, setIsModalMaximized] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    // Search and Filter State
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // Initialize filters from searchParams
    const getInitialFilters = () => {
        const filters = {};
        const filterKeys = [
            'attendee_type', 'reg_type', 'city', 'state', 'country',
            'is_poc', 'email_sent', 'sms_sent', 'check_in', 'whatsapp_sent',
            'created_at_start', 'created_at_end', 'modified_at_start', 'modified_at_end'
        ];

        filterKeys.forEach(key => {
            const val = searchParams.get(key);
            if (val) {
                if (key === 'attendee_type') {
                    filters[key] = val.split(',');
                } else {
                    filters[key] = val;
                }
            }
        });

        return filters;
    };

    const [filters, setFilters] = useState(getInitialFilters());

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Update searchParams
    useEffect(() => {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', page);
        if (debouncedSearch) params.set('q', debouncedSearch);

        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value) {
                if (Array.isArray(value)) {
                    if (value.length > 0) params.set(key, value.join(','));
                } else {
                    params.set(key, value);
                }
            }
        });

        setSearchParams(params, { replace: true });
    }, [page, debouncedSearch, filters, setSearchParams]);

    useEffect(() => {
        const fetchAttendees = async () => {
            if (!selectedEvent) return;

            setLoading(true);
            setError(null);

            try {
                const data = await eventService.getAttendees(selectedEvent.id, token, {
                    page,
                    size: 50,
                    searchQuery: debouncedSearch,
                    filters: filters
                });
                setAttendees(data.results);
                setTotal(data.total);
                setHasLoaded(true);
            } catch (err) {
                setError('Failed to load attendees. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedEvent && token) {
            fetchAttendees();
        }
    }, [selectedEvent, page, debouncedSearch, filters, token]);

    // Group fields logic - Includes ALL fields
    const getGroupedFields = (attendee) => {
        if (!attendee) return {};

        const isExhibitor = attendee.attendee_type === 'Exhibitor' || attendee.attendee_type_sort === 'exhibitor';

        const professionalFields = [
            { label: 'Company', value: attendee.company },
            { label: 'Designation', value: attendee.designation },
            { label: 'Website', value: attendee.website },
            { label: 'Company Address', value: attendee.company_address },
            { label: 'City', value: attendee.city },
            { label: 'State', value: attendee.state },
            { label: 'Country', value: attendee.country },
        ];

        if (isExhibitor) {
            professionalFields.push(
                { label: 'Exhibitor ID', value: attendee.exhibitor_id },
                { label: 'Parent Exhibitor ID', value: attendee.parent_exhibitor_id },
                { label: 'Is POC', value: attendee.is_poc ? 'Yes' : 'No' }
            );
        }

        const registrationFields = [
            { label: 'Reg ID', value: attendee.reg_id },
            { label: 'Reg Type', value: attendee.reg_type },
            { label: 'Attendee Type', value: attendee.attendee_type },
            { label: 'Attendee Type ID', value: attendee.attendee_type_id },
            { label: 'Attendee Type Sort', value: attendee.attendee_type_sort },
            { label: 'Login Code', value: attendee.event_login_code },
        ];

        if (isExhibitor) {
            registrationFields.push(
                { label: 'OBF Number', value: attendee.obf_number }
            );
        }

        registrationFields.push(
            { label: 'Upload ID', value: attendee.upload_id },
            { label: 'EVC ID', value: attendee.evc_id }
        );

        return {
            Contact: [
                { label: 'Email ID', value: attendee.email },
                { label: 'Phone Number', value: `+${attendee.country_code || ''} ${attendee.phone_number || ''}` },
            ],
            Identity: [
                { label: 'Full Name', value: attendee.name },
                { label: 'Race ID', value: attendee.id },
                { label: 'Tracking UUID', value: attendee.tracking_uuid },
                { label: 'UID', value: attendee.uuid },
            ],
            Professional: professionalFields,
            Registration: registrationFields,
            Status: [
                { label: 'Email Sent', value: attendee.email_sent ? 'Yes' : 'No' },
                { label: 'SMS Sent', value: attendee.sms_sent ? 'Yes' : 'No' },
                { label: 'WhatsApp Sent', value: attendee.wa_sent ? 'Yes' : 'No' },
                { label: 'Checked In', value: attendee.check_in ? 'Yes' : 'No' },
                { label: 'Meeting Enabled', value: attendee.is_meeting_enabled ? 'Yes' : 'No' },
            ],
            System: [
                { label: 'Event ID', value: attendee.event_id },
                { label: 'Event Name', value: attendee.event_name },
                { label: 'Schema', value: attendee.schema },
                { label: 'Created At', value: attendee.created_at ? new Date(attendee.created_at).toLocaleString() : '-' },
                { label: 'Modified At', value: attendee.modified_at ? new Date(attendee.modified_at).toLocaleString() : '-' },
            ]
        };
    };

    if (!hasLoaded && loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4">
                <Loader2 className="animate-spin text-accent" size={32} />
                <p>Loading Attendees...</p>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary mb-1">Attendees</h1>
                    <p className="text-sm text-text-secondary">Total: {total} registered</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search attendees..."
                            className="w-60 py-2 pr-4 pl-9 border border-border rounded-md text-sm outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        className={`btn ${Object.keys(filters).length > 0 ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setIsFilterDrawerOpen(true)}
                    >
                        <Filter size={16} style={{ marginRight: '0.5rem' }} />
                        Filter {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
                    </button>
                    {Object.keys(filters).length > 0 && (
                        <button className="btn btn-ghost btn-sm" onClick={() => {
                            setFilters({});
                            setSearch('');
                        }}>
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Active Filter Pills */}
            {Object.keys(filters).length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6 py-2 animate-fade-in">
                    {Object.entries(filters).map(([key, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;

                        const removeFilter = (valToRemove) => {
                            const newFilters = { ...filters };
                            if (Array.isArray(value)) {
                                newFilters[key] = value.filter(v => v !== valToRemove);
                                if (newFilters[key].length === 0) delete newFilters[key];
                            } else {
                                delete newFilters[key];
                            }
                            setFilters(newFilters);
                        };

                        const pillClass = pillColors[key] || "bg-white text-gray-800 border-black/5";

                        if (Array.isArray(value)) {
                            return value.map(val => (
                                <div key={`${key}-${val}`} className={`inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-[0.8125rem] font-semibold tracking-wide border transition-all duration-200 hover:-translate-y-px hover:shadow-md ${pillClass}`}>
                                    <span className="uppercase text-[0.625rem] tracking-wider opacity-60">{key.replace(/_/g, ' ')}:</span>
                                    <span>{val}</span>
                                    <button className="flex items-center justify-center p-0.5 rounded bg-black/10 border-none transition-colors duration-200 hover:bg-black/20" onClick={() => removeFilter(val)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ));
                        }

                        return (
                            <div key={key} className={`inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-[0.8125rem] font-semibold tracking-wide border transition-all duration-200 hover:-translate-y-px hover:shadow-md ${pillClass}`}>
                                <span className="uppercase text-[0.625rem] tracking-wider opacity-60">{key.replace(/_/g, ' ')}:</span>
                                <span>{value === 'true' ? 'Yes' : value}</span>
                                <button className="flex items-center justify-center p-0.5 rounded bg-black/10 border-none transition-colors duration-200 hover:bg-black/20" onClick={() => removeFilter()}>
                                    <X size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {error && <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">{error}</div>}

            <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Name</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Contact</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Company</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Type</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center p-12 text-text-secondary">
                                    <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                                </td>
                            </tr>
                        ) : attendees.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-12 text-text-secondary">No attendees found.</td>
                            </tr>
                        ) : (
                            attendees.map((attendee) => (
                                <tr
                                    key={attendee.uuid}
                                    className="cursor-pointer transition-colors duration-200 hover:bg-bg-secondary [&>td]:border-b [&>td]:border-border group"
                                    onClick={() => setSelectedAttendee(attendee)}
                                >
                                    <td className="py-4 px-6 align-top group-last:border-b-0">
                                        <div className="font-semibold text-text-primary text-sm flex items-center">
                                            {attendee.name}
                                            {attendee.is_poc && (
                                                <ShieldCheck
                                                    size={16}
                                                    className="ml-1.5 align-text-bottom text-accent"
                                                    title="Point of Contact (POC)"
                                                />
                                            )}
                                        </div>
                                        <div className="text-xs text-text-tertiary mt-0.5">Reg ID: {attendee.reg_id}</div>
                                    </td>
                                    <td className="py-4 px-6 align-top group-last:border-b-0">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[0.8125rem] text-text-secondary" title={attendee.email}>
                                                <Mail size={12} className="shrink-0" /> <span className="truncate max-w-[180px]">{attendee.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[0.8125rem] text-text-secondary" title={attendee.phone_number}>
                                                <Phone size={12} className="shrink-0" /> +{attendee.country_code} {attendee.phone_number}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-top group-last:border-b-0">
                                        <div className="flex flex-col">
                                            <div className="font-medium text-sm text-text-primary">
                                                {attendee.exhibitor_id ? (
                                                    <span
                                                        className="text-accent cursor-pointer hover:underline underline-offset-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/event/${selectedEvent.id}/companies/${attendee.exhibitor_id}`);
                                                        }}
                                                        title="View Company Details"
                                                    >
                                                        {attendee.company || '-'}
                                                    </span>
                                                ) : (
                                                    attendee.company || '-'
                                                )}
                                            </div>
                                            <div className="text-xs text-text-secondary mt-0.5">
                                                {[attendee.city, attendee.country].filter(Boolean).join(', ') || '-'}
                                            </div>
                                            {(attendee.website || attendee.parent_exhibitor_id) && (
                                                <div className="flex gap-2.5 mt-1.5">
                                                    {attendee.website && (
                                                        <div className="text-xs flex items-center gap-1">
                                                            <Globe size={10} className="text-text-tertiary" /> <a href={attendee.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-accent hover:underline">Website</a>
                                                        </div>
                                                    )}
                                                    {attendee.parent_exhibitor_id && (
                                                        <div className="text-xs flex items-center gap-1">
                                                            <Building2 size={10} className="text-text-tertiary" />
                                                            <span
                                                                className="text-accent cursor-pointer hover:underline text-[0.75rem] ml-1"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/event/${selectedEvent.id}/companies/${attendee.parent_exhibitor_id}`);
                                                                }}
                                                                title={`Go to Parent Exhibitor (ID: ${attendee.parent_exhibitor_id})`}
                                                            >
                                                                Parent Exhibitor
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-top group-last:border-b-0">
                                        <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 tracking-wide">{attendee.attendee_type}</span>
                                    </td>
                                    <td className="py-4 px-6 align-top group-last:border-b-0">
                                        <span className={`inline-flex py-1 px-2.5 rounded-full text-xs font-medium tracking-wide ${attendee.reg_type === 'ON_SPOT' ? 'bg-[#fefaca] text-[#854d0e]' : 'bg-[#dcfce7] text-[#166534]'}`}>
                                            {attendee.reg_type}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end items-center gap-4 mt-6">
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1 || loading}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span className="text-sm text-text-secondary">Page {page}</span>
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={attendees.length < 50 || loading}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            {/* Attendee Detail Modal */}
            {selectedAttendee && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1000] animate-fade-in" onClick={() => setSelectedAttendee(null)}>
                    <div
                        className={`bg-bg-primary rounded-lg border border-border shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-out ${isModalMaximized ? 'w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh]' : 'w-[90%] max-w-[600px] max-h-[85vh]'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-border flex justify-between items-start bg-bg-secondary">
                            <div>
                                <h2 className="text-xl font-bold text-text-primary mb-1">{selectedAttendee.name}</h2>
                                <span className="text-sm text-text-secondary">{selectedAttendee.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                                    onClick={() => setIsModalMaximized(!isModalMaximized)}
                                    title={isModalMaximized ? "Restore" : "Maximize"}
                                >
                                    <div className={`w-[14px] h-[14px] rounded-[2px] border-[1.5px] border-current transition-all ${isModalMaximized ? 'border-t-[3px] border-b-transparent border-l-transparent border-r-transparent h-0 mt-1.5 rounded-none' : ''}`}></div>
                                </button>
                                <button className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary" onClick={() => setSelectedAttendee(null)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {Object.entries(getGroupedFields(selectedAttendee)).map(([group, fields]) => (
                                <div key={group} className="mb-8 last:mb-0">
                                    <h4 className="text-xs uppercase tracking-wider text-text-tertiary mb-4 font-bold border-b border-border pb-2">{group}</h4>
                                    <div className={`grid gap-y-4 gap-x-6 ${isModalMaximized ? 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'}`}>
                                        {fields.map((field, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <label className="text-xs text-text-secondary font-medium">{field.label}</label>
                                                <div className="text-[0.925rem] text-text-primary break-words">{field.value !== null && field.value !== undefined && field.value !== '' ? field.value : '-'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Filter Drawer */}
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1100] transition-opacity duration-300 ${isFilterDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsFilterDrawerOpen(false)}>
                <div className={`absolute top-0 right-0 w-[400px] h-full bg-bg-primary shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 border-b border-border flex justify-between items-center">
                        <h3 className="text-lg font-bold m-0">Filters</h3>
                        <button className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary" onClick={() => setIsFilterDrawerOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Attendee Type</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {['Exhibitor', 'Visitor', 'VIP', 'Speaker', 'Media', 'Contractor'].map(type => (
                                    <button
                                        key={type}
                                        className={`py-2 px-3.5 border rounded-full text-xs font-medium transition-all duration-200 ${filters.attendee_type?.includes(type) ? 'bg-accent text-white border-accent' : 'bg-bg-primary border-border text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-secondary'}`}
                                        onClick={() => {
                                            const current = filters.attendee_type || [];
                                            const next = current.includes(type)
                                                ? current.filter(t => t !== type)
                                                : [...current, type];

                                            const newFilters = { ...filters };
                                            if (next.length > 0) newFilters.attendee_type = next;
                                            else delete newFilters.attendee_type;
                                            setFilters(newFilters);
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Registration Type</h4>
                            <div className="w-full">
                                <select
                                    className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                                    value={filters.reg_type || ''}
                                    onChange={(e) => setFilters({ ...filters, reg_type: e.target.value })}
                                >
                                    <option value="">All Types</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="ON_SPOT">On Spot</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">City</h4>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                                    placeholder="Enter city..."
                                    value={filters.city || ''}
                                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Country</h4>
                                <input
                                    type="text"
                                    className="w-full py-2.5 px-3.5 border border-border rounded-md text-sm bg-bg-secondary outline-none"
                                    placeholder="Enter country..."
                                    value={filters.country || ''}
                                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Status Filters</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-accent"
                                        checked={filters.is_poc === 'true'}
                                        onChange={(e) => {
                                            const newFilters = { ...filters };
                                            if (e.target.checked) newFilters.is_poc = 'true';
                                            else delete newFilters.is_poc;
                                            setFilters(newFilters);
                                        }}
                                    />
                                    <span>Point of Contact</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-accent"
                                        checked={filters.check_in === 'true'}
                                        onChange={(e) => {
                                            const newFilters = { ...filters };
                                            if (e.target.checked) newFilters.check_in = 'true';
                                            else delete newFilters.check_in;
                                            setFilters(newFilters);
                                        }}
                                    />
                                    <span>Checked In</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-accent"
                                        checked={filters.email_sent === 'true'}
                                        onChange={(e) => {
                                            const newFilters = { ...filters };
                                            if (e.target.checked) newFilters.email_sent = 'true';
                                            else delete newFilters.email_sent;
                                            setFilters(newFilters);
                                        }}
                                    />
                                    <span>Email Sent</span>
                                </label>
                                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md border border-transparent transition-colors hover:bg-bg-secondary">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-accent"
                                        checked={filters.whatsapp_sent === 'true'}
                                        onChange={(e) => {
                                            const newFilters = { ...filters };
                                            if (e.target.checked) newFilters.whatsapp_sent = 'true';
                                            else delete newFilters.whatsapp_sent;
                                            setFilters(newFilters);
                                        }}
                                    />
                                    <span>WhatsApp Sent</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider m-0">Registration Date</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-text-secondary">From</label>
                                    <input
                                        type="date"
                                        className="p-2 border border-border rounded-md text-sm outline-none"
                                        value={filters.created_at_start || ''}
                                        onChange={(e) => setFilters({ ...filters, created_at_start: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-text-secondary">To</label>
                                    <input
                                        type="date"
                                        className="p-2 border border-border rounded-md text-sm outline-none"
                                        value={filters.created_at_end || ''}
                                        onChange={(e) => setFilters({ ...filters, created_at_end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-border flex gap-4 bg-bg-secondary">
                        <button className="btn btn-secondary w-full" onClick={() => setFilters({})}>
                            Reset All
                        </button>
                        <button className="btn btn-primary w-full" onClick={() => setIsFilterDrawerOpen(false)}>
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendees;
