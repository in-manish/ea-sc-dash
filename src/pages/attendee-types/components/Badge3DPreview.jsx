import React from 'react';
import { ImageIcon, ArrowRightLeft, Plus } from 'lucide-react';

const Badge3DPreview = ({ front, back, isFlipped, onFlip, onExpand, getFullUrl }) => {
    const frontUrl = getFullUrl(front);
    const backUrl = getFullUrl(back);

    return (
        <div className="relative group perspective-1000 w-full max-w-[300px] aspect-[3/4.2] mx-auto animate-float">
            <div
                className={`relative w-full h-full transition-transform duration-1000 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                onClick={onFlip}
            >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden rounded-[2.5rem] border border-white/50 glass shadow-premium overflow-hidden paper-canvas">
                    <div className="absolute inset-0 glossy-overlay z-10 opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
                    {frontUrl ? (
                        <img src={frontUrl} className="w-full h-full object-contain relative z-5" alt="Front" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-bg-secondary/30 text-text-tertiary">
                            <ImageIcon size={48} className="mb-3 opacity-20" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Front Canvas</span>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-md p-3 text-[10px] text-center font-bold text-white uppercase tracking-widest z-20">Front Side</div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[2.5rem] border border-white/50 glass shadow-premium overflow-hidden paper-canvas">
                    <div className="absolute inset-0 glossy-overlay z-10 opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />
                    {backUrl ? (
                        <img src={backUrl} className="w-full h-full object-contain relative z-5" alt="Back" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-bg-secondary/30 text-text-tertiary">
                            <ImageIcon size={48} className="mb-3 opacity-20" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">Back Canvas</span>
                        </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-md p-3 text-[10px] text-center font-bold text-white uppercase tracking-widest z-20">Reverse Side</div>
                </div>
            </div>

            <div className="absolute -bottom-16 inset-x-0 flex justify-center gap-4">
                <button
                    onClick={onFlip}
                    className="p-3.5 glass hover:bg-white border-white/50 rounded-2xl shadow-premium hover:shadow-2xl hover:scale-110 transition-all text-text-secondary hover:text-accent group"
                    title="Flip Badge"
                >
                    <ArrowRightLeft size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
                <button
                    onClick={onExpand}
                    className="p-3.5 glass hover:bg-white border-white/50 rounded-2xl shadow-premium hover:shadow-2xl hover:scale-110 transition-all text-text-secondary hover:text-accent group"
                    title="View Fullscreen"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>
        </div>
    );
};

export default Badge3DPreview;
