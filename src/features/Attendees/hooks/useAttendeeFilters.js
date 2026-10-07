import { useMemo, useState } from 'react';
import { FILTER_PARAM_KEYS } from '../constants';

const LIST_FILTER_KEYS = new Set(['attendee_type', 'permission_ids']);

export function readAttendeeFilters(searchParams) {
    const filters = {};

    FILTER_PARAM_KEYS.forEach((key) => {
        const val = searchParams.get(key);
        if (!val) return;
        filters[key] = LIST_FILTER_KEYS.has(key) ? val.split(',').filter(Boolean) : val;
    });

    return filters;
}

function writeAttendeeFilters(params, filters) {
    FILTER_PARAM_KEYS.forEach((key) => {
        const value = filters?.[key];
        if (value && (!Array.isArray(value) || value.length > 0)) {
            params.set(key, Array.isArray(value) ? value.join(',') : String(value));
        } else {
            params.delete(key);
        }
    });
}

export default function useAttendeeFilters(searchParams, setSearchParams) {
    const filters = useMemo(() => readAttendeeFilters(searchParams), [searchParams]);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const applyFilters = (nextOrUpdater) => {
        setSearchParams((prev) => {
            const current = readAttendeeFilters(prev);
            const next = typeof nextOrUpdater === 'function' ? nextOrUpdater(current) : nextOrUpdater;
            const params = new URLSearchParams(prev);
            writeAttendeeFilters(params, next);
            return params.toString() === prev.toString() ? prev : params;
        }, { replace: true });
    };

    const removeFilter = (key, valToRemove) => {
        applyFilters((prev) => {
            const next = { ...prev };
            const value = prev[key];
            if (Array.isArray(value)) {
                next[key] = value.filter((item) => item !== valToRemove);
                if (next[key].length === 0) delete next[key];
            } else {
                delete next[key];
            }
            return next;
        });
    };

    const updateFilter = (key, value) => {
        applyFilters((prev) => {
            const next = { ...prev };
            if (value === '' || value == null || (Array.isArray(value) && value.length === 0)) {
                delete next[key];
            } else {
                next[key] = value;
            }
            return next;
        });
    };

    const toggleAttendeeType = (type) => {
        applyFilters((prev) => {
            const current = prev.attendee_type || [];
            const nextTypes = current.includes(type)
                ? current.filter((item) => item !== type)
                : [...current, type];
            const next = { ...prev };
            if (nextTypes.length > 0) next.attendee_type = nextTypes;
            else delete next.attendee_type;
            return next;
        });
    };

    const toggleBooleanFilter = (key, checked) => {
        applyFilters((prev) => {
            const next = { ...prev };
            if (checked) next[key] = 'true';
            else delete next[key];
            return next;
        });
    };

    return {
        filters,
        setFilters: applyFilters,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        removeFilter,
        clearFilters: () => applyFilters({}),
        updateFilter,
        toggleAttendeeType,
        toggleBooleanFilter,
        activeFilterCount: Object.keys(filters).length,
    };
}
