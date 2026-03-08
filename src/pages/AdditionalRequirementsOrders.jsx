import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Calendar, CheckCircle, XCircle, DollarSign, X, ChevronDown, Search, Copy, Check, Building2, User, Package, FileText, CreditCard, ShieldCheck, ShieldX } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: 'cart', label: 'Cart' },
    { value: 'pending', label: 'Pending' },
    { value: 'pay_later', label: 'Pay Later' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
];

const getStatusClass = (status) => {
    switch (status) {
        case 'paid': return 'bg-[#dcfce7] text-[#166534]';
        case 'pending': return 'bg-[#fef9c3] text-[#854d0e]';
        case 'cart': return 'bg-[#f3f4f6] text-[#374151]';
        case 'failed': return 'bg-[#fee2e2] text-[#991b1b]';
        case 'cancelled': return 'bg-[#f3f4f6] text-[#374151] line-through';
        default: return 'bg-slate-100 text-slate-700';
    }
};

const CopyableId = ({ value, label }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(String(value));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            title={`Copy ${label || value}`}
            className="inline-flex items-center gap-1 font-mono text-sm hover:text-accent transition-colors group/copy"
        >
            {value}
            {copied
                ? <Check size={12} className="text-green-600" />
                : <Copy size={12} className="opacity-0 group-hover/copy:opacity-60 transition-opacity" />
            }
        </button>
    );
};

