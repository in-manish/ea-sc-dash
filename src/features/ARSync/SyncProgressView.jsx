import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';

const SyncProgressView = ({ progress, results, onRetry, onDone }) => {
    const total = progress.total || 0;
    const completed = progress.completed || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isFinished = completed === total;
    const failedItems = results.filter(r => r.status === 'failed');

    return (
        <div className="p-6 flex flex-col h-full overflow-hidden">
            <h3 className="text-lg font-bold mb-6">Syncing Requirements...</h3>

            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-text-secondary uppercase">{completed} / {total} Items</span>
                    <span className="text-2xl font-black text-accent">{percentage}%</span>
                </div>
                <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden border border-border">
                    <div
                        className="h-full bg-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-6">
                {results.map((res, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-border/50">
                        {res.status === 'pending' && <Loader2 size={16} className="animate-spin text-text-tertiary" />}
                        {res.status === 'success' && <CheckCircle2 size={16} className="text-emerald-500" />}
                        {res.status === 'failed' && <AlertCircle size={16} className="text-red-500" />}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{res.name}</p>
                            {res.error && <p className="text-[10px] text-red-500 font-bold uppercase">{res.error}</p>}
                        </div>
                        {res.status === 'failed' && (
                            <button onClick={() => onRetry(res)} className="p-1.5 hover:bg-red-100 text-red-500 rounded-md transition-colors">
                                <RefreshCcw size={14} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                {isFinished && (
                    <button onClick={onDone} className="w-full btn btn-primary py-3 font-bold shadow-lg">
                        Close & Refresh
                    </button>
                )}
            </div>
        </div>
    );
};

export default SyncProgressView;
