import { useState, useEffect, useRef } from 'react';

export default function useAttendeeSearch(searchParams, setPage) {
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [searchType, setSearchType] = useState(
        searchParams.get('search_type') === 'global' ? 'global' : 'local'
    );
    const [isSearchTypeOpen, setIsSearchTypeOpen] = useState(false);
    const searchTypeRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search, setPage]);

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
