import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { matchmakingApi } from '../api/matchmakingApi';
import { Loader2, RefreshCw, AlertCircle, Copy, Hash, ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import QuestionCard from './QuestionCard';
import CopyMatchmakingModal from './CopyMatchmakingModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const MatchmakingQuestions = () => {
    const { selectedEvent, token } = useAuth();
    const [currentId, setCurrentId] = useState(selectedEvent?.id);
    const [tempId, setTempId] = useState(selectedEvent?.id || '');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modals, setModals] = useState({ copy: false, del: false, delLoading: false });

    const ids = useMemo(() => {
        const start = Math.max(1, currentId - 4);
        return Array.from({ length: 5 }, (_, i) => start + i);
    }, [currentId]);

    const fetchData = async () => {
        if (!currentId) return;
        setLoading(true); setError(null);
        try { setData(await matchmakingApi.getMatchmakingQuestions(currentId, token)); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { setCurrentId(selectedEvent?.id); setTempId(selectedEvent?.id); }, [selectedEvent]);
    useEffect(() => { fetchData(); }, [currentId, token]);

    const handleDelete = async () => {
        setModals(m => ({ ...m, delLoading: true }));
        try { 
            await matchmakingApi.deleteMatchmakingForm(currentId, data.id, token); 
            fetchData(); 
            setModals(m => ({ ...m, del: false })); 
        } catch (err) { setError(err.message); }
        finally { setModals(m => ({ ...m, delLoading: false })); }
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-6 animate-fade-in">
            {error && (
                <div className="mb-6 p-4 bg-status-danger/10 border border-status-danger/20 rounded-xl flex items-center gap-3 text-status-danger animate-fade-in shadow-sm">
                    <AlertCircle size={20} className="shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-status-danger/60 hover:text-status-danger"><X size={18} /></button>
                </div>
            )}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-border">
                <div className="flex gap-4 items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary mb-1.5 flex items-center gap-2">Matchmaking <span className="text-text-tertiary">#{currentId}</span></h1>
                        <p className="text-sm text-text-secondary font-medium">{data?.form_name || 'No configuration found'}</p>
                    </div>
                    {data?.id && <button onClick={() => setModals(m => ({ ...m, del: true }))} className="p-2 text-text-tertiary hover:text-danger rounded-lg transition-colors bg-bg-secondary"><Trash2 size={18} /></button>}
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-border">
                        <button onClick={() => setCurrentId(Math.max(1, currentId - 1))} className="p-1.5 hover:bg-bg-secondary rounded-lg text-text-tertiary"><ChevronLeft size={18} /></button>
                        {ids.map(id => <button key={id} onClick={() => { setCurrentId(id); setTempId(id); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currentId == id ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:bg-bg-secondary'}`}>{id}</button>)}
                        <button onClick={() => setCurrentId(currentId + 1)} className="p-1.5 hover:bg-bg-secondary rounded-lg text-text-tertiary"><ChevronRight size={18} /></button>
                    </div>
                    <form onSubmit={e => { e.preventDefault(); if(tempId) setCurrentId(parseInt(tempId)); }} className="relative group">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent" />
                        <input type="number" value={tempId} onChange={e => setTempId(e.target.value)} className="input-field pl-8 py-2 w-28 text-sm" placeholder="Jump..." />
                    </form>
                    <button onClick={() => setModals(m => ({ ...m, copy: true }))} className="btn btn-primary shadow-lg shadow-accent/20 px-5 gap-2 group"><Copy size={16} /> Copy Config</button>
                    <button onClick={fetchData} className="p-2 text-text-tertiary hover:text-accent"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
                </div>
            </div>
            {loading ? <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary gap-4"><Loader2 className="animate-spin text-accent" size={40} /><p className="font-medium">Syncing...</p></div> : 
             error ? <div className="card border-danger/20 bg-danger/5 p-12 text-center animate-fade-in"><AlertCircle className="text-danger mb-4 mx-auto" size={48} /><h3 className="text-danger font-bold text-lg mb-2">Sync Interrupted</h3><p className="text-text-secondary max-w-md mx-auto mb-6">{error}</p><button onClick={fetchData} className="btn btn-secondary px-8 gap-2 mx-auto flex"><RefreshCw size={16} /> Re-sync Event</button></div> : 
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                 {data?.questions?.map(q => <QuestionCard key={q.id} question={q} />)}
                 {(!data?.questions || data.questions.length === 0) && (
                     <div className="col-span-full p-20 text-center bg-white rounded-2xl border-2 border-dashed border-border flex flex-col items-center">
                         <div className="mb-6 p-4 bg-bg-secondary rounded-full text-text-tertiary"><Hash size={32} /></div>
                         <h3 className="text-lg font-bold text-text-primary mb-2">Empty Configuration</h3>
                         <p className="text-sm text-text-secondary max-w-sm mb-6">A matchmaking form named <b>{data?.form_name}</b> (ID: {data?.id}) exists but has no questions defined yet.</p>
                         {data?.modified_at && <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary bg-bg-tertiary px-3 py-1 rounded-full border border-border">Updated: {new Date(data.modified_at).toLocaleString()}</div>}
                     </div>
                 )}
             </div>}
            <CopyMatchmakingModal isOpen={modals.copy} onClose={() => setModals(m => ({ ...m, copy: false }))} toEventId={selectedEvent?.id} onSuccess={fetchData} />
            <DeleteConfirmationModal isOpen={modals.del} onClose={() => setModals(m => ({ ...m, del: false }))} onConfirm={handleDelete} formName={data?.form_name} loading={modals.delLoading} />
        </div>
    );
};

export default MatchmakingQuestions;
