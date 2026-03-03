import React from 'react';
import { MapPin, Clock, Edit2, Trash2, Eye, Users } from 'lucide-react';

const AgendaRow = ({ item, onEdit, onDelete, onView }) => {
    return (
        <div className="bg-bg-primary py-3 px-6 rounded-xl border border-border shadow-sm transition-all duration-400 flex items-center relative cursor-pointer group hover:shadow-premium hover:-translate-y-0.5 hover:border-accent/40 hover:z-10">
            <div className="flex items-center w-full gap-6 lg:gap-8">
                {/* Track Badge */}
                <div className="w-28 lg:w-32 flex-shrink-0">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] py-1.5 px-3 bg-bg-tertiary text-text-tertiary rounded-lg border border-border transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:border-accent text-center block truncate shadow-sm">
                        {item.track_title || 'General'}
                    </span>
                </div>

                {/* Primary Meta */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-text-primary text-base truncate group-hover:text-accent transition-colors tracking-tight uppercase">
                        {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-6 mt-1 text-[10px] text-text-tertiary font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2.5">
                            <MapPin size={14} className="group-hover:text-accent transition-colors" />
                            <span>{item.location || 'Waitlist'}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Clock size={14} className="group-hover:text-accent transition-colors" />
                            <span className="tabular-nums">{item.date} • {item.start} - {item.end}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Speakers, Status, & Actions */}
                <div className="flex items-center gap-5 lg:gap-8">
                    {/* Speaker Avatars */}
                    <div className="hidden sm:flex items-center">
                        {item.speaker && item.speaker.length > 0 ? (
                            <>
                                {item.speaker.slice(0, 4).map((s, i) => (
                                    <div
                                        key={i}
                                        className="w-9 h-9 rounded-xl border-[2.5px] border-bg-primary overflow-hidden shadow-sm bg-bg-secondary transition-transform group-hover:scale-110 shrink-0 relative"
                                        style={{ marginLeft: i > 0 ? '-14px' : '0', zIndex: 10 - i }}
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
                                        <div className="w-full h-full bg-bg-tertiary flex items-center justify-center text-text-tertiary" style={{ display: s.speaker_image ? 'none' : 'flex' }}>
                                            <Users size={16} />
                                        </div>
                                    </div>
                                ))}
                                {item.speaker.length > 4 && (
                                    <div className="w-9 h-9 rounded-xl border-[2.5px] border-bg-primary bg-bg-tertiary flex items-center justify-center text-[9px] font-black text-text-tertiary shadow-sm shrink-0" style={{ marginLeft: '-14px', zIndex: 0 }}>
                                        +{item.speaker.length - 4}
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-xs font-bold text-text-tertiary italic px-4">TBA</span>
                        )}
                    </div>

                    {/* Joinable Badge */}
                    {item.enrollable && (
                        <span className="hidden md:inline-flex bg-success/10 text-success text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-success/20 whitespace-nowrap">
                            Joinable
                        </span>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 p-1 bg-bg-tertiary/30 rounded-xl border border-border group-hover:border-accent/20 transition-all duration-300">
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-text-tertiary hover:text-accent hover:shadow-premium border border-border group-hover:border-accent/40 transition-all active:scale-95"
                            onClick={() => onView(item)}
                            title="View Detail"
                        >
                            <Eye size={16} />
                        </button>
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-text-tertiary hover:text-accent hover:shadow-premium border border-border group-hover:border-accent/40 transition-all active:scale-95"
                            onClick={() => onEdit(item)}
                            title="Edit Session"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-text-tertiary hover:text-danger hover:shadow-premium border border-border group-hover:border-danger/40 transition-all active:scale-95"
                            onClick={() => onDelete(item.id)}
                            title="Delete Session"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendaRow;
