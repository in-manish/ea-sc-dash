import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../services/eventService';
import { Loader2, Calendar, CheckCircle, XCircle, DollarSign, X } from 'lucide-react';
import './AdditionalRequirementsOrders.css';

const STATUS_OPTIONS = [
    { value: 'cart', label: 'Cart' },
    { value: 'pending', label: 'Pending' },
    { value: 'pay_later', label: 'Pay Later' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
];

const AdditionalRequirementsOrders = ({ eventId }) => {
    const { token } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState(null);

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
    const companyIds = searchParams.getAll('company_ids');

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
                    company_ids: companyIds
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
    const [reportVerification, setReportVerification] = useState(null); // To store filtering info if needed

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

    const handleStartSendReport = () => {
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
            // Token from context
            // Use current filters or default logic if needed. 
            // The requirement says "status=paid,pay_later" in curl, but maybe we should respect current filters if they are set?
            // The prompt said: "status=paid%2Cpay_later" which implies a default.
            // Let's use the current status filter if it exists, otherwise default to paid,pay_later as per request sample.
            // However, the user request specifically showed that CURL. Let's stick to what's requested: "allow user to edit send_to_emails".
            // It didn't explicitly say to use current filter 'status' for the report, but usually reports reflect the view.
            // But looking at the curl: `status=paid%2Cpay_later` is hardcoded in the example. 
            // I'll stick to a default behavior but maybe allow it to be flexible if the user filters. 
            // For now, I will use the `statusParam` from the component state if it has values, 
            // otherwise I will default to `['paid', 'pay_later']` to match the example.

            const statusesToSend = statusParam.length > 0 ? statusParam : ['paid', 'pay_later'];

            await eventService.sendAROrdersReport(eventId, token, reportEmails, statusesToSend);

            // Show success (you might want a toast here, using alert for now or a custom UI element)
            // Since I don't see a Toast component imported, I'll set a temporary success message in 'error' state or similar?
            // Better: use a temporary success state.
            alert("Report sent successfully!");
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

    return (
        <div className="ar-orders-container animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Additional Requirements Orders</h1>
                <button className="btn btn-primary" onClick={handleStartSendReport}>
                    Send Report
                </button>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className="stats-grid mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</span>
                            {typeof value === 'object' && value !== null ? (
                                <div className="flex flex-col gap-1 mt-1">
                                    {Object.entries(value).map(([subKey, subVal]) => (
                                        <div key={subKey} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 capitalize">{subKey.replace(/_/g, ' ')}</span>
                                            <span className="font-bold text-slate-800">{subVal}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-2xl font-black text-slate-800">
                                    {typeof value === 'number' && key.includes('amount') ? formatCurrency(value) : value}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="ar-filter-bar">
                <div className="ar-filter-group">
                    <label>Status</label>
                    <div className="select-wrapper">
                        <select
                            className="ar-filter-select"
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

                <div className="ar-filter-group">
                    <label>Verified</label>
                    <select
                        className="ar-filter-select"
                        value={isVerified}
                        onChange={(e) => updateFilters({ is_verified: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                    </select>
                </div>

                <div className="ar-filter-group">
                    <label>Payment Mode</label>
                    <select
                        className="ar-filter-select"
                        value={paymentMode}
                        onChange={(e) => updateFilters({ payment_mode: e.target.value })}
                    >
                        <option value="">All</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                    </select>
                </div>

                <div className="ar-filter-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        className="ar-filter-date"
                        value={dateFrom}
                        onChange={(e) => updateFilters({ date_from: e.target.value })}
                    />
                </div>

                <div className="ar-filter-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        className="ar-filter-date"
                        value={dateTo}
                        onChange={(e) => updateFilters({ date_to: e.target.value })}
                    />
                </div>
            </div>

            {/* Active Filters */}
            {(statusParam.length > 0 || isVerified || paymentMode || dateFrom || dateTo || companyIds.length > 0) && (
                <div className="ar-active-filters">
                    {statusParam.map(s => (
                        <span key={s} className="filter-chip">
                            Status: {STATUS_OPTIONS.find(o => o.value === s)?.label || s}
                            <button onClick={() => removeFilter('status', s)}><X size={12} /></button>
                        </span>
                    ))}
                    {isVerified && (
                        <span className="filter-chip">
                            Verified: {isVerified === 'true' ? 'Yes' : 'No'}
                            <button onClick={() => removeFilter('is_verified')}><X size={12} /></button>
                        </span>
                    )}
                    {paymentMode && (
                        <span className="filter-chip">
                            Payment: {paymentMode}
                            <button onClick={() => removeFilter('payment_mode')}><X size={12} /></button>
                        </span>
                    )}
                    {dateFrom && (
                        <span className="filter-chip">
                            From: {dateFrom}
                            <button onClick={() => removeFilter('date_from')}><X size={12} /></button>
                        </span>
                    )}
                    {dateTo && (
                        <span className="filter-chip">
                            To: {dateTo}
                            <button onClick={() => removeFilter('date_to')}><X size={12} /></button>
                        </span>
                    )}
                    {companyIds.map(id => (
                        <span key={id} className="filter-chip">
                            Company ID: {id}
                            <button onClick={() => removeFilter('company_ids', id)}><X size={12} /></button>
                        </span>
                    ))}
                    <button className="clear-all-btn" onClick={() => setSearchParams({})}>Clear All</button>

                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Send Report via Email</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Add email addresses to receive the report. The list will be saved for future use.
                        </p>

                        <div className="email-input-group mb-4">
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter email and press Enter"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={handleAddEmail}
                            />
                            <button className="btn btn-secondary btn-sm" onClick={handleAddEmail}>Add</button>
                        </div>

                        <div className="email-chip-list mb-6">
                            {reportEmails.map(email => (
                                <span key={email} className="email-chip">
                                    {email}
                                    <button onClick={() => handleRemoveEmail(email)}><X size={12} /></button>
                                </span>
                            ))}
                            {reportEmails.length === 0 && <span className="text-gray-400 text-sm italic">No emails added</span>}
                        </div>

                        <div className="modal-actions flex justify-end gap-2">
                            <button className="btn btn-secondary" onClick={() => setShowEmailModal(false)}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmSendReport}
                                disabled={reportEmails.length === 0}
                            >
                                Send Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timer Notification Toast */}
            {sendingReport && (
                <div className="timer-toast">
                    <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Sending report in <strong>{reportTimer}s</strong>...</span>
                    </div>
                    <button className="btn btn-warning btn-sm" onClick={handleCancelTimer}>
                        Undo / Cancel
                    </button>
                </div>
            )}


            {error && <div className="alert-error">{error}</div>}

            <div className="companies-table-container">
                <table className="companies-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Company</th>
                            <th>Products</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="loading-row">
                                    <Loader2 className="spinner" size={24} />
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="empty-row">No orders found matching criteria.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <div className="font-mono text-sm">{order.id}</div>
                                        <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                                    </td>
                                    <td>
                                        <div className="font-semibold">
                                            {order.company ? (
                                                <Link
                                                    to={`/event/${eventId}/companies/${order.company.id}`}
                                                    className="company-link hover:underline text-primary"
                                                >
                                                    {order.company.company_name}
                                                </Link>
                                            ) : 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">{order.user?.name}</div>
                                    </td>
                                    <td>
                                        <div className="ar-product-list">
                                            {order.products.map(product => (
                                                <div key={product.id} className="ar-product-item">
                                                    {product.image && <img src={product.image} alt="" className="ar-product-img" />}
                                                    <span>{product.name} (x{product.quantity})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="font-medium">
                                            {order.total_amount?.formatted}
                                        </div>
                                        {order.total_amount_usd && (
                                            <div className="text-xs text-gray-500">
                                                {order.total_amount_usd.formatted}
                                            </div>
                                        )}
                                    </td>
                                    <td>
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
                                    <td>
                                        <span className={`ar-status-badge status-${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1 || loading}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <span className="page-info">Page {page} of {Math.ceil(total / 10)}</span>
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
