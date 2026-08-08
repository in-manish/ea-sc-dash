import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { 
  Search, Loader2, Mail, Phone, MapPin, Building, 
  ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight,
  User, Info, Edit2, AlertCircle
} from 'lucide-react';
import ManageUsersSearchActions from '../../features/ScManageUsers/ui/ManageUsersSearchActions';
import EditUserModal from '../../features/ScManageUsers/ui/EditUserModal';

const ManageUsers = () => {
  const { token } = useAuth();
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    search: '',
    name: '',
    email: '',
    phone_number: '',
    is_verified_email: '',
    is_verified_phone_number: ''
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
  const [editUser, setEditUser] = useState(null);

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

  const handleEditClick = (user) => setEditUser(user);

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
            <ManageUsersSearchActions
              showAdvancedFilters={showAdvancedFilters}
              onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              onReset={handleClear}
              onRefresh={fetchUsers}
              isLoading={isLoading}
              showReset={Object.values(filters).some((v) => v !== '')}
            />
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

      <EditUserModal
        user={editUser}
        isOpen={Boolean(editUser)}
        token={token}
        onClose={() => setEditUser(null)}
        onSaved={(result) => {
          setResults((prev) =>
            prev ? prev.map((u) => (u.id === result.id ? { ...u, ...result } : u)) : prev
          );
        }}
      />
    </div>
  );
};

export default ManageUsers;
