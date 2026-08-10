import { useEffect, useState } from 'react';
import { userService } from '../../../services/userService';

const EMPTY_FILTERS = {
  search: '',
  name: '',
  email: '',
  phone_number: '',
  role: '',
  is_verified_email: '',
  is_verified_phone_number: '',
};

/** List state + fetch for SC admin Manage Users. */
export default function useScManageUsersList(token) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [enableHighlighting, setEnableHighlighting] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const queryParams = { limit: pagination.limit, offset: pagination.offset };
      if (filters.search) queryParams.search = filters.search;
      if (filters.name) queryParams.name = filters.name;
      if (filters.email) queryParams.email = filters.email;
      if (filters.phone_number) queryParams.phone_number = filters.phone_number;
      if (filters.role) queryParams.role = filters.role;
      if (filters.is_verified_email !== '') {
        queryParams.is_verified_email = filters.is_verified_email;
        queryParams.is_email_verified = filters.is_verified_email;
      }
      if (filters.is_verified_phone_number !== '') {
        queryParams.is_verified_phone_number = filters.is_verified_phone_number;
      }
      const data = await userService.adminGetUsers(queryParams, token);
      setResults(data?.results || []);
      setTotalCount(data?.count || 0);
    } catch (err) {
      console.error('Admin Fetch Users Error:', err);
      setError(err.message || 'Failed to fetch users. Make sure you are logged in as an administrator.');
      setResults([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.limit, pagination.offset, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (pagination.offset === 0) {
      fetchUsers();
    } else {
      setPagination((prev) => ({ ...prev, offset: 0 }));
    }
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    setPagination({ limit: 20, offset: 0 });
    setResults(null);
    setError('');
  };

  const handlePageChange = (newOffset) => {
    if (newOffset >= 0 && newOffset < totalCount) {
      setPagination((prev) => ({ ...prev, offset: newOffset }));
    }
  };

  const handleLimitChange = (limit) => {
    setPagination({ limit, offset: 0 });
  };

  const patchUserInResults = (result) => {
    setResults((prev) =>
      prev ? prev.map((u) => (u.id === result.id ? { ...u, ...result } : u)) : prev
    );
  };

  return {
    filters,
    pagination,
    isLoading,
    results,
    totalCount,
    error,
    showAdvancedFilters,
    enableHighlighting,
    setShowAdvancedFilters,
    setEnableHighlighting,
    fetchUsers,
    handleInputChange,
    handleSearchSubmit,
    handleClear,
    handlePageChange,
    handleLimitChange,
    patchUserInResults,
  };
}
