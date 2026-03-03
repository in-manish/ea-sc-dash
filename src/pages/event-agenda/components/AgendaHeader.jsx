import React from 'react';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

const AgendaHeader = ({ viewMode, setViewMode, search, setSearch, onAddSession }) => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-black text-text-primary tracking-tight">Event Agenda</h1>
                <p className="text-text-secondary text-sm font-medium">Manage sessions, speakers, and event schedule</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                {/* View Switcher */}
                <div className="flex bg-bg-primary/50 backdrop-blur-sm p-1 rounded-xl border border-border shadow-sm">
                    <button
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${viewMode === 'card' ? 'bg-accent text-white shadow-md' : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary'}`}
                        onClick={() => setViewMode('card')}
                        title="Card View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${viewMode === 'row' ? 'bg-accent text-white shadow-md' : 'text-text-tertiary hover:text-text-secondary hover:bg-bg-tertiary'}`}
                        onClick={() => setViewMode('row')}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full sm:w-[280px]">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-border/50 rounded-xl text-sm font-bold focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all shadow-sm placeholder:text-text-tertiary"
                        placeholder="Search sessions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    className="bg-accent text-white px-6 py-2.5 rounded-xl shadow-premium shadow-accent/20 flex items-center gap-2.5 font-black uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-all transform active:scale-95"
                    onClick={onAddSession}
                >
                    <Plus size={16} />
                    <span>Add Session</span>
                </button>
            </div>
        </div>
    );
};

export default AgendaHeader;
