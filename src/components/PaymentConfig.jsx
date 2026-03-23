import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/paymentService';
import { Loader2, Key, CheckCircle2, XCircle, Plus, Trash2, ShieldCheck, Server, Pencil } from 'lucide-react';

const PaymentConfig = ({ token }) => {
    const [configs, setConfigs] = useState([]);
    const [globalMode, setGlobalMode] = useState('test');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form state for new/edit config
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        gateway: 'razorpay',
        mode: 'test',
        key_id: '',
        key_secret: '',
        webhook_url: '',
        is_active: true
    });

    useEffect(() => {
        if (token) fetchConfigs();
    }, [token]);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const [data, modeData] = await Promise.all([
                paymentService.getConfigs(token),
                paymentService.getPaymentMode(token).catch(() => ({ mode: 'test' }))
            ]);
            setConfigs(data.configurations || []);
            if (modeData && modeData.mode) {
                setGlobalMode(modeData.mode);
            }
        } catch (err) {
            console.error("Failed to fetch payment configs:", err);
            showMessage('error', 'Failed to load configurations.');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            const payload = {
                id: editingId, // Include ID if editing
                gateway: formData.gateway,
                mode: formData.mode,
                is_active: formData.is_active,
                credentials: {
                    key_id: formData.key_id,
                    key_secret: formData.key_secret
                },
                webhook_url: formData.webhook_url
            };
            // Assuming createConfig can handle updates if 'id' is present, or a separate updateConfig would be used
            await paymentService.createConfig(token, payload);
            showMessage('success', `Configuration ${editingId ? 'updated' : 'saved'} successfully.`);
            setShowForm(false);
            resetForm();
            fetchConfigs();
        } catch (err) {
            console.error(err);
            showMessage('error', err.response?.data?.error || `Failed to ${editingId ? 'update' : 'save'} configuration.`);
        } finally {
            setActionLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ gateway: 'razorpay', mode: 'test', key_id: '', key_secret: '', webhook_url: '', is_active: true });
        setEditingId(null);
    };

    const handleModeToggle = async () => {
        const newMode = globalMode === 'live' ? 'test' : 'live';
        if (newMode === 'live') {
            if (!window.confirm('Are you sure you want to switch to Live mode? Real transactions will be processed.')) return;
        }

        setActionLoading(true);
        try {
            await paymentService.setPaymentMode(token, newMode);
            setGlobalMode(newMode);
            showMessage('success', `Payment mode changed to ${newMode.toUpperCase()}`);
        } catch (err) {
            console.error(err);
            showMessage('error', 'Failed to update payment mode.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (config) => {
        setEditingId(config.id);
        setFormData({
            gateway: config.gateway_name || config.gateway || 'razorpay',
            mode: config.mode || 'test',
            key_id: config.credentials?.key_id || '', // Note: Secrets aren't usually returned, user must re-enter if updating keys
            key_secret: '', // Keep empty for security
            webhook_url: config.webhook_url || '',
            is_active: config.is_active === undefined ? true : config.is_active
        });
        setShowForm(true);
    };

    const handleTestConfig = async (configId) => {
        setActionLoading(true);
        try {
            const result = await paymentService.testConfig(token, { config_id: configId });
            // Check both is_valid and test_result status for robustness
            if (result.is_valid || result.test_result === 'passed') {
                showMessage('success', 'Configuration tested successfully: Keys are valid.');
            } else {
                showMessage('error', 'Configuration test failed: Invalid keys or credentials.');
            }
        } catch (err) {
            console.error(err);
            showMessage('error', err.response?.data?.error || 'Error testing configuration.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeactivate = async (configId) => {
        if (!window.confirm('Are you sure you want to deactivate this configuration?')) return;

        setActionLoading(true);
        try {
            await paymentService.deactivateConfig(token, configId);
            showMessage('success', 'Configuration deactivated.');
            fetchConfigs();
        } catch (err) {
            console.error(err);
            showMessage('error', 'Failed to deactivate configuration.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-text-secondary">
                <Loader2 className="animate-spin mr-2" size={24} /> Loading Payment Configurations...
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {message.text && (
                <div className={`p-4 rounded-md mb-6 text-sm font-medium border flex items-center gap-2 ${message.type === 'success' ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {message.text}
                </div>
            )}

            <div className="bg-bg-primary border border-border rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-border">
                    <h3 className="text-base font-semibold text-text-primary m-0">Payment Gateways</h3>
                    <div className="flex gap-4 items-center">
                        {!showForm && (
                            <div className="flex items-center gap-3 bg-bg-secondary px-3 py-1.5 rounded-lg border border-border">
                                <span className={`text-xs font-semibold ${globalMode === 'test' ? 'text-blue-600' : 'text-text-tertiary'}`}>Test</span>
                                <button 
                                    onClick={handleModeToggle}
                                    disabled={actionLoading}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${globalMode === 'live' ? 'bg-red-500' : 'bg-blue-500'} disabled:opacity-50`}
                                    title="Toggle global payment mode"
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${globalMode === 'live' ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className={`text-xs font-semibold ${globalMode === 'live' ? 'text-red-600' : 'text-text-tertiary'}`}>Live</span>
                            </div>
                        )}
                        {!showForm && (
                            <button
                                className="btn btn-sm btn-primary flex items-center gap-1.5"
                                onClick={() => { resetForm(); setShowForm(true); }}
                                disabled={actionLoading}
                            >
                                <Plus size={16} /> Add Configuration
                            </button>
                        )}
                    </div>
                </div>

                {showForm && (
                    <div className="mb-8 p-5 bg-bg-secondary rounded-lg border border-border">
                        <h4 className="text-sm font-semibold mb-4 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Key size={16} className="text-accent" />
                                {editingId ? `Edit ${formData.gateway.charAt(0).toUpperCase() + formData.gateway.slice(1)} Settings` : 'New Gateway Settings'}
                            </span>
                            {editingId && <span className="text-[10px] bg-bg-tertiary px-2 py-0.5 rounded text-text-secondary font-mono">ID: {editingId}</span>}
                        </h4>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1.5 text-xs font-medium text-text-secondary uppercase">Gateway</label>
                                <select
                                    name="gateway"
                                    value={formData.gateway}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-border rounded-md text-sm bg-bg-primary"
                                    required
                                    disabled={!!editingId} // Usually gateway remains same for an entry
                                >
                                    <option value="razorpay">Razorpay</option>
                                    <option value="stripe">Stripe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1.5 text-xs font-medium text-text-secondary uppercase">Environment Mode</label>
                                <select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-border rounded-md text-sm bg-bg-primary"
                                    required
                                    disabled={!!editingId} // Usually mode is fixed per entry
                                >
                                    <option value="test">Test / Sandbox</option>
                                    <option value="live">Live / Production</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1.5 text-xs font-medium text-text-secondary uppercase">
                                    {formData.gateway === 'stripe' ? 'Publishable Key' : 'Key ID'}
                                </label>
                                <input
                                    type="text"
                                    name="key_id"
                                    value={formData.key_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-border rounded-md text-sm bg-bg-primary font-mono"
                                    required
                                    placeholder={formData.gateway === 'stripe'
                                        ? (formData.mode === 'live' ? 'pk_live_xxxxxx' : 'pk_test_xxxxxx')
                                        : (formData.mode === 'live' ? 'rzp_live_xxxxxx' : 'rzp_test_xxxxxx')
                                    }
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1.5 text-xs font-medium text-text-secondary uppercase">
                                    {formData.gateway === 'stripe' ? 'Secret Key' : 'Key Secret'}
                                </label>
                                <input
                                    type="password"
                                    name="key_secret"
                                    value={formData.key_secret}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-border rounded-md text-sm bg-bg-primary font-mono"
                                    required={!editingId} // Required if new, optional if edit (if not changing secret)
                                    placeholder={editingId ? 'Leave blank to keep current secret' : (formData.gateway === 'stripe'
                                        ? (formData.mode === 'live' ? 'sk_live_xxxxxx' : 'sk_test_xxxxxx')
                                        : 'Enter your secret key')
                                    }
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1.5 text-xs font-medium text-text-secondary uppercase">Webhook URL (Optional)</label>
                                <input
                                    type="url"
                                    name="webhook_url"
                                    value={formData.webhook_url}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-border rounded-md text-sm bg-bg-primary"
                                    placeholder={`https://your-domain.com/payment/webhook/${formData.gateway}/`}
                                />
                                <p className="text-xs text-text-tertiary mt-1">Leave blank to use default system webhook endpoint.</p>
                            </div>

                            <div className="md:col-span-2 flex justify-between items-center mt-2 pt-4 border-t border-border">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, is_active: !p.is_active }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.is_active ? 'bg-green-500' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <span className={`text-sm font-semibold ${formData.is_active ? 'text-green-600' : 'text-text-tertiary'}`}>
                                        {formData.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                                        {actionLoading ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Update Configuration' : 'Save Configuration')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {configs.length === 0 ? (
                        <div className="col-span-full p-8 text-center bg-bg-secondary rounded-lg border border-dashed border-border">
                            <Server size={32} className="mx-auto text-text-tertiary mb-3 opacity-50" />
                            <p className="text-text-secondary">No active payment configurations found.</p>
                        </div>
                    ) : (
                        configs.map(config => (
                            <div key={config.id} className={`border border-border rounded-lg p-5 bg-bg-primary shadow-sm flex flex-col relative overflow-hidden group ${!config.is_active ? 'opacity-75 bg-slate-50' : ''}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${config.mode === 'live' ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                                <div className="flex justify-between items-start mb-4 pl-2">
                                    <div>
                                        <h4 className="font-semibold text-text-primary capitalize flex items-center gap-2">
                                            {config.gateway_name || config.gateway || 'Provider'}
                                            {config.is_active ? (
                                                <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold tracking-wide">
                                                  <CheckCircle2 size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-semibold tracking-wide">
                                                  <XCircle size={12} /> Inactive
                                                </span>
                                            )}
                                        </h4>
                                        <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider ${config.mode === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {config.mode} Environment
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-text-secondary text-[10px] font-mono">
                                            ID: <span className="text-text-primary font-bold">{config.id}</span>
                                        </div>
                                        <button
                                            onClick={() => handleEdit(config)}
                                            className="p-1.5 text-text-tertiary hover:text-accent hover:bg-bg-tertiary rounded transition-colors"
                                            title="Edit Configuration"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="pl-2 mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
                                    <span className="text-text-tertiary text-xs">
                                        {config.is_active ? 'Currently active' : 'Inactive'}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTestConfig(config.id)}
                                            disabled={actionLoading}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-bg-secondary text-text-primary rounded hover:bg-slate-200 transition-colors"
                                        >
                                            <ShieldCheck size={14} className="text-accent" /> Test Connection
                                        </button>
                                        <button
                                            onClick={() => handleDeactivate(config.id)}
                                            disabled={actionLoading || !config.is_active}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-bg-secondary text-danger rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 size={14} /> Deactivate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentConfig;
