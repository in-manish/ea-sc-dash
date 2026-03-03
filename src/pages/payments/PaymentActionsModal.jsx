import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { Loader2, X, AlertTriangle, CheckCircle, RefreshCw, XOctagon } from 'lucide-react';

const STATUS_CHOICES = ['pending', 'processing', 'success', 'failed', 'cancelled', 'refunded', 'partially_refunded'];

const PaymentActionsModal = ({ payment, onClose, onSuccess }) => {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('status');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Status form
    const [newStatus, setNewStatus] = useState(payment.status);

    // Refund form
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await paymentService.updatePaymentStatus(token, {
                payment_id: payment.id,
                status: newStatus
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            showMessage('error', err.response?.data?.error || 'Failed to update payment status.');
            setLoading(false);
        }
    };

    const handleRefund = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Are you sure you want to process a ${refundAmount ? 'partial' : 'full'} refund?`)) return;

        setLoading(true);
        try {
            await paymentService.refundAdminPayment(token, {
                payment_id: payment.id,
                amount: refundAmount ? parseFloat(refundAmount) : undefined,
                reason: refundReason || undefined
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            showMessage('error', err.response?.data?.error || 'Failed to process refund. Check gateway restrictions.');
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this pending payment?')) return;
        setLoading(true);
        try {
            await paymentService.cancelPayment(token, payment.id);
            onSuccess();
        } catch (err) {
            console.error(err);
            showMessage('error', err.response?.data?.error || 'Failed to cancel payment.');
            setLoading(false);
        }
    };

    const canRefund = ['success', 'partially_refunded'].includes(payment.status);
    const canCancel = ['pending', 'processing'].includes(payment.status);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-primary rounded-xl w-full max-w-lg shadow-xl overflow-hidden animate-[modalPop_0.3s_ease-out]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-border bg-bg-secondary">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">Manage Payment #{payment.id}</h3>
                        <p className="text-sm text-text-secondary mt-1">Order: <span className="font-mono text-text-primary">{payment.order_id}</span></p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border px-5 bg-bg-primary">
                    <button
                        className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'status' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                        onClick={() => setActiveTab('status')}
                    >
                        Update Status
                    </button>
                    {canRefund && (
                        <button
                            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'refund' ? 'border-amber-500 text-amber-600' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
                            onClick={() => setActiveTab('refund')}
                        >
                            Process Refund
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {message.text && (
                        <div className={`p-4 rounded-md mb-6 text-sm font-medium border flex items-start gap-2 ${message.type === 'success' ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'}`}>
                            {message.type === 'success' ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {activeTab === 'status' && (
                        <form onSubmit={handleUpdateStatus}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-text-secondary mb-2">New Payment Status</label>
                                <select
                                    className="w-full p-3 border border-border rounded-lg bg-bg-primary outline-none focus:border-accent"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    disabled={loading}
                                >
                                    {STATUS_CHOICES.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                                </select>
                            </div>

                            {canCancel && (
                                <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                                            <XOctagon size={16} className="text-slate-500" /> Cancel Payment
                                        </h4>
                                        <p className="text-xs text-slate-600">Pending/processing payments can be formally cancelled. This cannot be undone.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm shrink-0 border border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Cancel Payment
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t border-border gap-3">
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Close</button>
                                <button type="submit" className="btn btn-primary min-w-[120px]" disabled={loading || newStatus === payment.status}>
                                    {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Save Status'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'refund' && canRefund && (
                        <form onSubmit={handleRefund}>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <p className="text-amber-800 text-sm font-medium mb-1">
                                    Total Payment Amount: <span className="font-bold">{payment.currency} {payment.amount}</span>
                                </p>
                                <p className="text-amber-700 text-xs">
                                    Leave the refund amount empty to process a <strong>Full Refund</strong>. Refunds are final and communicate directly with the provider ({payment.payment_gateway}).
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Refund Amount (Optional)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary font-medium">{payment.currency}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        max={payment.amount}
                                        min="1"
                                        className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-bg-primary outline-none focus:border-amber-500"
                                        placeholder="e.g. 50.00"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-text-secondary mb-2">Reason (Optional)</label>
                                <textarea
                                    className="w-full p-3 border border-border rounded-lg bg-bg-primary outline-none focus:border-amber-500"
                                    placeholder="Customer requested cancellation..."
                                    rows="3"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    disabled={loading}
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-border gap-3">
                                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Close</button>
                                <button type="submit" className="btn min-w-[140px] bg-amber-600 hover:bg-amber-700 text-white flex justify-center items-center gap-1.5" disabled={loading}>
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                    {loading ? 'Processing...' : 'Issue Refund'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentActionsModal;
