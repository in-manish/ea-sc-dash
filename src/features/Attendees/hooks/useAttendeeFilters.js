import { useState } from 'react';
import { FILTER_PARAM_KEYS } from '../constants';

const getInitialFilters = (searchParams) => {
    const filters = {};

    FILTER_PARAM_KEYS.forEach((key) => {
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

export default function useAttendeeFilters(searchParams) {
    const [filters, setFilters] = useState(() => getInitialFilters(searchParams));
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const removeFilter = (key, valToRemove) => {
        setFilters((prev) => {
            const next = { ...prev };
            const value = prev[key];
            if (Array.isArray(value)) {
                next[key] = value.filter((v) => v !== valToRemove);
                if (next[key].length === 0) delete next[key];
            } else {
                delete next[key];
            }
            return next;
        });
    };

    const clearFilters = () => setFilters({});

    const updateFilter = (key, value) => {
        setFilters((prev) => {
            const next = { ...prev };
            if (value === '' || value === null || value === undefined) {
                delete next[key];
            } else if (Array.isArray(value) && value.length === 0) {
                delete next[key];
            } else {
                next[key] = value;
            }
            return next;
        });
    };

    const toggleAttendeeType = (type) => {
        setFilters((prev) => {
            const current = prev.attendee_type || [];
            const nextTypes = current.includes(type)
                ? current.filter((t) => t !== type)
                : [...current, type];
            const next = { ...prev };
            if (nextTypes.length > 0) next.attendee_type = nextTypes;
            else delete next.attendee_type;
            return next;
        });
    };

    const toggleBooleanFilter = (key, checked) => {
        setFilters((prev) => {
            const next = { ...prev };
            if (checked) next[key] = 'true';
            else delete next[key];
            return next;
        });
    };

    return {
        filters,
        setFilters,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        removeFilter,
        clearFilters,
        updateFilter,
        toggleAttendeeType,
        toggleBooleanFilter,
        activeFilterCount: Object.keys(filters).length,
    };
}
