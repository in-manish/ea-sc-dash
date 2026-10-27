import { useState, useEffect, useRef } from 'react';

export default function useAttendeeSearch(searchParams, setPage) {
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [searchType, setSearchType] = useState(
        searchParams.get('search_type') === 'global' ? 'global' : 'local'
    );
    const [isSearchTypeOpen, setIsSearchTypeOpen] = useState(false);
    const searchTypeRef = useRef(null);

    const submitSearch = (next = search) => {
        setSearch(next);
        setDebouncedSearch(next);
        setPage(1);
    };

    useEffect(() => {
        if (!isSearchTypeOpen) return undefined;

        const handleClickOutside = (event) => {
            if (searchTypeRef.current && !searchTypeRef.current.contains(event.target)) {
                setIsSearchTypeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSearchTypeOpen]);

    const clearSearch = () => {
        setSearch('');
        setDebouncedSearch('');
        setSearchType('local');
    };

    const selectSearchType = (type) => {
        setSearchType(type);
        setPage(1);
        setIsSearchTypeOpen(false);
    };

    return {
        search,
        setSearch,
        submitSearch,
        debouncedSearch,
        searchType,
        setSearchType,
        isSearchTypeOpen,
        setIsSearchTypeOpen,
        searchTypeRef,
        clearSearch,
        selectSearchType,
    };
}
