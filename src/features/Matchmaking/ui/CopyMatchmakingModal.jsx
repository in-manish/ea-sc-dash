import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { matchmakingApi } from '../api/matchmakingApi';
import { eventService } from '../../../services/eventService';
import { useAuth } from '../../../contexts/AuthContext';

const STORAGE_KEY = 'matchmaking_mapping_state';

const CopyMatchmakingModal = ({ isOpen, onClose, toEventId, onSuccess }) => {
    const { token } = useAuth();
    const [fromId, setFromId] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY))?.fromId || '');
    const [types, setTypes] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY))?.types || [{ from: '', to: '' }]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [sourceTypes, setSourceTypes] = useState([]);
    const [destTypes, setDestTypes] = useState([]);

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fromId, types })); }, [fromId, types]);

    useEffect(() => {
        if (isOpen && toEventId) eventService.getAttendeeTypes(toEventId, token).then(d => setDestTypes(d.attendee_types || [])).catch(() => {});
    }, [isOpen, toEventId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (fromId) eventService.getAttendeeTypes(fromId, token).then(d => setSourceTypes(d.attendee_types || [])).catch(() => setSourceTypes([]));
        }, 500);
        return () => clearTimeout(timer);
    }, [fromId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!confirm) { setConfirm(true); return; }
        setLoading(true); setError(null);
        try {
            await matchmakingApi.copyMatchmaking({
                from_event_id: parseInt(fromId), to_event_id: parseInt(toEventId),
                attendee_types_data: types.filter(t => t.from && t.to).map(t => ({
                    from_attendee_type_name: t.from,
                    to_attendee_type_name: t.to
                }))
            }, token);
            setSuccess(true); setTimeout(() => { onSuccess?.(); onClose(); setConfirm(false); setSuccess(false); }, 2000);
        } catch (err) { setError(err.message); setConfirm(false); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1100] animate-fade-in" onClick={onClose}>
            <div className="bg-bg-primary rounded-xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-modal-smooth" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-border flex justify-between items-center bg-bg-secondary"><h2 className="text-lg font-bold">Copy Matchmaking</h2><button onClick={onClose} className="text-text-tertiary hover:text-text-primary"><X size={20} /></button></div>
                <form onSubmit={handleSubmit} className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in"><CheckCircle2 size={48} className="text-success mb-4" /><h3 className="font-bold text-text-primary mb-2">Success!</h3><p className="text-sm text-text-secondary">Questions copied successfully.</p></div>
                    ) : confirm ? (
                        <div className="flex flex-col gap-6 animate-fade-in">
                            <div className="flex flex-col items-center text-center gap-3 py-4"><HelpCircle size={48} className="text-accent opacity-50 mb-2" /><h3 className="font-bold text-lg">Are you sure?</h3><p className="text-sm text-text-secondary">Copy from <b>#{fromId}</b> to <b>#{toEventId}</b>? This overwrites existing config.</p></div>
                            <div className="flex gap-3"><button type="button" onClick={() => setConfirm(false)} className="btn btn-secondary flex-1">Back</button><button type="submit" disabled={loading} className="btn btn-primary flex-1 gap-2">{loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Copy'}</button></div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {error && <div className="p-3 bg-status-danger/5 border border-status-danger/20 rounded-lg flex items-start gap-3 text-status-danger text-sm"><AlertCircle size={16} className="shrink-0 mt-0.5" /><span>{error}</span></div>}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="input-group mb-0"><label className="input-label">From Event ID</label><input type="number" required className="input-field" placeholder="e.g. 123" value={fromId} onChange={e => setFromId(e.target.value)} /></div>
                                <div className="input-group mb-0"><label className="input-label">To Event ID</label><input type="number" disabled className="input-field bg-bg-tertiary opacity-70" value={toEventId} /></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center"><label className="input-label mb-0">Attendee Type Mappings</label><button type="button" onClick={() => setTypes([...types, { from: '', to: '' }])} className="text-xs font-bold text-accent flex items-center gap-1 hover:underline"><Plus size={14} /> Add Mapping</button></div>
                                <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2">
                                    <datalist id="source-types">{sourceTypes.map(t => <option key={t.id} value={t.name} />)}</datalist>
                                    <datalist id="dest-types">{destTypes.map(t => <option key={t.id} value={t.name} />)}</datalist>
                                    {types.map((t, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <input list="source-types" type="text" className="input-field py-2 text-sm" placeholder="Source Type" value={t.from} onChange={e => { const n = [...types]; n[i].from = e.target.value; setTypes(n); }} />
                                            <span className="text-text-tertiary">→</span>
                                            <input list="dest-types" type="text" className="input-field py-2 text-sm" placeholder="Dest Type" value={t.to} onChange={e => { const n = [...types]; n[i].to = e.target.value; setTypes(n); }} />
                                            <button type="button" onClick={() => setTypes(types.filter((_, idx) => idx !== i))} className="text-text-tertiary hover:text-status-danger p-1 transition-colors" disabled={types.length === 1}><Trash2 size={16} /></button>
                                        </div>))}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-2"><button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button><button type="submit" className="btn btn-primary flex-1">Copy Questions</button></div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CopyMatchmakingModal;
