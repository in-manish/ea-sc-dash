import React from 'react';
import { CalendarPlus, SearchX } from 'lucide-react';

const AgendaListEmptyState = ({ hasSearch, onAddSession, onClearSearch }) => {
  if (hasSearch) {
    return (
      <div className="bg-bg-primary border border-dashed border-border rounded-[2.5rem] shadow-premium p-16 md:p-20 flex flex-col items-center text-center">
        <div className="mb-5 w-14 h-14 rounded-2xl bg-bg-secondary text-text-tertiary flex items-center justify-center">
          <SearchX size={26} />
        </div>
        <h2 className="text-lg font-black text-text-primary tracking-tight">No matching sessions</h2>
        <p className="mt-2 text-sm text-text-secondary font-medium max-w-md">
          Try a different search term, or clear the search to see the full schedule.
        </p>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-8 bg-white border border-border text-text-primary hover:border-accent hover:text-accent font-black uppercase tracking-widest text-[10px] py-3 px-6 rounded-2xl transition-colors"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-bg-primary border border-dashed border-border rounded-[2.5rem] shadow-premium p-16 md:p-20 flex flex-col items-center text-center">
      <div className="mb-5 w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
        <CalendarPlus size={26} />
      </div>
      <h2 className="text-lg font-black text-text-primary tracking-tight">No sessions yet</h2>
      <p className="mt-2 text-sm text-text-secondary font-medium max-w-md">
        Create your first agenda session to start building the event schedule.
      </p>
      {onAddSession && (
        <button
          type="button"
          onClick={onAddSession}
          className="mt-8 bg-accent text-white px-6 py-3 rounded-2xl shadow-premium shadow-accent/20 flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-all transform active:scale-95"
        >
          <CalendarPlus size={16} />
          Add Session
        </button>
      )}
    </div>
  );
};

export default AgendaListEmptyState;
