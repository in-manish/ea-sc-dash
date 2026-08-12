import { useState, useEffect, useCallback } from 'react';
import { emailService } from '../../../../services/emailService';

const EMPTY_FILTERS = {
    search: '',
    email_name: '',
    template_type: '',
    is_active: '',
};

const EMPTY_OPTIONS = { email_names: [], template_types: [] };

export default function useEmailTemplatesList({ eventId, token }) {
    const [templates, setTemplates] = useState([]);
    const [filterOptions, setFilterOptions] = useState(EMPTY_OPTIONS);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTemplates = useCallback(async () => {
        if (!eventId || !token) return;
        setIsLoading(true);
        try {
            const data = await emailService.getEmailTemplates(eventId, token, {
                page,
                ...filters,
            });
            if (Array.isArray(data)) {
                setTemplates(data);
                setTotalPages(1);
            } else {
                setTemplates(data.results || []);
                setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 20)));
                if (data.filters) {
                    setFilterOptions((prev) => ({
                        email_names: data.filters.email_names?.length
                            ? data.filters.email_names
                            : prev.email_names,
                        template_types: data.filters.template_types?.length
                            ? data.filters.template_types
                            : prev.template_types,
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching email templates:', error);
        } finally {
            setIsLoading(false);
        }
    }, [eventId, token, page, filters]);

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (filters.search !== searchInput) {
                setFilters((prev) => ({ ...prev, search: searchInput }));
                setPage(1);
            }
        }, 400);
        return () => clearTimeout(handler);
    }, [searchInput, filters.search]);

    const setFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setSearchInput('');
        setFilters(EMPTY_FILTERS);
        setPage(1);
    };

    const hasActiveFilters = Object.values(filters).some((v) => v !== '');

    return {
        templates,
        filterOptions,
        filters,
        searchInput,
        setSearchInput,
        setFilter,
        clearFilters,
        hasActiveFilters,
        isLoading,
        page,
        setPage,
        totalPages,
        refetch: fetchTemplates,
    };
}
