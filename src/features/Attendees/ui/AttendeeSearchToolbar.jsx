import { useEffect, useRef, useState } from 'react';
import { Search, Filter, Globe, MapPin, X, ChevronDown, Hash, Upload } from 'lucide-react';
import { ACTION_BTN_STYLE } from '../constants';
import { getAttendeeUploads } from '../api/attendeeUploadApi';

function QuickFilterField({ label, placeholder, value, onChange, icon: Icon, inputClassName }) {
    const [draft, setDraft] = useState(value || '');
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        setDraft(value || '');
    }, [value]);

    return (
        <label className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary whitespace-nowrap inline-flex items-center gap-1.5">
                <Icon size={13} className="text-accent" />
                {label}
            </span>
            <span className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onChangeRef.current(draft);
                    }}
                    className={`${inputClassName} h-9 pl-2.5 pr-7 border border-border rounded-md text-sm outline-none bg-bg-primary focus:border-accent focus:ring-2 focus:ring-accent/10`}
                />
                {draft && (
                    <button
                        type="button"
                        aria-label={`Clear ${label}`}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
                        onClick={() => {
                            setDraft('');
                            onChangeRef.current('');
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
            </span>
        </label>
    );
}

function shortUploadDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

const UPLOAD_PAGE_SIZE = 5;

function rowsFromUploadPage(data) {
    const rows = Array.isArray(data?.upload_data) ? data.upload_data : [];
    return rows.filter((row) => row?.upload_id);
}

function UploadIdSuggestField({ eventId, token, value, onChange }) {
    const [draft, setDraft] = useState(value || '');
    const [open, setOpen] = useState(false);
    const [matches, setMatches] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const onChangeRef = useRef(onChange);
    const boxRef = useRef(null);
    const requestRef = useRef(0);
    onChangeRef.current = onChange;

    useEffect(() => {
        setDraft(value || '');
    }, [value]);

    useEffect(() => {
        if (!open || !eventId || !token) return undefined;
        let active = true;
        const requestId = requestRef.current + 1;
        requestRef.current = requestId;
        const timer = setTimeout(() => {
            setLoading(true);
            setLoadingMore(false);
            setPage(1);
            getAttendeeUploads(eventId, token, {
                page: 1,
                size: UPLOAD_PAGE_SIZE,
                sortBy: 'uploaded_on',
                sortOrder: 'desc',
                q: draft.trim(),
                summary: true,
            })
                .then((data) => {
                    if (!active || requestId !== requestRef.current) return;
                    const rows = rowsFromUploadPage(data);
                    setMatches(rows);
                    setTotal(Number(data?.total) || rows.length);
                })
                .catch(() => {
                    if (!active || requestId !== requestRef.current) return;
                    setMatches([]);
                    setTotal(0);
                })
                .finally(() => {
                    if (active && requestId === requestRef.current) setLoading(false);
                });
        }, 250);
        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [open, eventId, token, draft]);

    const hasMore = matches.length < total;

    const loadMore = () => {
        if (!eventId || !token || loading || loadingMore || !hasMore) return;
        const requestId = requestRef.current;
        const nextPage = page + 1;
        setLoadingMore(true);
        getAttendeeUploads(eventId, token, {
            page: nextPage,
            size: UPLOAD_PAGE_SIZE,
            sortBy: 'uploaded_on',
            sortOrder: 'desc',
            q: draft.trim(),
            summary: true,
        })
            .then((data) => {
                if (requestId !== requestRef.current) return;
                const rows = rowsFromUploadPage(data);
                setTotal(Number(data?.total) || 0);
                setPage(nextPage);
                setMatches((current) => {
                    const seen = new Set(current.map((row) => row.upload_id));
                    return [...current, ...rows.filter((row) => !seen.has(row.upload_id))];
                });
            })
            .catch(() => {})
            .finally(() => {
                if (requestId === requestRef.current) setLoadingMore(false);
            });
    };

    useEffect(() => {
        if (!open) return undefined;
        const close = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    const choose = (uploadId) => {
        setDraft(uploadId);
        onChangeRef.current(uploadId);
        setOpen(false);
    };

    return (
        <label className="inline-flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary whitespace-nowrap inline-flex items-center gap-1.5">
                <Upload size={13} className="text-accent" />
                Upload ID
            </span>
            <span className="relative" ref={boxRef}>
                <input
                    type="text"
                    placeholder="A123"
                    value={draft}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setDraft(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onChangeRef.current(draft);
                            setOpen(false);
                        }
                        if (e.key === 'Escape') setOpen(false);
                    }}
                    className="w-24 h-9 pl-2.5 pr-7 border border-border rounded-md text-sm outline-none bg-bg-primary focus:border-accent focus:ring-2 focus:ring-accent/10"
                    aria-autocomplete="list"
                    aria-expanded={open}
                />
                {draft && (
                    <button
                        type="button"
                        aria-label="Clear Upload ID"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
                        onClick={() => {
                            setDraft('');
                            onChangeRef.current('');
                            setOpen(true);
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
                {open && (
                    <div className="absolute left-0 top-[calc(100%+4px)] z-30 w-56 bg-bg-primary border border-border rounded-lg shadow-lg overflow-hidden">
                        <div className="max-h-64 overflow-y-auto">
                            {loading && <p className="m-0 px-3 py-2 text-xs text-text-tertiary">Loading uploads…</p>}
                            {!loading && matches.length === 0 && (
                                <p className="m-0 px-3 py-2 text-xs text-text-tertiary">No matching uploads</p>
                            )}
                            {!loading && matches.map((row) => (
                                <button
                                    key={row.id || row.upload_id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-bg-secondary border-none bg-transparent cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => choose(row.upload_id)}
                                >
                                    <span className="block text-sm font-semibold text-text-primary">{row.upload_id}</span>
                                    <span className="block text-[11px] text-text-tertiary truncate">
                                        {[row.upload_type, shortUploadDate(row.uploaded_on)].filter(Boolean).join(' · ')}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {!loading && hasMore && (
                            <button
                                type="button"
                                className="w-full px-3 py-2 text-xs font-semibold text-accent bg-bg-secondary border-none border-t border-border cursor-pointer hover:bg-bg-tertiary"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={loadMore}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading…' : `Load more (${matches.length} of ${total})`}
                            </button>
                        )}
                    </div>
                )}
            </span>
        </label>
    );
}

const AttendeeSearchToolbar = ({
    search,
    onSearchChange,
    onSubmitSearch,
    searchType,
    isSearchTypeOpen,
    setIsSearchTypeOpen,
    searchTypeRef,
    onSelectSearchType,
    filters,
    onQuickFilter,
    eventId,
    token,
    onOpenFilters,
    onClearAll,
}) => (
    <div className="flex flex-col gap-3 mb-5">
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex flex-1 items-stretch min-w-0">
            <div className="relative flex-1 min-w-0">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by name, email, phone, reg ID…"
                    style={{ height: 48, minHeight: 48, boxSizing: 'border-box' }}
                    className="w-full pl-11 pr-9 border border-border rounded-l-md rounded-r-none text-sm outline-none transition-colors duration-200 bg-bg-primary focus:border-accent focus:ring-2 focus:ring-accent/10"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSubmitSearch(e.currentTarget.value);
                    }}
                />
                {search && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
                        onClick={() => onSubmitSearch('')}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="relative" ref={searchTypeRef}>
                <button
                    type="button"
                    title={searchType === 'global' ? 'Global search' : 'Local search'}
                    aria-label={`Search type: ${searchType}`}
                    aria-expanded={isSearchTypeOpen}
                    onClick={() => setIsSearchTypeOpen((open) => !open)}
                    style={{ height: 48, minHeight: 48, boxSizing: 'border-box' }}
                    className="px-3.5 border border-l-0 border-border rounded-r-md bg-bg-primary text-text-secondary hover:text-accent hover:bg-bg-secondary transition-colors inline-flex items-center gap-1.5"
                >
                    {searchType === 'global' ? <Globe size={18} /> : <MapPin size={18} />}
                    <ChevronDown size={14} className={`transition-transform ${isSearchTypeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSearchTypeOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] z-30 min-w-[44px] bg-bg-primary border border-border rounded-lg shadow-lg overflow-hidden py-1">
                        <button
                            type="button"
                            title="Local search"
                            aria-label="Local search"
                            onClick={() => onSelectSearchType('local')}
                            className={`w-full flex items-center justify-center px-3 py-2.5 transition-colors ${
                                searchType === 'local'
                                    ? 'text-accent bg-accent/5'
                                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                            }`}
                        >
                            <MapPin size={16} />
                        </button>
                        <button
                            type="button"
                            title="Global search"
                            aria-label="Global search"
                            onClick={() => onSelectSearchType('global')}
                            className={`w-full flex items-center justify-center px-3 py-2.5 transition-colors ${
                                searchType === 'global'
                                    ? 'text-accent bg-accent/5'
                                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                            }`}
                        >
                            <Globe size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                data-testid="filter-attendees-btn"
                style={ACTION_BTN_STYLE}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border ${
                    Object.keys(filters).length > 0
                        ? 'border-transparent bg-accent text-accent-text hover:bg-accent-hover'
                        : 'bg-bg-primary border-border text-text-primary hover:bg-bg-secondary hover:border-border-hover'
                }`}
                onClick={onOpenFilters}
            >
                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                Filter{Object.keys(filters).length > 0 ? ` (${Object.keys(filters).length})` : ''}
            </button>
            {(Object.keys(filters).length > 0 || search) && (
                <button
                    type="button"
                    style={{ height: 48, minHeight: 48, boxSizing: 'border-box' }}
                    className="inline-flex items-center justify-center px-4 rounded-md text-sm font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                    onClick={onClearAll}
                >
                    Clear
                </button>
            )}
        </div>
    </div>

    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <QuickFilterField
            label="Reg IDs"
            placeholder="100-200"
            inputClassName="w-32"
            icon={Hash}
            value={filters.reg_id_query || ''}
            onChange={(next) => onQuickFilter('reg_id_query', next)}
        />
        <UploadIdSuggestField
            eventId={eventId}
            token={token}
            value={filters.upload_id || ''}
            onChange={(next) => onQuickFilter('upload_id', next)}
        />
    </div>
    </div>
);

export default AttendeeSearchToolbar;
