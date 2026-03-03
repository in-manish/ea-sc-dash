import React from 'react';
import { X, Calendar, Clock, MapPin, Users } from 'lucide-react';

const AgendaViewModal = ({ isOpen, onClose, selectedAgenda }) => {
    if (!isOpen || !selectedAgenda) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-text-primary/40 backdrop-blur-md animate-backdrop-smooth" onClick={onClose} />

            <div className="relative bg-bg-primary rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-modal-smooth mesh-bg border border-white/50 my-auto">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left Side: Summary & Image */}
                    <div className="bg-accent p-8 text-white flex flex-col relative overflow-hidden mesh-bg-cosmic">
                        <div className="absolute inset-0 glossy-overlay opacity-30" />
                        <div className="relative z-10 flex flex-col h-full">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] py-2 px-4 bg-white/20 backdrop-blur-md text-white rounded-lg border border-white/20 self-start mb-8 w-fit">
                                {selectedAgenda.track_title || 'General'}
                            </span>

                            <h1 className="text-3xl font-black leading-tight tracking-tight mb-6">
                                {selectedAgenda.title}
                            </h1>

                            <div className="space-y-4 mt-auto">
                                <div className="flex items-center gap-4 p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                    <div className="p-2.5 rounded-lg bg-white text-accent">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Scheduled Date</div>
                                        <div className="font-black text-xs">{selectedAgenda.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                    <div className="p-2.5 rounded-lg bg-white text-accent">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Session Window</div>
                                        <div className="font-black text-xs">{selectedAgenda.start} - {selectedAgenda.end}</div>
                                    </div>
                                </div>
                                {selectedAgenda.location && (
                                    <div className="flex items-center gap-4 p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                        <div className="p-2.5 rounded-lg bg-white text-accent">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-0.5">Location Hub</div>
                                            <div className="font-black text-xs">{selectedAgenda.location}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details & Speakers */}
                    <div className="p-8 relative z-10 bg-white/40 backdrop-blur-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button className="absolute top-6 right-6 p-2 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-all" onClick={onClose}>
                            <X size={20} />
                        </button>

                        {selectedAgenda.description && (
                            <div className="mb-8 mt-2">
                                <h4 className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] mb-4 flex items-center gap-3 after:content-[''] after:h-px after:flex-1 after:bg-border/50">Abstract</h4>
                                <div className="text-text-secondary leading-relaxed text-xs font-medium bg-white/50 p-5 rounded-2xl border border-border/50">
                                    {selectedAgenda.description}
                                </div>
                            </div>
                        )}

                        {selectedAgenda.speaker && selectedAgenda.speaker.length > 0 && (
                            <div>
                                <h4 className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] mb-4 flex items-center gap-3 after:content-[''] after:h-px after:flex-1 after:bg-border/50">Session Contributors</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedAgenda.speaker.map((s, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300 group">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border-[3px] border-bg-secondary shadow-sm transition-transform group-hover:scale-105">
                                                {s.speaker_image ? (
                                                    <img src={s.speaker_image} alt={s.speaker_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-bg-tertiary flex items-center justify-center">
                                                        <Users size={24} className="text-text-tertiary" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-black text-xs text-text-primary truncate">{s.speaker_name}</h5>
                                                {s.speaker_designation && (
                                                    <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest truncate mt-0.5">{s.speaker_designation}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendaViewModal;
