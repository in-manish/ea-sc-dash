import React from 'react';
import { ImageIcon, Printer, X, ArrowRightLeft } from 'lucide-react';

const FullscreenPreview = ({
    isFullscreenPreviewOpen,
    setIsFullscreenPreviewOpen,
    fullscreenPreviewType,
    selectedType,
    isBadgeFlipped,
    setIsBadgeFlipped,
    getFullUrl
}) => {
    if (!isFullscreenPreviewOpen) return null;

    return (
        <div className="fixed inset-0 mesh-bg-cosmic animate-mesh z-[2000] flex flex-col animate-fade-in text-white">
            <div className="p-8 flex justify-between items-center glass-dark m-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10">
                <div className="flex items-center gap-8">
                    <div className="p-4 bg-accent/20 rounded-2xl border border-accent/30 shadow-inner">
                        <ImageIcon size={28} className="text-accent" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase mb-1">
                            {fullscreenPreviewType === 'badge' ? selectedType.name : 'Master Template'}
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                                {fullscreenPreviewType === 'badge' ? 'Physical Badge Synchronization' : 'Digital Content Distribution'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => window.print()}
                        className="px-10 py-4 bg-white text-black hover:bg-slate-100 rounded-2xl transition-all flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95"
                    >
                        <Printer size={20} /> Print Selection
                    </button>
                    <button
                        onClick={() => setIsFullscreenPreviewOpen(false)}
                        className="p-4 bg-white/5 hover:bg-white/20 border border-white/10 rounded-2xl transition-all active:rotate-90 duration-500 hover:scale-110"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-16 flex items-center justify-center">
                <div id="badge-print-area" className={`relative ${fullscreenPreviewType === 'badge' ? 'h-[85vh] aspect-[3/4.2]' : 'w-full max-w-5xl'} shadow-[0_80px_160px_-40px_rgba(0,0,0,0.8)] rounded-[4rem] overflow-hidden paper-canvas group/full animate-slide-up`}>
                    <div className="absolute inset-0 glossy-overlay z-10 opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-white/5 pointer-events-none z-10" />
                    <img
                        src={getFullUrl(
                            fullscreenPreviewType === 'badge'
                                ? (isBadgeFlipped ? selectedType.badge_back : selectedType.badge_front)
                                : selectedType.email_badge_template
                        )}
                        className="w-full h-full object-contain relative z-5 p-2"
                        alt="Full Preview"
                    />
                    {fullscreenPreviewType === 'badge' && (
                        <button
                            onClick={() => setIsBadgeFlipped(!isBadgeFlipped)}
                            className="absolute bottom-16 left-1/2 -translate-x-1/2 px-12 py-5 bg-black/80 backdrop-blur-2xl text-white rounded-full font-black text-xs uppercase tracking-[0.4em] border border-white/20 opacity-0 group-hover/full:opacity-100 transition-all duration-500 hover:bg-accent flex items-center gap-4 shadow-2xl translate-y-8 group-hover/full:translate-y-0 z-20"
                        >
                            <ArrowRightLeft size={20} /> Flip Surface
                        </button>
                    )}
                </div>
            </div>

            <div className="p-10 bg-slate-950/60 backdrop-blur-2xl border-t border-white/5">
                <div className="flex items-center justify-center gap-16">
                    <div className="text-center">
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">Category Type</p>
                        <p className="text-sm font-black text-white/90 tracking-widest">
                            {fullscreenPreviewType === 'badge' ? 'PHYSICAL_ASSET' : 'DIGITAL_TEMPLATE'}
                        </p>
                    </div>
                    <div className="w-px h-12 bg-white/5" />
                    <div className="text-center">
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">Sync Status</p>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-success" />
                            <p className="text-sm font-black text-success uppercase tracking-widest">Live Engine</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullscreenPreview;
