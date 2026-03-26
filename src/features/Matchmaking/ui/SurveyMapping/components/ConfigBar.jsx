import React from 'react';
import { Globe, RefreshCw, AlertCircle, Code, CheckCircle2 } from 'lucide-react';

const ConfigBar = ({ 
    formValue, setFormValue, 
    fetchSurveyForm, fetchingForm, 
    error, setShowGlobalJson,
    mappedCount, totalCount
}) => {
    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1 px-1">Source Form</label>
                    <div className="flex gap-2">
                        <div className="relative group">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Enter Form Value (e.g. municipalika-trade_visitor)"
                                className="pl-9 pr-4 py-2.5 bg-bg-secondary/50 border border-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all outline-none min-w-[320px]"
                                value={formValue}
                                onChange={(e) => setFormValue(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={fetchSurveyForm}
                            disabled={fetchingForm}
                            className="px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {fetchingForm ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                            {fetchingForm ? 'Fetching...' : 'Fetch Form'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 divide-x divide-border">
                {error && (
                    <div className="flex items-center gap-2 text-status-danger text-[10px] font-bold bg-status-danger/5 px-4 py-2 rounded-full border border-status-danger/10 animate-shake">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}
                <div className="flex items-center gap-3 px-6">
                    <button 
                        onClick={() => setShowGlobalJson(true)}
                        className="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center border border-slate-800 shadow-lg hover:scale-110 active:scale-95 transition-all group relative"
                        title="View Raw JSON Payload"
                    >
                        <Code size={18} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse" />
                    </button>
                    <div>
                        <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Live Payload</p>
                        <p className="text-[11px] font-bold text-text-primary">Preview Body</p>
                    </div>
                </div>
                <div className="flex flex-col items-end px-6">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Mapping Progress</span>
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-bg-secondary rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-success transition-all duration-500 rounded-full" 
                                style={{ width: `${totalCount ? (mappedCount / totalCount) * 100 : 0}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-text-primary">{mappedCount}/{totalCount}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 pl-6">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                        <CheckCircle2 className="text-success" size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Backend Sync</p>
                        <p className="text-[10px] text-success font-medium">Ready to sync changes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigBar;
