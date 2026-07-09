import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { 
  Search, Loader2, Mail, Phone, MapPin, Building, 
  ShieldCheck, ShieldAlert, X, ChevronLeft, ChevronRight,
  Filter, RotateCcw, User, Info, CheckCircle2, AlertCircle, Edit2, Copy
} from 'lucide-react';

const ManageUsers = () => {
  const { token } = useAuth();
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    search: '',
    name: '',
    email: '',
    phone_number: '',
    is_verified_email: '', // empty string for all/null, 'true', 'false'
    is_verified_phone_number: '' // empty string for all/null, 'true', 'false'
  });

  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [enableHighlighting, setEnableHighlighting] = useState(true);

  // Edit user state
  const [editingUser, setEditingUser] = useState(null);
  const [originalUserValues, setOriginalUserValues] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [duplicateUsersByEmail, setDuplicateUsersByEmail] = useState([]);
  const [duplicateUsersByPhone, setDuplicateUsersByPhone] = useState([]);
  const [ignoreEmailWarnings, setIgnoreEmailWarnings] = useState(false);
  const [ignorePhoneWarnings, setIgnorePhoneWarnings] = useState(false);

  // Fetch users function
  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Build query params
      const queryParams = {
        limit: pagination.limit,
        offset: pagination.offset
      };

      if (filters.search) queryParams.search = filters.search;
      if (filters.name) queryParams.name = filters.name;
      if (filters.email) queryParams.email = filters.email;
      if (filters.phone_number) queryParams.phone_number = filters.phone_number;

      // Handle tri-state dropdowns (All, True, False)
      if (filters.is_verified_email !== '') {
        queryParams.is_verified_email = filters.is_verified_email;
        // Also support backend variations just in case
        queryParams.is_email_verified = filters.is_verified_email;
      }
      if (filters.is_verified_phone_number !== '') {
        queryParams.is_verified_phone_number = filters.is_verified_phone_number;
      }

      const data = await userService.adminGetUsers(queryParams, token);
      
      if (data && data.results) {
        setResults(data.results);
        setTotalCount(data.count || 0);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Admin Fetch Users Error:', err);
      setError(err.message || 'Failed to fetch users. Make sure you are logged in as an administrator.');
      setResults([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users on component mount or pagination change
  useEffect(() => {
    fetchUsers();
  }, [pagination.limit, pagination.offset, token]);

  // Debounced duplication check for Email & Phone
  useEffect(() => {
    if (!editingUser || !isEditModalOpen) return;

    const checkEmailDup = async () => {
      const email = editingUser.email;
      console.log("Checking duplicate email:", email, "original:", originalUserValues?.email);
      if (!email || email === originalUserValues?.email) {
        setDuplicateUsersByEmail([]);
        return;
      }
      try {
        const response = await userService.adminGetUsers({ email }, token);
        console.log("Duplicate email response:", response);
        if (response && response.results) {
          // Filter out the current user being edited (type-safe comparison)
          const matches = response.results.filter(u => String(u.id) !== String(editingUser.id));
          console.log("Duplicate email matches found:", matches);
          setDuplicateUsersByEmail(matches);
        } else {
          setDuplicateUsersByEmail([]);
        }
      } catch (err) {
        console.error("Email duplicate check failed:", err);
        setDuplicateUsersByEmail([]);
      }
    };

    const checkPhoneDup = async () => {
      const phone = editingUser.phone_number;
      console.log("Checking duplicate phone:", phone, "original:", originalUserValues?.phone_number);
      if (!phone || phone === originalUserValues?.phone_number) {
        setDuplicateUsersByPhone([]);
        return;
      }
      try {
        const response = await userService.adminGetUsers({ phone_number: phone }, token);
        console.log("Duplicate phone response:", response);
        if (response && response.results) {
          // Filter out the current user being edited (type-safe comparison)
          const matches = response.results.filter(u => String(u.id) !== String(editingUser.id));
          console.log("Duplicate phone matches found:", matches);
          setDuplicateUsersByPhone(matches);
        } else {
          setDuplicateUsersByPhone([]);
        }
      } catch (err) {
        console.error("Phone duplicate check failed:", err);
        setDuplicateUsersByPhone([]);
      }
    };

    const emailTimer = setTimeout(checkEmailDup, 400);
    const phoneTimer = setTimeout(checkPhoneDup, 400);

    return () => {
      clearTimeout(emailTimer);
      clearTimeout(phoneTimer);
    };
  }, [editingUser?.email, editingUser?.phone_number, isEditModalOpen, originalUserValues, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, offset: 0 })); // Reset to first page
    fetchUsers();
  };

  const handleClear = () => {
    setFilters({
      search: '',
      name: '',
      email: '',
      phone_number: '',
      is_verified_email: '',
      is_verified_phone_number: ''
    });
    setPagination({
      limit: 20,
      offset: 0
    });
    setResults(null);
    setError('');
  };

  const handlePageChange = (newOffset) => {
    if (newOffset >= 0 && newOffset < totalCount) {
      setPagination(prev => ({
        ...prev,
        offset: newOffset
      }));
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleEditClick = (user) => {
    const userVals = {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      is_verified_email: user.is_verified_email === true,
      is_verified_phone_number: user.is_verified_phone_number === true
    };
    setEditingUser(userVals);
    setEditingUser(userVals);
    setOriginalUserValues(userVals);
    setDuplicateUsersByEmail([]);
    setDuplicateUsersByPhone([]);
    setIgnoreEmailWarnings(false);
    setIgnorePhoneWarnings(false);
    setUpdateError('');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setOriginalUserValues(null);
    setDuplicateUsersByEmail([]);
    setDuplicateUsersByPhone([]);
    setIgnoreEmailWarnings(false);
    setIgnorePhoneWarnings(false);
    setUpdateError('');
    setSuccessMessage('');
  };

  const handleCopy = (text, typeLabel) => {
    navigator.clipboard.writeText(String(text));
  };

  const handleNavigateToMatch = (matchedUser) => {
    const userVals = {
      id: matchedUser.id,
      name: matchedUser.name || '',
      email: matchedUser.email || '',
      phone_number: matchedUser.phone_number || '',
      is_verified_email: matchedUser.is_verified_email === true,
      is_verified_phone_number: matchedUser.is_verified_phone_number === true
    };
    setEditingUser(userVals);
    setOriginalUserValues(userVals);
    setDuplicateUsersByEmail([]);
    setDuplicateUsersByPhone([]);
    setIgnoreEmailWarnings(false);
    setIgnorePhoneWarnings(false);
    setUpdateError('');
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'email') setIgnoreEmailWarnings(false);
    if (name === 'phone_number') setIgnorePhoneWarnings(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError('');
    setSuccessMessage('');

    try {
      const updatedData = {
        name: editingUser.name,
        email: editingUser.email,
        phone_number: editingUser.phone_number,
        is_verified_email: editingUser.is_verified_email,
        is_verified_phone_number: editingUser.is_verified_phone_number
      };

      const result = await userService.adminUpdateUser(editingUser.id, updatedData, token);
      
      // Update local state directly so the table updates without page refresh
      if (results) {
        setResults(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...result } : u));
      }
      
      setSuccessMessage('User updated successfully!');
      setTimeout(() => {
        closeEditModal();
      }, 1000);
    } catch (err) {
      console.error('Update user error:', err);
      setUpdateError(err.message || 'Failed to update user. Make sure you have admin permissions.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper to match text and highlight
  const highlightMatch = (text, searchVal) => {
    if (!searchVal || !text) return text;
    const parts = String(text).split(new RegExp(`(${searchVal})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchVal.toLowerCase() 
            ? <mark key={i} className="bg-yellow-100 text-yellow-800 px-0.5 rounded">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  // Function to determine row styling/highlighting
  const getRowClass = (user) => {
    if (!enableHighlighting) return 'hover:bg-bg-secondary/20 transition-colors';

    const isEmailVerified = user.is_verified_email === true;
    const isPhoneVerified = user.is_verified_phone_number === true;

    if (isEmailVerified && isPhoneVerified) {
      return 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] transition-colors border-l-4 border-l-success';
    }
    if (isEmailVerified) {
      return 'bg-teal-500/[0.03] hover:bg-teal-500/[0.07] transition-colors border-l-4 border-l-teal-500';
    }
    if (isPhoneVerified) {
      return 'bg-blue-500/[0.03] hover:bg-blue-500/[0.07] transition-colors border-l-4 border-l-blue-500';
    }

    // Not verified/Partial not verified
    return 'hover:bg-bg-secondary/20 transition-colors border-l-4 border-l-transparent';
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(totalCount / pagination.limit) || 1;

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 pb-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">Snapcard Administration</span>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Manage Users</h1>
          <p className="text-sm text-text-secondary">Search, filter, paginate and verify Snapcard users globally</p>
        </div>

        {/* Global Highlight Toggle */}
        <div className="flex items-center gap-2 bg-bg-primary border border-border px-3 py-1.5 rounded-md shadow-sm">
          <input
            id="enable-highlighting"
            type="checkbox"
            checked={enableHighlighting}
            onChange={(e) => setEnableHighlighting(e.target.checked)}
            className="w-4 h-4 text-accent border-border rounded focus:ring-accent"
          />
          <label htmlFor="enable-highlighting" className="text-xs font-medium text-text-secondary cursor-pointer select-none">
            Highlight Verified Rows
          </label>
        </div>
      </div>

      {/* Search & Filter Panel */}
      <div className="bg-bg-primary rounded-lg border border-border shadow-sm mb-6 overflow-hidden">
        <form onSubmit={handleSearchSubmit} className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" size={18} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                className="pl-10 input-field"
                placeholder="Search by name, email or phone (partial match)..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`btn btn-secondary flex items-center gap-2 ${showAdvancedFilters ? 'bg-bg-secondary border-border-hover' : ''}`}
              >
                <Filter size={16} />
                Filters
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-secondary flex items-center gap-2"
                disabled={isLoading}
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2 min-w-[120px]"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Search
              </button>
            </div>
          </div>

          {/* Advanced Filters (Collapsible) */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <div className="input-group">
                <label className="input-label">Name Filter</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Case-insensitive name..."
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Filter</label>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Partial email..."
                />
              </div>

              <div className="input-group">
                <label className="input-label">Phone Filter</label>
                <input
                  type="text"
                  name="phone_number"
                  value={filters.phone_number}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Partial phone..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="input-group">
                  <label className="input-label">Email Verified</label>
                  <select
                    name="is_verified_email"
                    value={filters.is_verified_email}
                    onChange={handleInputChange}
                    className="input-field py-2"
                  >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Phone Verified</label>
                  <select
                    name="is_verified_phone_number"
                    value={filters.is_verified_phone_number}
                    onChange={handleInputChange}
                    className="input-field py-2"
                  >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-danger p-4 rounded-lg text-sm border border-red-100 mb-6 flex items-start gap-2.5 animate-fade-in">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-0.5">Error Fetching Users</h4>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Results View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-bg-primary rounded-lg border border-border shadow-sm">
          <Loader2 size={40} className="animate-spin text-accent mb-4" />
          <span className="text-text-secondary font-medium">Fetching administrative records...</span>
        </div>
      ) : results !== null ? (
        <div className="bg-bg-primary rounded-lg border border-border overflow-hidden shadow-sm">
          {/* Table Header Controls */}
          <div className="px-6 py-4 border-b border-border bg-bg-secondary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-text-primary">Administrative User List</h2>
              <span className="text-xs bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded-full">{totalCount} total</span>
            </div>
            
            {/* Page Limit Selector */}
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>Show per page:</span>
              <select
                value={pagination.limit}
                onChange={(e) => setPagination(prev => ({ ...prev, limit: Number(e.target.value), offset: 0 }))}
                className="bg-bg-primary border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>

          {/* Results Table */}
          {results.length === 0 ? (
            <div className="p-16 text-center text-text-tertiary">
              <User size={48} className="mx-auto mb-4 text-border-hover" />
              <h3 className="font-semibold text-text-secondary mb-1">No Users Match Criteria</h3>
              <p className="text-sm">Try broadening your search query or clearing some of the filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-secondary/40 text-text-tertiary text-xs font-semibold uppercase tracking-wider border-b border-border">
                    <th className="py-3.5 px-6">User Details</th>
                    <th className="py-3.5 px-6">Contact / Location</th>
                    <th className="py-3.5 px-6">Organization</th>
                    <th className="py-3.5 px-6">Verification</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.map((user) => {
                    const isEmailVerified = user.is_verified_email === true;
                    const isPhoneVerified = user.is_verified_phone_number === true;
                    
                    return (
                      <tr key={user.id} className={getRowClass(user)}>
                        {/* User Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm shrink-0">
                              {getInitials(user.name)}
                            </div>
                            <div>
                              <div className="font-semibold text-text-primary text-sm">
                                {highlightMatch(user.name || 'No Name', filters.search || filters.name)}
                              </div>
                              <div className="text-[11px] text-text-tertiary mt-0.5">User ID: #{user.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Column */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 text-xs text-text-secondary">
                            {user.email && (
                              <div className="flex items-center gap-1.5">
                                <Mail size={12} className="text-text-tertiary shrink-0" />
                                <span className="truncate max-w-[200px]" title={user.email}>
                                  {highlightMatch(user.email, filters.search || filters.email)}
                                </span>
                              </div>
                            )}
                            {user.phone_number && (
                              <div className="flex items-center gap-1.5">
                                <Phone size={12} className="text-text-tertiary shrink-0" />
                                <span>
                                  {user.country_code ? `+${user.country_code} ` : ''}
                                  {highlightMatch(user.phone_number, filters.search || filters.phone_number)}
                                </span>
                              </div>
                            )}
                            {(user.city || user.state || user.country) && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <MapPin size={12} className="text-text-tertiary shrink-0" />
                                <span className="text-[11px] text-text-tertiary truncate max-w-[220px]">
                                  {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Organization Column */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-0.5 text-xs text-text-secondary">
                            {user.company ? (
                              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                                <Building size={12} className="text-text-tertiary shrink-0" />
                                <span className="truncate max-w-[180px]">{user.company}</span>
                              </div>
                            ) : (
                              <span className="text-text-tertiary italic">No Company</span>
                            )}
                            {user.designation && (
                              <span className="text-[11px] text-text-secondary ml-4.5 truncate max-w-[180px]" title={user.designation}>
                                {user.designation}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Verification Column */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1.5 items-start">
                            {/* Email status */}
                            <div className="flex items-center gap-1.5">
                              {isEmailVerified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck size={11} /> Email Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <ShieldAlert size={11} /> Email Unverified
                                </span>
                              )}
                            </div>

                            {/* Phone status */}
                            <div className="flex items-center gap-1.5">
                              {isPhoneVerified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck size={11} /> Phone Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <ShieldAlert size={11} /> Phone Unverified
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="py-4 px-6">
                          {user.role ? (
                            <span className="inline-block text-[10px] font-bold text-text-secondary bg-bg-secondary border border-border px-2 py-0.5 rounded uppercase tracking-wide">
                              {user.role}
                            </span>
                          ) : (
                            <span className="text-text-tertiary text-xs italic">-</span>
                          )}
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => handleEditClick(user)}
                            className="btn btn-secondary py-1 px-2.5 flex items-center gap-1.5 text-xs text-accent hover:bg-accent/5 border-border"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border bg-bg-secondary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-text-secondary">
                Showing page <strong className="font-semibold text-text-primary">{currentPage}</strong> of <strong className="font-semibold text-text-primary">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.offset - pagination.limit)}
                  className="btn btn-secondary py-1.5 px-3 flex items-center gap-1 text-xs"
                  disabled={pagination.offset === 0}
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>
                
                {/* Pages indicators */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                    // Let's keep the active page centered if possible
                    let pageNum = idx + 1;
                    if (currentPage > 3 && totalPages > 5) {
                      if (currentPage + 2 <= totalPages) {
                        pageNum = currentPage - 2 + idx;
                      } else {
                        pageNum = totalPages - 4 + idx;
                      }
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange((pageNum - 1) * pagination.limit)}
                        className={`py-1.5 px-3 rounded text-xs font-semibold border transition-all ${
                          pageNum === currentPage
                            ? 'bg-accent text-accent-text border-accent'
                            : 'bg-bg-primary text-text-secondary border-border hover:bg-bg-secondary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                  className="btn btn-secondary py-1.5 px-3 flex items-center gap-1 text-xs"
                  disabled={pagination.offset + pagination.limit >= totalCount}
                >
                  Next
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-bg-primary rounded-lg border border-border shadow-sm">
          <Info size={40} className="text-text-tertiary mb-3" />
          <h3 className="font-semibold text-text-secondary">Start Searching</h3>
          <p className="text-sm text-text-tertiary">Use the input filters above to query admin records.</p>
        </div>
      )}
      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-backdrop-smooth">
          <div className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-[500px] overflow-hidden animate-modal-smooth">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg-secondary/20">
              <h3 className="font-bold text-text-primary text-base">Edit User Details (ID: #{editingUser.id})</h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-text-secondary hover:text-text-primary transition-colors border-none bg-transparent"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              {updateError && (
                <div className="bg-red-50 text-danger p-3 rounded-md text-xs border border-red-100 flex items-start gap-2 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{updateError}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 text-success p-3 rounded-md text-xs border border-green-100 flex items-start gap-2 animate-fade-in">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="input-group">
                <label className="input-label" htmlFor="edit-name">Full Name</label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={editingUser.name}
                  onChange={handleEditChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="edit-email">Email Address</label>
                <input
                  id="edit-email"
                  type="email"
                  name="email"
                  value={editingUser.email}
                  onChange={handleEditChange}
                  className="input-field"
                  required
                />
                  {duplicateUsersByEmail.length > 0 && !ignoreEmailWarnings && (
                  <div className="bg-amber-50/50 text-amber-900 p-3 rounded-lg border border-amber-200/60 text-[11px] space-y-2 mt-2 animate-fade-in shadow-inner">
                    <div className="font-semibold flex items-center justify-between text-amber-950">
                      <div className="flex items-center gap-1">
                        <AlertCircle size={13} className="text-amber-700" /> Matches Found ({duplicateUsersByEmail.length})
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIgnoreEmailWarnings(true)}
                          className="text-[10px] text-amber-800 hover:text-danger hover:underline bg-transparent border-none cursor-pointer font-bold px-1"
                          title="Dismiss all duplicate email warnings"
                        >
                          Ignore
                        </button>
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">Duplicate Email</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {duplicateUsersByEmail.slice(0, 10).map(u => (
                        <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-md border border-amber-200 bg-bg-primary gap-2 shadow-sm animate-fade-in">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-full bg-accent/5 text-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-text-primary text-[11.5px] truncate">{u.name || 'No Name'}</div>
                              <div className="text-[10px] text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                <span className="flex items-center gap-0.5 text-text-tertiary shrink-0">
                                  ID: <strong className="text-text-primary font-semibold">#{u.id}</strong>
                                  <button type="button" onClick={() => handleCopy(u.id, 'ID')} className="p-0.5 text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer flex" title="Copy ID">
                                    <Copy size={10} />
                                  </button>
                                </span>
                                <span className="text-text-tertiary shrink-0">|</span>
                                <span className="flex items-center gap-0.5 shrink-0 bg-yellow-100/80 px-1 rounded text-yellow-900 border border-yellow-200/50">
                                  Email: <strong className="font-semibold">{u.email || '-'}</strong>
                                  {u.email && (
                                    <button type="button" onClick={() => handleCopy(u.email, 'Email')} className="p-0.5 text-yellow-900/60 hover:text-yellow-900 bg-transparent border-none cursor-pointer flex" title="Copy Email">
                                      <Copy size={10} />
                                    </button>
                                  )}
                                </span>
                                <span className="text-text-tertiary shrink-0">|</span>
                                <span className="flex items-center gap-0.5 shrink-0 text-text-tertiary">
                                  Phone: <strong className="text-text-primary font-semibold">+{u.country_code || '91'} {u.phone_number || '-'}</strong>
                                  {u.phone_number && (
                                    <button type="button" onClick={() => handleCopy(u.phone_number, 'Phone')} className="p-0.5 text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer flex" title="Copy Phone">
                                      <Copy size={10} />
                                    </button>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <div className="flex flex-col gap-0.5 items-end">
                              {u.is_verified_email ? (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck size={9} /> Email Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <ShieldAlert size={9} /> Email Unverified
                                </span>
                              )}
                              {u.is_verified_phone_number ? (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck size={9} /> Phone Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <ShieldAlert size={9} /> Phone Unverified
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleNavigateToMatch(u)}
                              className="btn btn-secondary py-1 px-2 text-[10px] text-accent hover:bg-accent/5 border-border shrink-0 font-semibold h-7"
                              title="Switch to editing this user"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="edit-phone">Phone Number</label>
                <input
                  id="edit-phone"
                  type="text"
                  name="phone_number"
                  value={editingUser.phone_number}
                  onChange={handleEditChange}
                  className="input-field"
                  required
                />
                 {duplicateUsersByPhone.length > 0 && !ignorePhoneWarnings && (
                  <div className="bg-amber-50/50 text-amber-900 p-3 rounded-lg border border-amber-200/60 text-[11px] space-y-2 mt-2 animate-fade-in shadow-inner">
                    <div className="font-semibold flex items-center justify-between text-amber-950">
                      <div className="flex items-center gap-1">
                        <AlertCircle size={13} className="text-amber-700" /> Matches Found ({duplicateUsersByPhone.length})
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIgnorePhoneWarnings(true)}
                          className="text-[10px] text-amber-800 hover:text-danger hover:underline bg-transparent border-none cursor-pointer font-bold px-1"
                          title="Dismiss all duplicate phone warnings"
                        >
                          Ignore
                        </button>
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">Duplicate Phone</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {duplicateUsersByPhone.slice(0, 10).map(u => (
                        <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-md border border-amber-200 bg-bg-primary gap-2 shadow-sm animate-fade-in">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div className="w-7 h-7 rounded-full bg-accent/5 text-accent flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-text-primary text-[11.5px] truncate">{u.name || 'No Name'}</div>
                              <div className="text-[10px] text-text-secondary flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                <span className="flex items-center gap-0.5 text-text-tertiary shrink-0">
                                  ID: <strong className="text-text-primary font-semibold">#{u.id}</strong>
                                  <button type="button" onClick={() => handleCopy(u.id, 'ID')} className="p-0.5 text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer flex" title="Copy ID">
                                    <Copy size={10} />
                                  </button>
                                </span>
                                <span className="text-text-tertiary shrink-0">|</span>
                                <span className="flex items-center gap-0.5 shrink-0 text-text-tertiary">
                                  Email: <strong className="text-text-primary font-semibold">{u.email || '-'}</strong>
                                  {u.email && (
                                    <button type="button" onClick={() => handleCopy(u.email, 'Email')} className="p-0.5 text-text-tertiary hover:text-text-primary bg-transparent border-none cursor-pointer flex" title="Copy Email">
                                      <Copy size={10} />
                                    </button>
                                  )}
                                </span>
                                <span className="text-text-tertiary shrink-0">|</span>
                                <span className="flex items-center gap-0.5 shrink-0 bg-yellow-100/80 px-1 rounded text-yellow-900 border border-yellow-200/50">
                                  Phone: <strong className="font-semibold">+{u.country_code || '91'} {u.phone_number || '-'}</strong>
                                  {u.phone_number && (
                                    <button type="button" onClick={() => handleCopy(u.phone_number, 'Phone')} className="p-0.5 text-yellow-900/60 hover:text-yellow-900 bg-transparent border-none cursor-pointer flex" title="Copy Phone">
                                      <Copy size={10} />
                                    </button>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <div className="flex flex-col gap-0.5 items-end">
                              {u.is_verified_email ? (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck size={9} /> Email Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <ShieldAlert size={9} /> Email Unverified
                                </span>
                              )}
                              {u.is_verified_phone_number ? (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <ShieldCheck size={9} /> Phone Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                  <ShieldAlert size={9} /> Phone Unverified
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleNavigateToMatch(u)}
                              className="btn btn-secondary py-1 px-2 text-[10px] text-accent hover:bg-accent/5 border-border shrink-0 font-semibold h-7"
                              title="Switch to editing this user"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2.5 p-3 border border-border rounded-lg bg-bg-secondary/20 cursor-pointer hover:bg-bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    name="is_verified_email"
                    checked={editingUser.is_verified_email}
                    onChange={handleEditChange}
                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-primary">Email Verified</span>
                    <span className="text-[10px] text-text-tertiary">Verify user email status</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 border border-border rounded-lg bg-bg-secondary/20 cursor-pointer hover:bg-bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    name="is_verified_phone_number"
                    checked={editingUser.is_verified_phone_number}
                    onChange={handleEditChange}
                    className="w-4 h-4 text-accent border-border rounded focus:ring-accent cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-primary">Phone Verified</span>
                    <span className="text-[10px] text-text-tertiary">Verify user phone status</span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn btn-secondary text-xs"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs flex items-center gap-1.5 min-w-[100px]"
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 size={12} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
