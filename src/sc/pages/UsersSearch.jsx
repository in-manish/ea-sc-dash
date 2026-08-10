import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { Search, Loader2, Mail, Phone, MapPin, Building, ShieldCheck, X } from 'lucide-react';

const UsersSearch = () => {
    const { token } = useAuth();
    const [searchForm, setSearchForm] = useState({
        phone: '',
        email: '',
        id: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        // Ensure at least one search field is populated
        if (!searchForm.phone && !searchForm.email && !searchForm.id) {
            setError('Please enter at least one search criteria (Phone, Email, or ID).');
            return;
        }

        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            const data = await userService.searchUsers(searchForm, token);
            
            // Normalize result to array since search API response could be a single user object or a list
            if (data) {
                if (Array.isArray(data)) {
                    setResults(data);
                } else if (data.id) {
                    setResults([data]);
                } else {
                    setResults([]);
                }
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error('User Search Error:', err);
            setError(err.message || 'Failed to execute search. Make sure your credentials are valid.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSearchForm({ phone: '', email: '', id: '' });
        setResults(null);
        setError('');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-fade-in">
            <div className="mb-8 pb-4 border-b border-border">
                <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-0.5 rounded-full mb-2 inline-block">Snapcard Dashboard</span>
                <h1 className="text-2xl font-bold text-text-primary mb-1">Users Search</h1>
                <p className="text-sm text-text-secondary">Search Snapcard users globally using ID, phone number, email, or a combination of them</p>
            </div>

            {/* Search Criteria Card */}
            <div className="bg-bg-primary rounded-lg border border-border p-6 shadow-sm mb-8">
                <form onSubmit={handleSearch} className="flex flex-col gap-6">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                        <div className="input-group">
                            <label className="input-label" htmlFor="search-id">User ID</label>
                            <input
                                id="search-id"
                                type="text"
                                name="id"
                                value={searchForm.id}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="e.g. 49117"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="search-email">Email Address</label>
                            <input
                                id="search-email"
                                type="email"
                                name="email"
                                value={searchForm.email}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="name@company.com"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="search-phone">Phone Number</label>
                            <input
                                id="search-phone"
                                type="tel"
                                name="phone"
                                value={searchForm.phone}
                                onChange={handleInputChange}
                                className="input-field"
                                placeholder="e.g. 9876543210"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-danger p-3 rounded-md text-xs border border-red-100 animate-fade-in">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn btn-secondary flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <X size={16} />
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            Search Users
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Table */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                    <Loader2 size={36} className="animate-spin text-accent mb-4" />
                    <span>Searching database...</span>
                </div>
            )}

            {!isLoading && results !== null && (
                <div className="bg-bg-primary rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-border bg-bg-secondary/20 flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-text-primary">Search Results</h2>
                        <span className="text-xs bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">{results.length} found</span>
                    </div>

                    {results.length === 0 ? (
                        <div className="p-12 text-center text-text-tertiary">
                            <Search size={48} className="mx-auto mb-4 text-border-hover" />
                            <h3>No Users Found</h3>
                            <p>No Snapcard user matches the provided search query.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-bg-secondary/40 text-text-tertiary text-xs font-semibold uppercase tracking-wider border-b border-border">
                                        <th className="py-3.5 px-6">User / Info</th>
                                        <th className="py-3.5 px-6">Contact details</th>
                                        <th className="py-3.5 px-6">Company Info</th>
                                        <th className="py-3.5 px-6">Location</th>
                                        <th className="py-3.5 px-6">Verification / Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {results.map((user) => (
                                        <tr key={user.id} className="hover:bg-bg-secondary/20 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-text-primary text-sm flex items-center gap-1.5">
                                                            {user.name || 'No Name'}
                                                        </div>
                                                        <div className="text-[11px] text-text-tertiary mt-0.5">ID: #{user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 text-xs text-text-secondary">
                                                    {user.email && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Mail size={12} className="text-text-tertiary" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                    )}
                                                    {user.phone_number && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone size={12} className="text-text-tertiary" />
                                                            <span>{user.country_code ? `+${user.country_code} ` : ''}{user.phone_number}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1 text-xs text-text-secondary">
                                                    {user.company && (
                                                        <div className="flex items-center gap-1.5 font-medium text-text-primary">
                                                            <Building size={12} className="text-text-tertiary" />
                                                            <span>{user.company}</span>
                                                        </div>
                                                    )}
                                                    {user.designation && (
                                                        <span className="text-[11px] text-text-secondary ml-3.5">{user.designation}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-start gap-1.5 text-xs text-text-secondary">
                                                    <MapPin size={12} className="text-text-tertiary mt-0.5" />
                                                    <div className="flex flex-col">
                                                        <span>{user.city || user.state ? `${user.city || ''}, ${user.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') : ''}</span>
                                                        <span className="text-[11px] text-text-tertiary">{user.country || user.country_name || ''}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col gap-1.5 items-start">
                                                    <div className="flex gap-1.5">
                                                        {user.is_verified_email && (
                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                                                                <ShieldCheck size={10} /> Email Verified
                                                            </span>
                                                        )}
                                                        {user.is_verified_phone_number && (
                                                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                                                                <ShieldCheck size={10} /> Phone Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    {user.role && (
                                                        <span className="text-[10px] font-bold text-text-tertiary bg-bg-secondary border border-border px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                                            {user.role}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UsersSearch;
