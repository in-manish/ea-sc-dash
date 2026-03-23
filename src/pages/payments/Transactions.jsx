import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Loader2, Search, Filter, Download, RefreshCw, X, MoreVertical } from 'lucide-react';
import PaymentActionsModal from './PaymentActionsModal';

const STATUS_OPTIONS = ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded', 'partially_refunded'];
const GATEWAY_OPTIONS = ['razorpay', 'stripe'];

const Transactions = () => {
    const { token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total_count: 0, filtered_count: 0 });
    const [error, setError] = useState('');

    // Filters and Pagination
    const [filters, setFilters] = useState({
        status: '',
        gateway: '',
        order_id: '',
        date_from: '',
        date_to: ''
    });
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);
    const LIMIT = 50;

    // Actions Modal
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        if (token) fetchPayments();
    }, [token, page, filters.status, filters.gateway, filters.date_from, filters.date_to]);

    // Handle search input separate from filters to prevent fetching on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            if (filters.order_id !== searchInput) {
                setFilters(prev => ({ ...prev, order_id: searchInput }));
                setPage(1); // Reset page on new search
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const fetchPayments = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                limit: LIMIT,
                offset: (page - 1) * LIMIT,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
            };
            const data = await paymentService.getAdminPayments(token, params);
            setPayments(data.payments || []);
            setStats({
                total_count: data.total_count || 0,
                filtered_count: data.filtered_count || 0
            });
        } catch (err) {
            console.error("Fetch payments error:", err);
            setError('Failed to load payments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
            const blob = await paymentService.exportAdminPayments(token, params);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payments_export_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Export error:", err);
            alert('Failed to export payments.');
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', gateway: '', order_id: '', date_from: '', date_to: '' });
        setSearchInput('');
        setPage(1);
    };

    const openActionModal = (payment) => {
        setSelectedPayment(payment);
        setActionModalOpen(true);
    };

    const onActionSuccess = () => {
        setActionModalOpen(false);
        setSelectedPayment(null);
        fetchPayments();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'success': return 'bg-[#dcfce7] text-[#166534]';
            case 'pending':
            case 'processing': return 'bg-[#fef9c3] text-[#854d0e]';
            case 'failed': return 'bg-[#fee2e2] text-[#991b1b]';
            case 'cancelled': return 'bg-[#f3f4f6] text-[#374151] line-through';
            case 'refunded':
            case 'partially_refunded': return 'bg-purple-100 text-purple-800';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    };

    return (
        <div className="animate-fade-in pb-8">
            {/* Filters Bar */}
            <div className="bg-bg-primary p-4 rounded-lg border border-border flex flex-wrap gap-4 items-end mb-6 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Search Order ID</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="text"
                            className="w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-bg-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                            placeholder="Enter Order ID..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Status</label>
                    <select
                        className="py-2 px-3 border border-border rounded-md text-sm bg-bg-primary outline-none focus:border-accent"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Gateway</label>
                    <select
                        className="py-2 px-3 border border-border rounded-md text-sm bg-bg-primary outline-none focus:border-accent"
                        value={filters.gateway}
                        onChange={(e) => handleFilterChange('gateway', e.target.value)}
                    >
                        <option value="">All Gateways</option>
                        {GATEWAY_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">From Date</label>
                        <input
                            type="date"
                            className="py-2 px-3 border border-border rounded-md text-sm bg-bg-primary outline-none focus:border-accent"
                            value={filters.date_from}
                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">To Date</label>
                        <input
                            type="date"
                            className="py-2 px-3 border border-border rounded-md text-sm bg-bg-primary outline-none focus:border-accent"
                            value={filters.date_to}
                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-border text-text-secondary rounded-md hover:bg-bg-secondary" onClick={fetchPayments} title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    {(Object.values(filters).some(v => v !== '') || searchInput !== '') && (
                        <button className="flex items-center gap-1.5 px-3 py-2 border border-border text-text-secondary rounded-md hover:bg-bg-secondary text-sm font-medium" onClick={clearFilters}>
                            <X size={16} /> Clear
                        </button>
                    )}
                    <button className="flex items-center gap-1.5 px-3 py-2 bg-bg-secondary border border-border text-text-primary rounded-md hover:bg-bg-tertiary text-sm font-medium" onClick={handleExportCSV}>
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">{error}</div>
            )}

            {/* Results Table */}
            <div className="bg-bg-primary border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary">
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-text-secondary border-b border-border">ID / Date</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-text-secondary border-b border-border">User Info</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-text-secondary border-b border-border">Order details</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-text-secondary border-b border-border">Amount</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-text-secondary border-b border-border">Status</th>
                                <th className="py-3 px-4 text-xs font-semibold uppercase text-text-secondary border-b border-border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-text-secondary">
                                        <Loader2 className="animate-spin text-accent mx-auto mb-2" size={24} />
                                        Loading payments...
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-text-secondary">
                                        No payments found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                payments.map(payment => (
                                    <tr key={payment.id} className="border-b border-border hover:bg-bg-secondary transition-colors group">
                                        <td className="py-3 px-4 align-middle">
                                            <div className="font-mono text-xs text-text-primary">#{payment.id}</div>
                                            <div className="text-[11px] text-text-tertiary mt-1">{new Date(payment.created_at).toLocaleString()}</div>
                                        </td>
                                        <td className="py-3 px-4 align-middle">
                                            {payment.user ? (
                                                <>
                                                    <div className="font-medium text-sm text-text-primary">{payment.user.name || 'User'}</div>
                                                    <div className="text-xs text-text-secondary">{payment.user.email}</div>
                                                </>
                                            ) : (
                                                <span className="text-xs text-text-tertiary italic">Unknown User</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 align-middle text-sm">
                                            <div className="font-medium text-text-primary">{payment.order_id || 'N/A'}</div>
                                            <div className="text-[11px] text-text-tertiary mt-1 flex items-center gap-1.5">
                                                <span className="capitalize">{payment.payment_gateway}</span>
                                                {payment.transaction_id && <span>| {payment.transaction_id.substring(0, 12)}...</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-middle">
                                            <div className="font-semibold text-text-primary">
                                                {formatCurrency(payment.amount, payment.currency)}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 align-middle">
                                            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md inline-flex ${getStatusClass(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 align-middle text-center">
                                            <button
                                                className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
                                                onClick={() => openActionModal(payment)}
                                                title="Manage Payment"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-border flex items-center justify-between text-sm bg-bg-secondary">
                    <span className="text-text-secondary">
                        Showing {payments.length} of {stats.filtered_count} records {stats.filtered_count !== stats.total_count && `(filtered from ${stats.total_count})`}
                    </span>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1 || loading}
                            onClick={() => setPage(p => p - 1)}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={payments.length < LIMIT || loading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {actionModalOpen && selectedPayment && (
                <PaymentActionsModal
                    payment={selectedPayment}
                    onClose={() => setActionModalOpen(false)}
                    onSuccess={onActionSuccess}
                />
            )}
        </div>
    );
};

export default Transactions;
