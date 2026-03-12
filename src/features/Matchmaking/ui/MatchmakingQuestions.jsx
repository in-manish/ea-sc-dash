import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { matchmakingApi } from '../api/matchmakingApi';
import { Loader2, RefreshCw, AlertCircle, Copy, Hash, ChevronLeft, ChevronRight, Trash2, X, Plus, Layout, ChevronDown, ChevronUp } from 'lucide-react';
import QuestionCard from './QuestionCard';
import CopyMatchmakingModal from './CopyMatchmakingModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import MatchmakingQuestionModal from './MatchmakingQuestionModal';
import { eventService } from '../../../services/eventService';

const MatchmakingQuestions = () => {
    const { selectedEvent, token } = useAuth();
    const [currentId, setCurrentId] = useState(selectedEvent?.id);
    const [tempId, setTempId] = useState(selectedEvent?.id || '');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [modals, setModals] = useState({ copy: false, del: false, delLoading: false, ques: false, selectedQues: null });

    const ids = useMemo(() => {
        const start = Math.max(1, currentId - 4);
        return Array.from({ length: 5 }, (_, i) => start + i);
    }, [currentId]);

    const fetchData = async () => {
        if (!currentId) return;
        setLoading(true); setError(null);
        try { 
            const [quesData, attendData] = await Promise.all([
                matchmakingApi.getMatchmakingQuestions(currentId, token),
                eventService.getAttendeeTypes(currentId, token)
            ]);
            setData(quesData);
            setAttendeeTypes(attendData.attendee_types || []);
        }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    useEffect(() => { setCurrentId(selectedEvent?.id); setTempId(selectedEvent?.id); }, [selectedEvent]);
    useEffect(() => { fetchData(); }, [currentId, token]);

    const handleDelete = async () => {
        setModals(m => ({ ...m, delLoading: true }));
        try { 
            const res = await matchmakingApi.deleteMatchmakingForm(currentId, data.id, token); 
            if (res && res.msg) alert(res.msg);
            fetchData(); setModals(m => ({ ...m, del: false })); 
        } catch (err) { setError(err.message); }
        finally { setModals(m => ({ ...m, delLoading: false })); }
    };

    const handleRemoveQuestion = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await matchmakingApi.saveMatchmakingQuestions(currentId, { form_id: data.id, questions: [{ id, is_deleted: true }] }, token);
            fetchData();
        } catch (err) { setError(err.message); }
    };

    const [allExpanded, setAllExpanded] = useState(false);

    return (
        <div className="w-full max-w-[1600px] mx-auto py-12 px-8 animate-fade-in min-h-screen">
            {error && (
                <div className="mb-8 p-5 bg-status-danger/5 border border-status-danger/10 rounded-2xl flex items-center gap-4 text-status-danger animate-slide-up shadow-sm backdrop-blur-md">
                    <div className="p-1.5 bg-status-danger/10 rounded-full"><AlertCircle size={16} /></div>
                    <span className="text-[11px] font-bold tracking-tight">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-status-danger/10 rounded-lg transition-colors"><X size={18} /></button>
                </div>
            )}
            
            <div className="relative mb-16">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -top-12 right-0 w-64 h-64 bg-status-success/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary w-fit px-4 py-1.5 rounded-full border border-border/40">
                            <span className="text-accent">Module:</span> Matchmaking
                            <div className="w-1 h-1 rounded-full bg-border mx-1" />
                            {data?.modified_at && <span>Synced: {new Date(data.modified_at).toLocaleDateString()}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                                Event <span className="text-accent underline decoration-accent/20">#{currentId}</span>
                            </h1>
                            <p className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                                {data?.form_name || 'Configuration Gateway'} · {data?.questions?.length || 0} active parameters
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-xl shadow-accent/5 border border-border/40">
                            <button onClick={() => setCurrentId(Math.max(1, currentId - 1))} className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-colors"><ChevronLeft size={16} /></button>
                            <div className="flex gap-1">
                                {ids.map(id => (
                                    <button key={id} onClick={() => { setCurrentId(id); setTempId(id); }} className={`flex flex-col items-center justify-center min-w-[50px] py-1.5 rounded-xl transition-all duration-300 ${currentId == id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-tertiary hover:text-text-primary hover:bg-bg-secondary'}`}>
                                        <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70 mb-0.5">EVENT</span>
                                        <span className="text-xs font-bold leading-none">{id}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentId(currentId + 1)} className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary transition-colors"><ChevronRight size={16} /></button>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <form onSubmit={e => { e.preventDefault(); if(tempId) setCurrentId(parseInt(tempId)); }} className="relative flex-1 sm:w-32">
                                <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                                <input type="number" value={tempId} onChange={e => setTempId(e.target.value)} className="input-field pl-9 py-3 text-sm font-bold border-border/60 focus:ring-accent/20" placeholder="GO TO..." />
                            </form>
                            <div className="flex items-center gap-2">
                                {data?.id && (
                                    <>
                                        <button onClick={() => setAllExpanded(!allExpanded)} className="p-2.5 text-text-tertiary hover:text-accent rounded-xl transition-all border border-border/60 hover:bg-accent/5" title={allExpanded ? "Collapse All" : "Expand All"}>
                                            {allExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        <button onClick={() => setModals(m => ({ ...m, del: true }))} className="p-2.5 text-text-tertiary hover:text-status-danger rounded-xl transition-all border border-border/60 hover:bg-status-danger/5" title="Delete Form"><Trash2 size={18} /></button>
                                        <button onClick={() => setModals(m => ({ ...m, ques: true, selectedQues: null }))} className="p-2.5 text-accent hover:bg-accent/5 rounded-xl transition-all border border-accent/20" title="Add Question"><Plus size={18} /></button>
                                    </>
                                )}
                                <button onClick={() => setModals(m => ({ ...m, copy: true }))} className="btn btn-primary h-10 px-4 rounded-xl gap-2 text-[11px] font-bold tracking-tight border-none shadow-lg shadow-accent/10 group"><Copy size={16} className="group-hover:rotate-12 transition-transform" /> COPY FLOW</button>
                                <button onClick={fetchData} className="p-2.5 text-text-tertiary hover:text-accent transition-all group hover:bg-accent/5 rounded-xl border border-border/60"><RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 text-text-tertiary gap-8 animate-pulse">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-accent/10 border-t-accent rounded-full animate-spin" />
                        <Loader2 className="absolute inset-0 m-auto text-accent animate-bounce" size={24} />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold tracking-widest text-text-primary uppercase mb-1">Synchronizing</p>
                        <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Matchmaking Data Layer</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-white rounded-2xl border border-border/60 p-12 text-center animate-fade-in shadow-lg shadow-accent/5 max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-status-danger/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-status-danger/10">
                        <AlertCircle className="text-status-danger" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3 tracking-tight">Sync Handshake Failed</h3>
                    <p className="text-text-secondary max-w-md mx-auto mb-8 text-sm leading-relaxed">{error}</p>
                    <button onClick={fetchData} className="btn btn-secondary py-3 px-8 rounded-xl gap-2 mx-auto flex font-bold text-xs border-none bg-bg-secondary hover:bg-bg-tertiary"><RefreshCw size={16} /> RETRY CONNECTION</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
                    {data?.questions?.map(q => <QuestionCard key={q.id} question={q} attendeeTypes={attendeeTypes} onEdit={q => setModals(m => ({ ...m, ques: true, selectedQues: q }))} onRemove={handleRemoveQuestion} defaultExpanded={allExpanded} />)}
                    
                    {(!data?.questions || data.questions.length === 0) && (
                        <div className="col-span-full py-32 px-10 text-center bg-white rounded-[3rem] border-2 border-dashed border-border/60 flex flex-col items-center group hover:border-accent/40 transition-colors duration-500">
                            <div className="mb-8 p-8 bg-bg-secondary rounded-[2rem] text-text-tertiary group-hover:bg-accent/5 group-hover:text-accent transition-all duration-500 transform group-hover:scale-110">
                                <Layout size={48} className="animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-3 tracking-tight">Empty Canvas</h3>
                            <p className="text-xs text-text-secondary max-w-xs mx-auto mb-8 leading-relaxed font-medium"> The matchmaking module <b>{data?.form_name}</b> is initialized but contains no logical branches.</p>
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                                <button onClick={() => setModals(m => ({ ...m, ques: true, selectedQues: null }))} className="btn btn-primary py-3 px-8 rounded-xl gap-2 shadow-lg shadow-accent/10 font-bold text-[11px] border-none"><Plus size={18} /> DEFINE FIRST QUESTION</button>
                                {data?.modified_at && <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary bg-white px-4 py-2 rounded-xl border border-border/80">Active Since {new Date(data.modified_at).getFullYear()}</div>}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <CopyMatchmakingModal isOpen={modals.copy} onClose={() => setModals(m => ({ ...m, copy: false }))} toEventId={selectedEvent?.id} onSuccess={fetchData} />
            <DeleteConfirmationModal isOpen={modals.del} onClose={() => setModals(m => ({ ...m, del: false }))} onConfirm={handleDelete} formName={data?.form_name} loading={modals.delLoading} />
            <MatchmakingQuestionModal isOpen={modals.ques} onClose={() => setModals(m => ({ ...m, ques: false }))} eventId={currentId} token={token} question={modals.selectedQues} formId={data?.id} formName={data?.form_name} onSuccess={fetchData} />
        </div>
    );
};

export default MatchmakingQuestions;
