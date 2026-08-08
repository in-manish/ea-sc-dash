import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { listManageUsers } from '../api/manageUsersApi';
import {
    parsePermissionsParam,
    serializePermissionsParam,
    isAllPermissionsSelected,
} from '../domain/permissions';

const DEFAULT_SIZE = 20;

const readFilters = (searchParams) => ({
    search: searchParams.get('search') || '',
    permissions: parsePermissionsParam(searchParams.get('permissions')),
    email: searchParams.get('email') || '',
    phone_number: searchParams.get('phone_number') || '',
    username: searchParams.get('username') || '',
    page: Math.max(1, parseInt(searchParams.get('page'), 10) || 1),
    size: Math.max(1, parseInt(searchParams.get('size'), 10) || DEFAULT_SIZE),
});

export function useManageUsers() {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = readFilters(searchParams);

    const [searchInput, setSearchInput] = useState(filters.search);
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setSearchInput(filters.search);
    }, [filters.search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const next = searchInput.trim();
            if (next === filters.search) return;
            const params = new URLSearchParams(searchParams);
            if (next) params.set('search', next);
            else params.delete('search');
            params.set('page', '1');
            setSearchParams(params, { replace: true });
        }, 350);
        return () => clearTimeout(timer);
    }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

    const setFilter = useCallback((key, value) => {
        const params = new URLSearchParams(searchParams);
        if (key === 'permissions') {
            const serialized = serializePermissionsParam(value);
            if (serialized) params.set('permissions', serialized);
            else params.delete('permissions');
        } else if (value != null && String(value).trim() !== '') {
            params.set(key, String(value).trim());
        } else {
            params.delete(key);
        }
        if (key !== 'page') params.set('page', '1');
        setSearchParams(params, { replace: true });
    }, [searchParams, setSearchParams]);

    const setPermissions = useCallback((next) => {
        setFilter('permissions', next);
    }, [setFilter]);

    const setPage = useCallback((page) => {
        setFilter('page', page);
    }, [setFilter]);

    const clearFilters = useCallback(() => {
        setSearchInput('');
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const refresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;

        (async () => {
            setIsLoading(true);
            setError(null);

            const selected = filters.permissions;
            const baseOpts = {
                search: filters.search,
                email: filters.email,
                phone_number: filters.phone_number,
                username: filters.username,
                page: filters.page,
                size: filters.size,
            };

            try {
                let result;
                // Empty or all selected → no permission filter (list everyone)
                if (selected.length === 0 || isAllPermissionsSelected(selected)) {
                    result = await listManageUsers(token, baseOpts);
                } else if (selected.length === 1) {
                    result = await listManageUsers(token, {
                        ...baseOpts,
                        permission: selected[0],
                    });
                } else {
                    // API accepts one exact permission — fetch each and merge uniques
                    const pages = await Promise.all(
                        selected.map((permission) =>
                            listManageUsers(token, { ...baseOpts, permission })
                        )
                    );
                    const byId = new Map();
                    pages.forEach((page) => {
                        page.data.forEach((user) => byId.set(user.id, user));
                    });
                    result = {
                        data: [...byId.values()],
                        total: pages.reduce((sum, p) => sum + (p.total || 0), 0),
                        page: filters.page,
                        size: filters.size,
                    };
                }

                if (cancelled) return;
                setUsers(result.data);
                setTotal(result.total);
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setUsers([]);
                    setTotal(0);
                    setError(err.message || 'Failed to load users.');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [
        token,
        filters.search,
        filters.permissions.join(','),
        filters.email,
        filters.phone_number,
        filters.username,
        filters.page,
        filters.size,
        refreshKey,
    ]);

    const totalPages = Math.max(1, Math.ceil(total / filters.size) || 1);
    // Cleared (none) and "all selected" both mean unfiltered — not an active filter
    const permissionFilterActive =
        filters.permissions.length > 0 && !isAllPermissionsSelected(filters.permissions);
    const hasActiveFilters = Boolean(
        filters.search
        || permissionFilterActive
        || filters.email
        || filters.phone_number
        || filters.username
    );

    return {
        users,
        total,
        totalPages,
        isLoading,
        error,
        setError,
        filters,
        searchInput,
        setSearchInput,
        setFilter,
        setPermissions,
        setPage,
        clearFilters,
        hasActiveFilters,
        refresh,
    };
}