const AdditionalRequirementsOrders = ({ eventId }) => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState(null);
    const [isStatsExpanded, setIsStatsExpanded] = useState(false);

    // Get filters from URL
    const page = parseInt(searchParams.get('page')) || 1;

    // Parse status: handle both ?status=a,b and ?status=a&status=b
    const statusParamRaw = searchParams.getAll('status');
    const statusParam = statusParamRaw.reduce((acc, val) => {
        return acc.concat(val.split(','));
    }, []);
    const isVerified = searchParams.get('is_verified') || '';
    const paymentMode = searchParams.get('payment_mode') || '';
    const dateFrom = searchParams.get('date_from') || '';
    const dateTo = searchParams.get('date_to') || '';
    const orderId = searchParams.get('order_id') || '';
    const companyName = searchParams.get('company_name') || '';
    const companyId = searchParams.get('company_id') || '';
    const companyIds = searchParams.get('company_ids') || '';
    const excludeCompanyIds = searchParams.get('exclude_company_ids') || '';
    const userId = searchParams.get('user_id') || '';

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);

        // Handle page reset on filter change
        params.set('page', '1');

        Object.keys(newFilters).forEach(key => {
            const value = newFilters[key];
            if (value === null || value === '') {
                params.delete(key);
            } else if (Array.isArray(value)) {
                if (key === 'status') {
                    // Join array values with comma for status
                    params.set(key, value.join(','));
                } else {
                    params.delete(key);
                    value.forEach(v => params.append(key, v));
                }
            } else {
                params.set(key, value);
            }
        });

        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
    };

    const removeFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);

        if (key === 'status') {
            // Handle comma-separated values for status
            const currentVal = params.get(key);
            if (currentVal) {
                const values = currentVal.split(',').filter(v => v !== value);
                if (values.length > 0) {
                    params.set(key, values.join(','));
                } else {
                    params.delete(key);
                }
            }
        } else {
            if (value) {
                // Remove specific value from array param (standard behavior)
                const values = params.getAll(key).filter(v => v !== value);
                params.delete(key);
                values.forEach(v => params.append(key, v));
            } else {
                params.delete(key);
            }
        }

        params.set('page', '1');
        setSearchParams(params);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                // Token from context
                const filters = {
                    status: statusParam,
                    is_verified: isVerified,
                    payment_mode: paymentMode,
                    date_from: dateFrom,
                    date_to: dateTo,
                    order_id: orderId,
                    company_name: companyName,
                    company_id: companyId,
                    company_ids: companyIds,
                    exclude_company_ids: excludeCompanyIds,
                    user_id: userId,
                };

                const data = await eventService.getAdditionalRequirementsOrders(eventId, token, page, 10, filters, true);
                setOrders(data.orders);
                setTotal(data.count);
                if (data.stats) {
                    setStats(data.stats);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (eventId && token) {
            fetchOrders();
        }
    }, [eventId, page, searchParams.toString(), token]); // Depend on searchParams string to catch all URL changes

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency || 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    // --- Report Sending Logic ---
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [reportEmails, setReportEmails] = useState([]);
    const [emailInput, setEmailInput] = useState('');
    const [sendingReport, setSendingReport] = useState(false);
    const [reportTimer, setReportTimer] = useState(0);
    const [reportStatuses, setReportStatuses] = useState(['paid', 'pay_later']);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [expandedPayments, setExpandedPayments] = useState(null);

    // Load saved emails on mount
    useEffect(() => {
        const savedEmails = localStorage.getItem('ar_report_emails');
        if (savedEmails) {
            try {
                setReportEmails(JSON.parse(savedEmails));
            } catch (e) {
                console.error("Failed to parse saved emails", e);
            }
        }
    }, []);

    const handleAddEmail = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            const email = emailInput.trim();
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (!reportEmails.includes(email)) {
                    setReportEmails([...reportEmails, email]);
                }
                setEmailInput('');
            }
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setReportEmails(reportEmails.filter(email => email !== emailToRemove));
    };

    const handleToggleReportStatus = (value) => {
        setReportStatuses(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    const handleStartSendReport = () => {
        if (statusParam.length > 0) {
            setReportStatuses(statusParam);
        }
        setShowEmailModal(true);
    };

    const handleConfirmSendReport = () => {
        // Save emails to persistence
        localStorage.setItem('ar_report_emails', JSON.stringify(reportEmails));

        setShowEmailModal(false);
        setSendingReport(true);
        setReportTimer(15);
    };

    const handleCancelTimer = () => {
        setSendingReport(false);
        setReportTimer(0);
    };

    // Timer Effect
    useEffect(() => {
        let interval;
        if (sendingReport && reportTimer > 0) {
            interval = setInterval(() => {
                setReportTimer((prev) => prev - 1);
            }, 1000);
        } else if (sendingReport && reportTimer === 0) {
            // Timer finished, trigger send
            setSendingReport(false);
            performSendReport();
        }
        return () => clearInterval(interval);
    }, [sendingReport, reportTimer]);

    const performSendReport = async () => {
        setLoading(true);
        try {
            await eventService.sendAROrdersReport(eventId, token, reportEmails, reportStatuses);
            setShowSuccessModal(true);
        } catch (err) {
            console.error(err);
            setError("Failed to send report.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        if (!value) return;

        const currentStatuses = statusParam;
        if (!currentStatuses.includes(value)) {
            updateFilters({ status: [...currentStatuses, value] });
        }
    };

    const parseBillingDetails = (raw) => {
        if (!raw) return null;
        try {
            const results = [];
            const regex = /\{[^{}]*\}/g;
            let match;
            while ((match = regex.exec(raw)) !== null) {
                try {
                    const parsed = JSON.parse(match[0]);
                    if (typeof parsed === 'object' && parsed !== null) {
                        results.push(parsed);
                    }
                } catch {}
            }
            return results.length > 0 ? results : null;
        } catch {
            return null;
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-IN', {
            dateStyle: 'medium', timeStyle: 'short'
        });
    };

    const DetailRow = ({ label, value, mono }) => (
        <div className="flex justify-between items-start gap-4 py-2 border-b border-border/30 last:border-b-0">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">{label}</span>
            <span className={`text-sm text-text-primary text-right ${mono ? 'font-mono' : ''}`}>{value || '-'}</span>
        </div>
    );

    return (
        <div className="py-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">Additional Requirements Orders</h1>
                    {stats && (
                        <button
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-bold uppercase tracking-wider transition-colors"
                            onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                        >
                            {isStatsExpanded ? 'Hide Stats' : 'View Stats'}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStatsExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                </div>
                <button className="btn btn-primary" onClick={handleStartSendReport}>
                    Send Report
                </button>
            </div>

            {/* Stats Section */}
            {stats && isStatsExpanded && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2 animate-fade-in">
                    {Object.entries(stats).map(([key, value]) => {
                        // Skip rendering empty objects or nulls
                        if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return null;

                        return (
                            <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-5 min-w-[240px] flex-shrink-0 flex flex-col">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{key.replace(/_/g, ' ')}</span>
                                {typeof value === 'object' && value !== null ? (
                                    <div className="flex flex-col gap-1">
                                        {Object.entries(value).map(([subKey, subVal]) => {
                                            const filterValue = subKey.replace('_count', '');
                                            let isActive = false;

                                            if (key === 'payment_mode') isActive = paymentMode === filterValue;
                                            else if (key === 'status') isActive = statusParam.includes(filterValue);
                                            else if (key === 'is_verified') isActive = isVerified === filterValue.toString();

                                            return (
                                                <div
                                                    key={subKey}
                                                    className={`flex justify-between items-center text-[13px] p-1.5 -mx-1.5 rounded-md cursor-pointer transition-colors ${isActive ? 'bg-blue-50/80 text-accent' : 'hover:bg-slate-50'}`}
                                                    onClick={() => {
                                                        if (key === 'payment_mode') {
                                                            if (isActive) removeFilter('payment_mode', filterValue);
                                                            else updateFilters({ payment_mode: filterValue });
                                                        } else if (key === 'status') {
                                                            if (isActive) removeFilter('status', filterValue);
                                                            else updateFilters({ status: [...statusParam, filterValue] });
                                                        } else if (key === 'is_verified') {
                                                            if (isActive) removeFilter('is_verified', filterValue.toString());
                                                            else updateFilters({ is_verified: filterValue.toString() });
                                                        }
                                                    }}
                                                    title={`Click to filter by ${filterValue}`}
                                                >
                                                    <span className={`capitalize ${isActive ? 'text-accent font-semibold' : 'text-slate-500'}`}>{subKey.replace(/_/g, ' ')}</span>
                                                    <span className={`font-bold ${isActive ? 'text-accent' : 'text-slate-800'}`}>{subVal}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span className="text-2xl font-black text-slate-800 mt-auto">
                                        {typeof value === 'number' && key.includes('amount') ? formatCurrency(value) : value}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6 bg-bg-primary p-4 rounded-lg border border-border shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</label>
                        <div className="select-wrapper">
                            <select
                                className="p-2 border border-border rounded-md text-sm min-w-[150px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                value=""
                                onChange={handleStatusChange}
                            >
                                <option value="">Select Status...</option>
                                {STATUS_OPTIONS.map(opt => (
                                    <option
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={statusParam.includes(opt.value)}
                                    >
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Verified</label>
                        <select
                            className="p-2 border border-border rounded-md text-sm min-w-[150px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                            value={isVerified}
                            onChange={(e) => updateFilters({ is_verified: e.target.value })}
                        >
                            <option value="">All</option>
                            <option value="true">Verified</option>
                            <option value="false">Not Verified</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Payment Mode</label>
                        <select
                            className="p-2 border border-border rounded-md text-sm min-w-[150px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                            value={paymentMode}
                            onChange={(e) => updateFilters({ payment_mode: e.target.value })}
                        >
                            <option value="">All</option>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">From Date</label>
                        <input
                            type="date"
                            className="p-2 border border-border rounded-md text-sm min-w-[150px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                            value={dateFrom}
                            onChange={(e) => updateFilters({ date_from: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">To Date</label>
                        <input
                            type="date"
                            className="p-2 border border-border rounded-md text-sm min-w-[150px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                            value={dateTo}
                            onChange={(e) => updateFilters({ date_to: e.target.value })}
                        />
                    </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Order ID</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                <input
                                    key={`oid-${orderId}`}
                                    type="text"
                                    defaultValue={orderId}
                                    placeholder="Search order..."
                                    className="pl-8 pr-2 py-2 border border-border rounded-md text-sm min-w-[150px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                    onKeyDown={(e) => { if (e.key === 'Enter') updateFilters({ order_id: e.target.value.trim() || null }); }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Company Name</label>
                            <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                <input
                                    key={`cname-${companyName}`}
                                    type="text"
                                    defaultValue={companyName}
                                    placeholder="Search company..."
                                    className="pl-8 pr-2 py-2 border border-border rounded-md text-sm min-w-[170px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                    onKeyDown={(e) => { if (e.key === 'Enter') updateFilters({ company_name: e.target.value.trim() || null }); }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Company ID</label>
                            <input
                                key={`cid-${companyId}`}
                                type="text"
                                defaultValue={companyId}
                                placeholder="e.g. 123"
                                className="p-2 border border-border rounded-md text-sm min-w-[120px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                onKeyDown={(e) => { if (e.key === 'Enter') updateFilters({ company_id: e.target.value.trim() || null }); }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">User ID</label>
                            <input
                                key={`uid-${userId}`}
                                type="text"
                                defaultValue={userId}
                                placeholder="e.g. 456"
                                className="p-2 border border-border rounded-md text-sm min-w-[120px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                onKeyDown={(e) => { if (e.key === 'Enter') updateFilters({ user_id: e.target.value.trim() || null }); }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Company IDs</label>
                            <input
                                key={`cids-${companyIds}`}
                                type="text"
                                defaultValue={companyIds}
                                placeholder="1,2,3..."
                                className="p-2 border border-border rounded-md text-sm min-w-[130px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                onKeyDown={(e) => { if (e.key === 'Enter') updateFilters({ company_ids: e.target.value.trim() || null }); }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Exclude Company IDs</label>
                            <input
                                key={`ecids-${excludeCompanyIds}`}
                                type="text"
                                defaultValue={excludeCompanyIds}
                                placeholder="4,5,6..."
                                className="p-2 border border-border rounded-md text-sm min-w-[130px] bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                onKeyDown={(e) => { if (e.key === 'Enter') updateFilters({ exclude_company_ids: e.target.value.trim() || null }); }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {(statusParam.length > 0 || isVerified || paymentMode || dateFrom || dateTo || orderId || companyName || companyId || companyIds || excludeCompanyIds || userId) && (
                <div className="flex flex-wrap gap-2 min-h-[40px] mb-6">
                    {statusParam.map(s => (
                        <span key={s} className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Status: {STATUS_OPTIONS.find(o => o.value === s)?.label || s}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('status', s)}><X size={12} /></button>
                        </span>
                    ))}
                    {isVerified && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Verified: {isVerified === 'true' ? 'Yes' : 'No'}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('is_verified')}><X size={12} /></button>
                        </span>
                    )}
                    {paymentMode && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Payment: {paymentMode}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('payment_mode')}><X size={12} /></button>
                        </span>
                    )}
                    {dateFrom && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            From: {dateFrom}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('date_from')}><X size={12} /></button>
                        </span>
                    )}
                    {dateTo && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            To: {dateTo}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('date_to')}><X size={12} /></button>
                        </span>
                    )}
                    {orderId && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Order: {orderId}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('order_id')}><X size={12} /></button>
                        </span>
                    )}
                    {companyName && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Company: {companyName}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('company_name')}><X size={12} /></button>
                        </span>
                    )}
                    {companyId && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Company ID: {companyId}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('company_id')}><X size={12} /></button>
                        </span>
                    )}
                    {companyIds && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Company IDs: {companyIds}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('company_ids')}><X size={12} /></button>
                        </span>
                    )}
                    {excludeCompanyIds && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            Excl. Companies: {excludeCompanyIds}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('exclude_company_ids')}><X size={12} /></button>
                        </span>
                    )}
                    {userId && (
                        <span className="flex items-center gap-2 px-3 py-1 bg-bg-secondary rounded-full text-[0.8125rem] font-medium text-text-primary border border-border">
                            User: {userId}
                            <button className="flex items-center justify-center text-text-muted hover:bg-black/10 hover:text-text-primary rounded-full p-0.5 transition-colors" onClick={() => removeFilter('user_id')}><X size={12} /></button>
                        </span>
                    )}
                    <button className="text-sm text-text-muted hover:text-text-primary transition-colors hover:underline px-2 py-1" onClick={() => setSearchParams({})}>Clear All</button>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fade-in p-4 sm:p-6 backdrop-blur-sm">
                    <div className="bg-bg-primary p-6 sm:p-8 rounded-xl w-full max-w-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] ring-1 ring-border/50 animate-[modalPop_0.3s_ease-out]">
                        <h3 className="text-xl font-semibold mb-2 text-text-primary">Send Report via Email</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Add email addresses to receive the report. The list will be saved for future use.
                        </p>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="email"
                                className="flex-1 p-2 border border-border rounded-lg text-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm"
                                placeholder="Enter email and press Enter"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleAddEmail}
                            />
                            <button className="btn btn-secondary btn-sm" onClick={handleAddEmail}>Add</button>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[40px] mb-4 p-3 bg-bg-tertiary rounded-lg border border-border/50">
                            {reportEmails.map(email => (
                                <span key={email} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary rounded-full text-[0.8125rem] font-medium text-text-secondary border border-border shadow-sm transition-all hover:border-slate-300">
                                    {email}
                                    <button className="flex items-center justify-center text-text-muted rounded-full p-0.5 hover:bg-black/10 hover:text-text-primary transition-colors" onClick={() => handleRemoveEmail(email)}><X size={12} /></button>
                                </span>
                            ))}
                            {reportEmails.length === 0 && <span className="text-gray-400 text-sm italic">No emails added</span>}
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Filter by Status</label>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map(opt => {
                                    const isSelected = reportStatuses.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`px-3 py-1.5 rounded-full text-[0.8125rem] font-medium border transition-all ${
                                                isSelected
                                                    ? 'bg-accent text-white border-accent shadow-sm'
                                                    : 'bg-bg-primary text-text-secondary border-border hover:border-slate-300'
                                            }`}
                                            onClick={() => handleToggleReportStatus(opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {reportStatuses.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1.5">Select at least one status</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmSendReport}
                                disabled={reportEmails.length === 0 || reportStatuses.length === 0}
                            >
                                Send Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timer Notification Toast */}
            {sendingReport && (
                <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-bg-primary text-text-primary p-4 sm:px-6 sm:py-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-border z-60 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin text-accent" size={20} />
                        <span>Sending report in <strong>{reportTimer}s</strong>...</span>
                    </div>
                    <button className="btn btn-warning btn-sm" onClick={handleCancelTimer}>
                        Undo / Cancel
                    </button>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4" onClick={() => setShowSuccessModal(false)}>
                    <div
                        className="bg-bg-primary rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-border/50 w-full max-w-sm p-8 text-center animate-[modalPop_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                            <CheckCircle className="text-green-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">Report Sent!</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            The report has been sent to
                        </p>
                        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                            {reportEmails.map(email => (
                                <span key={email} className="inline-block px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                    {email}
                                </span>
                            ))}
                        </div>
                        <button
                            className="btn btn-primary w-full"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (() => {
                const o = selectedOrder;
                const billing = parseBillingDetails(o.billing_details_json);
                return (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start z-50 animate-fade-in p-4 sm:p-8 overflow-y-auto" onClick={() => setSelectedOrder(null)}>
                        <div
                            className="bg-bg-primary rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-border/50 w-full max-w-4xl my-auto animate-[modalPop_0.3s_ease-out]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <CopyableId value={o.id} label="Order ID" />
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusClass(o.status)}`}>
                                                {o.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="text-xs text-text-muted mt-1">
                                            Created {formatDateTime(o.created_at)} &middot; Updated {formatDateTime(o.updated_at)}
                                        </div>
                                    </div>
                                </div>
                                <button className="p-1.5 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-text-primary transition-colors" onClick={() => setSelectedOrder(null)}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Company & User */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-bg-secondary rounded-xl p-4 border border-border/50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Building2 size={14} className="text-accent" />
                                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Company</span>
                                        </div>
                                        {o.company ? (
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    {o.company.company_logo && <img src={o.company.company_logo} alt="" className="w-8 h-8 rounded-md object-cover border border-border" />}
                                                    <div>
                                                        <div className="font-semibold text-sm text-text-primary">{o.company.company_name}</div>
                                                        <CopyableId value={o.company.id} label="Company ID" />
                                                    </div>
                                                </div>
                                                <div className="mt-2 space-y-1 text-xs text-text-secondary">
                                                    {o.company.country && <div>{o.company.country_flag} {o.company.country}{o.company.location && o.company.location !== o.company.country ? ` \u2022 ${o.company.location}` : ''}</div>}
                                                    {o.company.category && <div>Category: <span className="font-semibold">{o.company.category}</span></div>}
                                                    {o.company.stall_number && <div>Stall: <span className="font-semibold">{o.company.stall_number}</span></div>}
                                                </div>
                                            </div>
                                        ) : <span className="text-sm text-text-muted">N/A</span>}
                                    </div>
                                    <div className="bg-bg-secondary rounded-xl p-4 border border-border/50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <User size={14} className="text-accent" />
                                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">User</span>
                                        </div>
                                        {o.user ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {o.user.display_pic && <img src={o.user.display_pic} alt="" className="w-8 h-8 rounded-full object-cover border border-border" />}
                                                    <div className="font-semibold text-sm text-text-primary">{o.user.name}</div>
                                                </div>
                                                <CopyableId value={o.user.id} label="User ID" />
                                            </div>
                                        ) : <span className="text-sm text-text-muted">N/A</span>}
                                    </div>
                                </div>

                                {/* Products */}
                                {o.products && o.products.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Package size={14} className="text-accent" />
                                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Products</span>
                                        </div>
                                        <div className="border border-border/50 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="bg-bg-secondary">
                                                        <th className="text-left py-2.5 px-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Item</th>
                                                        <th className="text-center py-2.5 px-3 text-[11px] font-bold text-text-muted uppercase tracking-wider">Qty</th>
                                                        <th className="text-right py-2.5 px-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">INR</th>
                                                        <th className="text-right py-2.5 px-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">USD</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {o.products.map(p => (
                                                        <tr key={p.id} className="border-t border-border/30">
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-2.5">
                                                                    {p.image && <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-border bg-bg-tertiary flex-shrink-0" />}
                                                                    <span className="text-text-primary font-medium">{p.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-3 text-center font-semibold text-text-secondary">{p.quantity}</td>
                                                            <td className="py-3 px-4 text-right font-mono text-text-primary">{formatCurrency(p.prices?.inr * p.quantity, 'INR')}</td>
                                                            <td className="py-3 px-4 text-right font-mono text-text-secondary">{p.prices?.usd ? formatCurrency(p.prices.usd * p.quantity, 'USD') : '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Pricing */}
                                {o.total_amount && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-bg-secondary rounded-xl p-4 border border-border/50">
                                            <div className="flex items-center gap-2 mb-3">
                                                <DollarSign size={14} className="text-accent" />
                                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Amount (INR)</span>
                                            </div>
                                            <DetailRow label="Subtotal" value={`\u20B9${o.total_amount.subtotal}`} mono />
                                            <DetailRow label={`GST (${o.total_amount.gst_rate}%)`} value={`\u20B9${o.total_amount.gst_amount}`} mono />
                                            <div className="flex justify-between items-center pt-2 mt-1 border-t border-border">
                                                <span className="text-xs font-bold text-text-primary uppercase">Total</span>
                                                <span className="text-base font-bold text-text-primary font-mono">{o.total_amount.formatted}</span>
                                            </div>
                                        </div>
                                        {o.total_amount_usd && (
                                            <div className="bg-bg-secondary rounded-xl p-4 border border-border/50">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <DollarSign size={14} className="text-accent" />
                                                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Amount (USD)</span>
                                                </div>
                                                <DetailRow label="Subtotal" value={`$${o.total_amount_usd.subtotal}`} mono />
                                                <DetailRow label={`GST (${o.total_amount_usd.gst_rate}%)`} value={`$${o.total_amount_usd.gst_amount}`} mono />
                                                <div className="flex justify-between items-center pt-2 mt-1 border-t border-border">
                                                    <span className="text-xs font-bold text-text-primary uppercase">Total</span>
                                                    <span className="text-base font-bold text-text-primary font-mono">{o.total_amount_usd.formatted}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Payment & Billing */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-bg-secondary rounded-xl p-4 border border-border/50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CreditCard size={14} className="text-accent" />
                                            <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Payment</span>
                                        </div>
                                        <DetailRow label="Mode" value={<span className="uppercase font-semibold">{o.payment_mode}</span>} />
                                        <DetailRow label="Verified" value={
                                            o.is_verified
                                                ? <span className="inline-flex items-center gap-1 text-green-600"><ShieldCheck size={13} /> Yes</span>
                                                : <span className="inline-flex items-center gap-1 text-amber-600"><ShieldX size={13} /> No</span>
                                        } />
                                        {o.offline_payment_reference && <DetailRow label="Reference" value={o.offline_payment_reference} mono />}
                                        {o.payment?.online?.length > 0 && (
                                            <div className="mt-2">
                                                <button
                                                    className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent/80 transition-colors w-full"
                                                    onClick={() => setExpandedPayments(prev => prev === o.id ? null : o.id)}
                                                >
                                                    <ChevronDown size={13} className={`transition-transform duration-200 ${expandedPayments === o.id ? 'rotate-0' : '-rotate-90'}`} />
                                                    {o.payment.online.length} Online Transaction{o.payment.online.length > 1 ? 's' : ''}
                                                </button>
                                                {expandedPayments === o.id && (
                                                    <div className="mt-2 space-y-2 animate-fade-in">
                                                        {o.payment.online.map(txn => (
                                                            <div key={txn.id} className="bg-bg-primary rounded-lg p-3 border border-border/50 text-xs space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${txn.status === 'success' ? 'bg-green-100 text-green-700' : txn.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                        {txn.status}
                                                                    </span>
                                                                    <span className="font-bold font-mono text-sm text-text-primary">{txn.currency === 'INR' ? '\u20B9' : '$'}{txn.amount}</span>
                                                                </div>
                                                                <DetailRow label="Gateway" value={<span className="capitalize">{txn.payment_gateway}</span>} />
                                                                <DetailRow label="Transaction ID" value={txn.transaction_id} mono />
                                                                <DetailRow label="Payment ID" value={txn.payment_id} mono />
                                                                <DetailRow label="Type" value={<span className="capitalize">{txn.payment_type?.replace('_', ' ')}</span>} />
                                                                <DetailRow label="Date" value={formatDateTime(txn.created_at)} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {billing && billing.length > 0 && (
                                        <div className="bg-bg-secondary rounded-xl p-4 border border-border/50">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText size={14} className="text-accent" />
                                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Billing Details</span>
                                            </div>
                                            {billing.map((entry, idx) => (
                                                <div key={idx} className={idx > 0 ? 'mt-3 pt-3 border-t border-border/30' : ''}>
                                                    {entry.organization && <DetailRow label="Organization" value={entry.organization} />}
                                                    {entry.gst_no && <DetailRow label="GST No" value={entry.gst_no} mono />}
                                                    {entry.address && <DetailRow label="Address" value={entry.address} />}
                                                    {entry.date && <DetailRow label="Date" value={entry.date} />}
                                                    {entry.contact_person && <DetailRow label="Contact" value={entry.contact_person} />}
                                                    {entry.contact_person_phone && <DetailRow label="Phone" value={entry.contact_person_phone} mono />}
                                                    {entry.contact_person_email && <DetailRow label="Email" value={entry.contact_person_email} />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {error && <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">{error}</div>}

            <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Order ID</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Company</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Products</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Amount</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Payment</th>
                            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-12 text-text-secondary">
                                    <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-12 text-text-secondary">No orders found matching criteria.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="transition-colors duration-200 hover:bg-bg-secondary [&>td]:border-b [&>td]:border-border group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <CopyableId value={order.id} label="Order ID" />
                                        <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="font-semibold">
                                            {order.company ? (
                                                <Link
                                                    to={`/event/${eventId}/companies/${order.company.id}`}
                                                    className="hover:underline text-primary"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    {order.company.company_name}
                                                </Link>
                                            ) : 'N/A'}
                                        </div>
                                        {order.company && (
                                            <CopyableId value={order.company.id} label="Company ID" />
                                        )}
                                        <div className="text-xs text-gray-500">{order.user?.name}</div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="flex flex-col gap-2">
                                            {order.products.map(product => (
                                                <div key={product.id} className="flex items-center gap-2 text-[0.8125rem] text-text-secondary">
                                                    {product.image && <img src={product.image} alt="" className="w-8 h-8 rounded-md object-cover bg-bg-tertiary border border-border group-hover:border-slate-300 transition-colors" />}
                                                    <span>{product.name} (x{product.quantity})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="font-medium">
                                            {order.total_amount?.formatted}
                                        </div>
                                        {order.total_amount_usd && (
                                            <div className="text-xs text-gray-500">
                                                {order.total_amount_usd.formatted}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs uppercase font-semibold">{order.payment_mode}</span>
                                            {order.is_verified ? (
                                                <span className="flex items-center gap-1 text-xs text-green-600">
                                                    <CheckCircle size={12} /> Verified
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs text-amber-600">
                                                    <XCircle size={12} /> Unverified
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 align-middle group-last:border-b-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-6 bg-bg-primary p-4 border border-border rounded-lg shadow-sm">
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1 || loading}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <span className="text-sm font-medium text-text-secondary">Page {page} of {Math.ceil(total / 10)}</span>
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={orders.length < 10 || loading}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdditionalRequirementsOrders;
