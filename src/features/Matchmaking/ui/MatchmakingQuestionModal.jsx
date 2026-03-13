import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Info, ChevronLeft } from 'lucide-react';
import { matchmakingApi } from '../api/matchmakingApi';
import { eventService } from '../../../services/eventService';

import StandardOptionsSection from './StandardOptionsSection';
import GroupedOptionsSection from './GroupedOptionsSection';

const MatchmakingQuestionModal = ({ isOpen, onClose, eventId, token, question, formId, formName, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [attendeeTypes, setAttendeeTypes] = useState([]);
    const [formData, setFormData] = useState({
        title: '', type: 'radio', is_mandatory: false, is_filter: false, design_type: 'vertical', 
        row_no: 1, attendee_types: [], options: [{ name: '' }]
    });

    useEffect(() => {
        if (isOpen) {
            eventService.getAttendeeTypes(eventId, token).then(d => setAttendeeTypes(d.attendee_types || []));
            if (question) {
                const initialOptions = question.options?.length > 0 ? question.options : (question.type === 'grouped_array' ? [{ name: '', values: [{ name: '' }] }] : [{ name: '' }]);
                setFormData({ ...question, attendee_types: question.attendee_types || [], is_filter: question.is_filter || false, options: initialOptions });
            } else setFormData({ title: '', type: 'radio', is_mandatory: false, is_filter: false, design_type: 'vertical', row_no: 1, attendee_types: [], options: [{ name: '' }] });
        }
    }, [isOpen, question]);

    useEffect(() => {
        if (formData.type === 'grouped_array' && (!formData.options[0]?.values)) setFormData(prev => ({ ...prev, options: [{ name: '', values: [{ name: '' }] }] }));
        else if (['radio', 'array'].includes(formData.type) && (formData.options[0]?.values)) setFormData(prev => ({ ...prev, options: [{ name: '' }] }));
    }, [formData.type]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            const formattedOptions = formData.options.map(opt => ({ ...opt, values: opt.values?.filter(v => v.name) })).filter(opt => opt.name || opt.values?.length > 0);
            await matchmakingApi.saveMatchmakingQuestions(eventId, { form_id: formId, form_name: formName, questions: [{ ...formData, id: question?.id, options: formattedOptions }] }, token);
            onSuccess?.(); onClose();
        } catch (err) { alert(err.message); } finally { setLoading(false); }
    };

    const editOpt = (idx, val) => { const n = [...formData.options]; n[idx].name = val; setFormData({ ...formData, options: n }); };
    const editGValue = (gi, vi, val) => { const n = [...formData.options]; n[gi].values[vi].name = val; setFormData({ ...formData, options: n }); };

    return (
        <div className={`fixed inset-0 left-[var(--sidebar-width)] z-[40] bg-white transition-[left,transform,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
            <div className="h-full flex flex-col">
                {/* Full-Page Header */}
                <div className="px-8 py-4 border-b border-border/60 bg-white/80 backdrop-blur-xl flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="group flex items-center gap-2 text-text-tertiary hover:text-accent transition-all">
                            <div className="p-2 rounded-xl bg-bg-secondary group-hover:bg-accent group-hover:text-white transition-all">
                                <ChevronLeft size={18} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">Back to Questions</span>
                        </button>
                        <div className="w-px h-8 bg-border/60 mx-2" />
                        <div>
                            <h2 className="text-xl font-bold text-text-primary tracking-tight">
                                {question ? 'Refine Configuration' : 'Create New Parameter'}
                            </h2>
                            <p className="text-[11px] text-text-tertiary mt-1 uppercase tracking-wider font-bold">
                                {formName} <span className="text-accent/40 mx-1">/</span> Event #{eventId}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-[11px] font-bold text-text-tertiary hover:text-text-primary transition-colors">
                            DISCARD
                        </button>
                        <button type="submit" disabled={loading} onClick={handleSubmit} className="btn btn-primary px-6 py-2.5 rounded-xl gap-2 shadow-xl shadow-accent/10 border-none font-bold text-[11px] tracking-tight group">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} className="group-hover:rotate-90 transition-transform" />}
                            {question ? 'SYNC CHANGES' : 'PUBLISH PARAMETER'}
                        </button>
                    </div>
                </div>

                {/* Full-Page Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-thin bg-bg-tertiary">
                    <div className="max-w-4xl mx-auto py-12 px-8 space-y-12">
                        {/* Section: Core Identity */}
                        <section className="space-y-12">
                            <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border/60 pb-2">1. Core Identity</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Question Title</label>
                                    <input required type="text" className="input-field py-3 px-5 text-lg font-semibold bg-white border border-border/60 focus:ring-4 focus:ring-accent/5 transition-all shadow-sm rounded-xl" placeholder="e.g. Which regions do you serve?" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Field Type</label>
                                    <select className="input-field py-2.5 px-5 text-sm font-semibold cursor-pointer bg-white border border-border/60 rounded-xl shadow-sm appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="text">Text Input</option>
                                        <option value="number">Number Input</option>
                                        <option value="radio">Single Selection</option>
                                        <option value="array">Multiple Selection</option>
                                        <option value="grouped_array">Grouped List</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Display Layout</label>
                                    <select className="input-field py-2.5 px-5 text-sm font-semibold cursor-pointer bg-white border border-border/60 rounded-xl shadow-sm" value={formData.design_type} onChange={e => setFormData({ ...formData, design_type: e.target.value })}>
                                        <option value="vertical">Vertical List</option>
                                        <option value="grid">Multi-Column Grid</option>
                                        <option value="select">Native Dropdown</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section: Visibility & Logic */}
                        <section className="space-y-8">
                            <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border/60 pb-2">2. Visibility & Logic</h3>
                            
                            <div className="bg-white p-8 rounded-xl border border-border/50 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-medium text-text-tertiary uppercase tracking-wider ml-1">Visible to Attendee Types</label>
                                    <div className="flex flex-wrap gap-2">
                                        {attendeeTypes.map(t => (
                                            <button key={t.id} type="button" onClick={() => setFormData(p => ({ ...p, attendee_types: p.attendee_types.includes(t.id) ? p.attendee_types.filter(x => x !== t.id) : [...p.attendee_types, t.id] }))} className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all ${formData.attendee_types.includes(t.id) ? 'bg-accent text-white border-accent shadow-lg shadow-accent/10' : 'bg-bg-secondary text-text-secondary border-border hover:border-accent/30'}`}>
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-bg-secondary/30 rounded-2xl border border-border/40 group cursor-pointer hover:border-accent/30 transition-all" onClick={() => setFormData({ ...formData, is_mandatory: !formData.is_mandatory })}>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${formData.is_mandatory ? 'bg-accent' : 'bg-bg-tertiary'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${formData.is_mandatory ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary tracking-tight">Mandatory Question</p>
                                        <p className="text-xs text-text-tertiary mt-0.5">Required for registration</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-bg-secondary/30 rounded-2xl border border-border/40 group cursor-pointer hover:border-accent/30 transition-all" onClick={() => setFormData({ ...formData, is_filter: !formData.is_filter })}>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors relative ${formData.is_filter ? 'bg-accent' : 'bg-bg-tertiary'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-md ${formData.is_filter ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary tracking-tight">Use as Filter</p>
                                        <p className="text-xs text-text-tertiary mt-0.5">Allow attendees to filter by this question</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Options Configuration */}
                        {['radio', 'array', 'grouped_array'].includes(formData.type) && (
                            <section className="space-y-8">
                                <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border/60 pb-2">3. Available Options</h3>
                                
                                <div className="bg-white p-8 rounded-xl border border-border/50 shadow-sm relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16" />
                                     
                                     {['radio', 'array'].includes(formData.type) && (
                                         <StandardOptionsSection options={formData.options} onAdd={() => setFormData(p => ({ ...p, options: [...p.options, { name: '' }] }))} onRemove={i => setFormData(p => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }))} onUpdate={editOpt} />
                                     )}
                                     {formData.type === 'grouped_array' && (
                                         <GroupedOptionsSection options={formData.options} onAddGroup={() => setFormData(p => ({ ...p, options: [...p.options, { name: '', values: [{ name: '' }] }] }))} onRemoveGroup={i => setFormData(p => ({ ...p, options: p.options.filter((_, idx) => idx !== i) }))} onUpdateGroup={editOpt} onAddValue={gi => { const n = [...formData.options]; n[gi].values.push({ name: '' }); setFormData({ ...formData, options: n }); }} onRemoveValue={(gi, vi) => { const n = [...formData.options]; n[gi].values.splice(vi, 1); setFormData({ ...formData, options: n }); }} onUpdateValue={editGValue} />
                                     )}
                                </div>
                            </section>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MatchmakingQuestionModal;
