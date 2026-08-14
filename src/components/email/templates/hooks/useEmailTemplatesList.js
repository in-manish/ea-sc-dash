import { useState, useEffect, useCallback } from 'react';
import { emailService } from '../../../../services/emailService';
import {
    EMPTY_FILTER_OPTIONS,
    EMPTY_TEMPLATE_FILTERS,
    hasActiveTemplateFilters,
    parseTemplateFilterOptions,
} from '../domain/parseTemplateFilters';
import { pickSupportingVariables } from '../domain/contentVariables';

function defaultFilters(eventId) {
    return {
        ...EMPTY_TEMPLATE_FILTERS,
        event: eventId ? String(eventId) : '',
    };
}

export default function useEmailTemplatesList({ eventId, token }) {
    const [templates, setTemplates] = useState([]);
    const [filterOptions, setFilterOptions] = useState(EMPTY_FILTER_OPTIONS);
    const [filters, setFilters] = useState(() => defaultFilters(eventId));
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [supportingVariables, setSupportingVariables] = useState([]);

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
                const next = pickSupportingVariables(
                    data[0]?.supporting_variables,
                );
                if (next.length) setSupportingVariables(next);
            } else {
                setTemplates(data.results || []);
                setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 20)));
                setFilterOptions((prev) => parseTemplateFilterOptions(data.filters, prev));
                const next = pickSupportingVariables(
                    data.supporting_variables,
                    data.filters?.supporting_variables,
                    data.results?.[0]?.supporting_variables,
                );
                if (next.length) setSupportingVariables(next);
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
        setFilters(defaultFilters(eventId));
        setPage(1);
    };

    return {
        templates,
        filterOptions,
        filters,
        searchInput,
        setSearchInput,
        setFilter,
        clearFilters,
        hasActiveFilters: hasActiveTemplateFilters(filters, eventId),
        isLoading,
        page,
        setPage,
        totalPages,
        supportingVariables,
        refetch: fetchTemplates,
    };
}
