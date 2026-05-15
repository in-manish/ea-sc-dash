import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { emailKillSwitchService } from '../../services/emailKillSwitchService';
import { RefreshCw, Power, PowerOff, Edit2, Plus, X, Save, Loader2, Info, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const SwitchModal = ({ isOpen, onClose, onSave, switchData, isSaving }) => {
    const [formData, setFormData] = useState({
        key: '',
        is_enabled: false,
        reason: ''
    });

    useEffect(() => {
        if (switchData) {
            setFormData({
                key: switchData.key || '',
                is_enabled: switchData.is_enabled ?? false,
                reason: switchData.reason || ''
            });
        } else {
            setFormData({
                key: '',
                is_enabled: false,
                reason: ''
            });
        }
    }, [switchData, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!switchData;

    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-fade-in">
            <div className="bg-bg-primary w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-border animate-slide-up">
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary/30">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary">{isEdit ? 'Edit Kill Switch' : 'Add New Kill Switch'}</h3>
                        <p className="text-xs text-text-tertiary mt-1">Configure email system override switches</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Switch Key</label>
                        <input
                            type="text"
                            placeholder="e.email.marketing"
                            className={`w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all ${isEdit ? 'cursor-not-allowed opacity-70' : ''}`}
                            value={formData.key}
                            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                            readOnly={isEdit}
                            required
                        />
                        {!isEdit && <p className="text-[10px] text-text-tertiary">Use dot notation for keys, e.g., email.all, email.system</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Reason / Description</label>
                        <textarea
                            placeholder="Why is this switch being created/modified?"
                            className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent transition-all min-h-[100px] resize-none"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-secondary/50 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.is_enabled ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                {formData.is_enabled ? <Power size={18} /> : <PowerOff size={18} />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-text-primary">Status</h4>
                                <p className="text-[11px] text-text-tertiary">Enable or disable this email path</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, is_enabled: !formData.is_enabled })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-inner ${formData.is_enabled ? 'bg-success' : 'bg-danger'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${formData.is_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-bg-tertiary text-text-primary rounded-xl font-bold text-sm hover:bg-border transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-accent text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:opacity-90 transition-all disabled:opacity-50"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isEdit ? 'Update Switch' : 'Create Switch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EmailKillSwitch = () => {
    const { token } = useAuth();
    const [switches, setSwitches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSwitch, setSelectedSwitch] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSwitches = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await emailKillSwitchService.listKillSwitches(token);
            if (response.success) {
                setSwitches(response.data || []);
            } else {
                setError(response.error || 'Failed to fetch switches');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load email kill switches. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchSwitches();
    }, [token]);

    const handleToggleStatus = async (sw) => {
        const newStatus = !sw.is_enabled;
        try {
            const response = await emailKillSwitchService.updateKillSwitch(token, sw.key, { is_enabled: newStatus });
            if (response.success) {
                setSwitches(prev => prev.map(s => s.key === sw.key ? response.data : s));
                showSuccess(`Switch ${sw.key} ${newStatus ? 'enabled' : 'disabled'} successfully.`);
            }
        } catch (err) {
            console.error(err);
            setError(`Failed to update switch status for ${sw.key}.`);
        }
    };

    const handleSaveSwitch = async (formData) => {
        setIsSaving(true);
        try {
            let response;
            if (selectedSwitch) {
                // Update existing
                response = await emailKillSwitchService.updateKillSwitch(token, selectedSwitch.key, {
                    is_enabled: formData.is_enabled,
                    reason: formData.reason
                });
            } else {
                // Create/Update new (the API uses POST for both create and update-by-key in the list view)
                response = await emailKillSwitchService.createUpdateKillSwitch(token, formData);
            }

            if (response.success) {
                if (selectedSwitch) {
                    setSwitches(prev => prev.map(s => s.key === selectedSwitch.key ? response.data : s));
                } else {
                    // Check if it already exists in the list to avoid duplicates if POST acted as update
                    setSwitches(prev => {
                        const exists = prev.find(s => s.key === response.data.key);
                        if (exists) {
                            return prev.map(s => s.key === response.data.key ? response.data : s);
                        }
                        return [...prev, response.data];
                    });
                }
                showSuccess(`Switch saved successfully.`);
                setIsModalOpen(false);
            } else {
                setError(response.error || 'Failed to save switch.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to save kill switch settings.');
        } finally {
            setIsSaving(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Email Kill Switches</h1>
                    <p className="text-text-secondary text-sm">System-wide overrides for emailing functionality</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchSwitches}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-bg-primary border border-border rounded-lg text-sm font-semibold hover:bg-bg-secondary transition-all disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={() => { setSelectedSwitch(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-accent/20"
                    >
                        <Plus size={16} />
                        Add Switch
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-3 animate-fade-in relative">
                    <XCircle size={18} />
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-danger/20 rounded">
                        <X size={14} />
                    </button>
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 size={18} />
                    {successMessage}
                </div>
            )}

            {/* Warning Info */}
            <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl flex gap-3">
                <AlertTriangle className="text-warning shrink-0" size={20} />
                <div className="space-y-1">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Critical System Controls</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                        These switches directly override email sending logic. Disabling a switch (setting <span className="font-bold">is_enabled</span> to false) will block emails matching that key across the entire platform. Use with caution.
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-bg-primary border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-secondary/50 border-b border-border">
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Key</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Reason</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Last Updated</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-40"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-bg-tertiary rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-64"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-bg-tertiary rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="flex justify-end gap-2"><div className="w-8 h-8 bg-bg-tertiary rounded"></div></div></td>
                                    </tr>
                                ))
                            ) : switches.length > 0 ? (
                                switches.map((sw) => (
                                    <tr key={sw.id} className="hover:bg-bg-secondary/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-text-primary font-mono bg-bg-secondary px-2 py-1 rounded border border-border group-hover:text-accent transition-colors">
                                                {sw.key}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => handleToggleStatus(sw)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-inner ${sw.is_enabled ? 'bg-success' : 'bg-danger'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${sw.is_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-text-secondary line-clamp-2 max-w-md font-medium" title={sw.reason}>
                                                {sw.reason || <span className="italic text-text-tertiary">No reason provided</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-text-secondary font-medium">{formatDate(sw.updated_at)}</span>
                                                <span className="text-[11px] text-text-tertiary">By ID: {sw.updated_by_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setSelectedSwitch(sw); setIsModalOpen(true); }}
                                                    className="p-2 text-text-tertiary hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                                                    title="Edit Switch"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-text-tertiary">
                                            <PowerOff size={48} strokeWidth={1} />
                                            <p className="text-sm font-medium">No email kill switches found.</p>
                                            <button 
                                                onClick={() => { setSelectedSwitch(null); setIsModalOpen(true); }}
                                                className="mt-2 text-accent font-bold text-sm hover:underline"
                                            >
                                                Add your first switch
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SwitchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                switchData={selectedSwitch}
                onSave={handleSaveSwitch}
                isSaving={isSaving}
            />
        </div>
    );
};

export default EmailKillSwitch;
