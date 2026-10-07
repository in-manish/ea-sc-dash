import { useState } from 'react';
import { ChevronDown, AlertCircle, Loader2, RefreshCw, ListTree } from 'lucide-react';
import MappingGroupCard from './MappingGroupCard';

export default function MappingListPanel({
    mapping,
    formFilter,
    setFormFilter,
    search,
    setSearch,
}) {
    const [sectionOpen, setSectionOpen] = useState(true);
    const [openIds, setOpenIds] = useState(() => new Set());

    const toggleQuestion = (id) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <section className="p-5 bg-bg-primary rounded-lg border border-border space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setSectionOpen((v) => !v)}
                    className="text-left min-w-0 flex-1 bg-transparent border-none p-0 cursor-pointer"
                    aria-expanded={sectionOpen}
                >
                    <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <ChevronDown
                            size={18}
                            className={`text-text-tertiary transition-transform ${sectionOpen ? '' : '-rotate-90'}`}
                        />
                        <ListTree size={18} className="text-accent" />
                        2. Saved mappings
                        {!sectionOpen && mapping.count > 0 && (
                            <span className="text-xs font-medium text-text-tertiary">
                                ({mapping.count} question{mapping.count === 1 ? '' : 's'})
                            </span>
                        )}
                    </h3>
                    {sectionOpen && (
                        <p className="text-xs text-text-tertiary mt-1 pl-7">
                            Grouped by EA question. Forms dropdown ignores search/form filters.
                        </p>
                    )}
                </button>
                {sectionOpen && (
                    <button
                        type="button"
                        onClick={mapping.refresh}
                        disabled={mapping.loading}
                        className="btn btn-secondary btn-sm gap-2"
                    >
                        <RefreshCw size={14} className={mapping.loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                )}
            </div>

            {sectionOpen && (
                <>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-sm block">
                            <span className="text-xs font-semibold text-text-secondary">Form</span>
                            <select
                                value={formFilter}
                                onChange={(e) => setFormFilter(e.target.value)}
                                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-secondary"
                            >
                                <option value="">All forms</option>
                                {(mapping.forms || []).map((form) => (
                                    <option key={form} value={form}>{form}</option>
                                ))}
                            </select>
                        </label>
                        <label className="text-sm block">
                            <span className="text-xs font-semibold text-text-secondary">Search</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="EA / SurveyJS title or key"
                                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg-secondary"
                            />
                        </label>
                    </div>

                    {mapping.error && (
                        <div className="p-3 bg-status-danger/5 border border-status-danger/10 rounded-lg flex items-center gap-2 text-status-danger text-sm">
                            <AlertCircle size={16} />
                            {mapping.error}
                        </div>
                    )}

                    {mapping.loading && !mapping.results.length ? (
                        <div className="flex items-center justify-center py-10 text-text-tertiary gap-2 text-sm">
                            <Loader2 className="animate-spin text-accent" size={20} />
                            Loading mappings…
                        </div>
                    ) : mapping.results.length === 0 ? (
                        <p className="text-sm text-text-secondary py-6 text-center">
                            No mappings yet. Upload a CSV above to create them.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-text-tertiary">
                                {mapping.count} EA question{mapping.count === 1 ? '' : 's'}
                            </p>
                            <div className="space-y-3 max-h-[480px] overflow-y-auto">
                                {mapping.results.map((group) => (
                                    <MappingGroupCard
                                        key={group.question_id}
                                        group={group}
                                        open={openIds.has(group.question_id)}
                                        onToggle={() => toggleQuestion(group.question_id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
