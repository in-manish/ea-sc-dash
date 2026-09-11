import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

const AgendaListErrorBanner = ({ message, onRetry, onDismiss }) => (
  <div
    role="alert"
    className="p-5 bg-status-danger/5 border border-status-danger/10 rounded-[2rem] flex flex-col sm:flex-row sm:items-center gap-4 text-status-danger shadow-sm"
  >
    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
      <div className="p-1.5 bg-status-danger/10 rounded-full shrink-0">
        <AlertCircle size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.2em]">Couldn’t load agenda</p>
        <p className="mt-1 text-sm font-medium text-status-danger/90 break-words">
          {message || 'Something went wrong while fetching sessions.'}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-status-danger/20 bg-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-status-danger/10 transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="p-2 hover:bg-status-danger/10 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  </div>
);

export default AgendaListErrorBanner;
