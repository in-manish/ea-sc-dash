import React from 'react';
import { Code, X, Copy } from 'lucide-react';

const PayloadModal = ({ showGlobalJson, setShowGlobalJson, generatePayload }) => {
    if (!showGlobalJson) return null;

    const payload = generatePayload();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowGlobalJson(false)} />
            <div className="relative w-full max-w-3xl bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center border border-accent/30 text-accent">
                            <Code size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">Final Request Body</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">MATCHMAKING_SYCHRONIZATION_PAYLOAD.JSON</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowGlobalJson(false)}
                        className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} className="mx-auto" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent">
                    <pre className="text-[13px] font-mono text-emerald-400 leading-relaxed">
                        {JSON.stringify(payload, null, 4)}
                    </pre>
                </div>
                <div className="p-8 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl flex justify-end gap-4">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                            alert('Payload copied to clipboard!');
                        }}
                        className="px-6 py-3 bg-slate-800 text-white rounded-2xl text-xs font-bold hover:bg-slate-700 transition-all flex items-center gap-2 border-none cursor-pointer"
                    >
                        <Copy size={16} />
                        Copy JSON
                    </button>
                    <button 
                        onClick={() => setShowGlobalJson(false)}
                        className="px-8 py-3 bg-accent text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-accent/20 transition-all border-none cursor-pointer"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayloadModal;
