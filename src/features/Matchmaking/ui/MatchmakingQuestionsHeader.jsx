import React from 'react';
import { Hash, ChevronLeft, ChevronRight, Trash2, Plus, Copy, RefreshCw, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const MatchmakingQuestionsHeader = ({
    currentId, tempId, setTempId, setCurrentId, ids, data, reordering, loading,
    canCopy, onCopy, onRefresh, onDelete, onAdd, allExpanded, setAllExpanded,
}) => (
    <div className="relative mb-16">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-text-tertiary uppercase tracking-widest bg-bg-secondary w-fit px-4 py-1.5 rounded-full border border-border/40">
                    <span className="text-accent">Module:</span> Matchmaking
                    {data?.modified_at && (
                        <>
                            <div className="w-1 h-1 rounded-full bg-border mx-1" />
                            <span>Synced: {new Date(data.modified_at).toLocaleDateString()}</span>
                        </>
                    )}
                    {reordering && (
                        <span className="text-accent flex items-center gap-1.5">
                            <Loader2 size={10} className="animate-spin" /> Saving order…
                        </span>
                    )}
                </div>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    Event <span className="text-accent underline decoration-accent/20">#{currentId}</span>
                </h1>
                <p className="text-sm font-medium text-text-secondary flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                    {data?.form_name || (canCopy ? 'No form yet' : 'Configuration Gateway')}
                    {data?.id && <span className="text-[10px] font-mono opacity-40">#{data.id}</span>}
                    · {data?.questions?.length || 0} questions
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                <div className="flex items-center gap-1 bg-white p-1 rounded-2xl shadow-xl shadow-accent/5 border border-border/40">
                    <button type="button" onClick={() => setCurrentId(Math.max(1, currentId - 1))} className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary"><ChevronLeft size={16} /></button>
                    <div className="flex gap-1">
                        {ids.map((id) => (
                            <button key={id} type="button" onClick={() => { setCurrentId(id); setTempId(id); }} className={`flex flex-col items-center justify-center min-w-[50px] py-1.5 rounded-xl ${currentId == id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-tertiary hover:bg-bg-secondary'}`}>
                                <span className="text-[8px] font-bold uppercase opacity-70 mb-0.5">EVENT</span>
                                <span className="text-xs font-bold leading-none">{id}</span>
                            </button>
                        ))}
                    </div>
                    <button type="button" onClick={() => setCurrentId(currentId + 1)} className="p-2 hover:bg-bg-secondary rounded-xl text-text-tertiary"><ChevronRight size={16} /></button>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <form onSubmit={(e) => { e.preventDefault(); if (tempId) setCurrentId(parseInt(tempId, 10)); }} className="relative flex-1 sm:w-32">
                        <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input type="number" value={tempId} onChange={(e) => setTempId(e.target.value)} className="input-field pl-9 py-3 text-sm font-bold" placeholder="GO TO..." />
                    </form>
                    <div className="flex items-center gap-2">
                        {data?.id && (
                            <>
                                <button type="button" onClick={() => setAllExpanded(!allExpanded)} className="p-2.5 text-text-tertiary hover:text-accent rounded-xl border border-border/60" title={allExpanded ? 'Collapse All' : 'Expand All'}>
                                    {allExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                <button type="button" onClick={onDelete} className="p-2.5 text-text-tertiary hover:text-status-danger rounded-xl border border-border/60" title="Delete Form"><Trash2 size={18} /></button>
                                <button type="button" onClick={onAdd} className="p-2.5 text-accent hover:bg-accent/5 rounded-xl border border-accent/20" title="Add Question"><Plus size={18} /></button>
                            </>
                        )}
                        <button type="button" onClick={onCopy} className="btn btn-primary h-10 px-4 rounded-xl gap-2 text-[11px] font-bold border-none">
                            <Copy size={16} /> Copy
                        </button>
                        <button type="button" onClick={onRefresh} className="p-2.5 text-text-tertiary hover:text-accent rounded-xl border border-border/60">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default MatchmakingQuestionsHeader;
