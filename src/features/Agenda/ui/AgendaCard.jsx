import React from 'react';
import { MapPin, Clock, Edit2, Trash2, ChevronRight } from 'lucide-react';

const AgendaCard = ({ item, onEdit, onDelete, onView }) => {
    return (
        <div className="bg-bg-primary p-5 rounded-2xl border border-border shadow-md transition-all duration-400 group relative overflow-hidden flex flex-col hover:-translate-y-1 hover:border-accent/20 hover:shadow-premium">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] py-1.5 px-3 bg-accent/5 text-accent rounded-lg border border-accent/10 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                    {item.track_title || 'General'}
                </span>
                <div className="flex gap-2">
                    <button
                        className="p-2.5 rounded-xl bg-bg-secondary text-text-tertiary border border-border transition-all duration-200 hover:text-accent hover:bg-bg-primary hover:border-accent hover:scale-110 shadow-sm"
                        onClick={() => onEdit(item)}
                        title="Edit Session"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="p-2.5 rounded-xl bg-bg-secondary text-text-tertiary border border-border transition-all duration-200 hover:text-danger hover:bg-bg-primary hover:border-danger hover:scale-110 shadow-sm"
                        onClick={() => onDelete(item.id)}
                        title="Delete Session"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <h3 className="text-base font-black text-text-primary mb-4 leading-tight tracking-tight group-hover:text-accent transition-colors line-clamp-2 min-h-[3rem] uppercase break-words">
                {item.title}
            </h3>

            <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2.5 text-[11px] text-text-secondary font-bold group/item">
                    <MapPin size={14} className="text-accent" />
                    <span className="tracking-tight">{item.location || 'Central Plaza'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] text-text-secondary font-bold group/item">
                    <Clock size={14} className="text-accent" />
                    <span className="tabular-nums tracking-tight">{item.date} • {item.start} - {item.end}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">Speakers</span>
                    <div className="flex items-center">
                        {item.speaker && item.speaker.length > 0 ? (
                            <>
                                {item.speaker.slice(0, 3).map((s, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-xl border-[2.5px] border-bg-primary overflow-hidden shadow-sm bg-bg-secondary transition-transform group-hover:scale-110 shrink-0"
                                        style={{ marginLeft: i > 0 ? '-10px' : '0', zIndex: 3 - i }}
                                    >
                                        {s.speaker_image ? (
                                            <img
                                                src={s.speaker_image}
                                                className="w-full h-full object-cover"
                                                alt={s.speaker_name || "Speaker"}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="w-full h-full bg-bg-tertiary flex items-center justify-center text-[9px] font-black text-text-tertiary" style={{ display: s.speaker_image ? 'none' : 'flex' }}>
                                            {(s.speaker_name || '?').charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                                {item.speaker.length > 3 && (
                                    <div className="w-8 h-8 rounded-xl border-[2.5px] border-bg-primary bg-bg-tertiary flex items-center justify-center text-[9px] font-black text-text-tertiary shrink-0" style={{ marginLeft: '-10px', zIndex: 0 }}>
                                        +{item.speaker.length - 3}
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-xs font-bold text-text-tertiary italic">TBA</span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {item.enrollable && (
                        <span className="bg-success/10 text-success border border-success/20 text-[8px] font-black py-0.5 px-2.5 rounded-md uppercase tracking-[0.15em] shadow-sm">
                            Joinable
                        </span>
                    )}
                    <button
                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-colors group/btn"
                        onClick={() => onView(item)}
                    >
                        View Detail <ChevronRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgendaCard;
