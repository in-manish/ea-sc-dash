import React from 'react';
import { Loader2, MessageSquarePlus, Search } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { CATEGORY_OPTIONS, STATUS_CHOICES, STATUS_FILTER_ALL } from '../constants';

const fieldClass =
    'rounded-xl border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all';

const TemplateList = ({
    templates,
    isLoading,
    category,
    statusFilter,
    search,
    onCategoryChange,
    onStatusFilterChange,
    onSearchChange,
    onView,
    onEdit,
    onCreate,
}) => {
    const filtered = templates.filter((t) => {
        if (statusFilter !== STATUS_FILTER_ALL) {
            const status = (t.status || 'pending').toLowerCase();
            if (status !== statusFilter) return false;
        }
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            const haystack = `${t.template_name || ''} ${t.description || ''} ${t.msg_text || ''}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                <div className="inline-flex p-1 rounded-xl bg-bg-secondary border border-border">
                    {CATEGORY_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onCategoryChange(opt.value)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                category === opt.value
                                    ? 'bg-bg-primary text-accent shadow-sm'
                                    : 'text-text-tertiary hover:text-text-secondary'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-1 flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search templates…"
                            className={`${fieldClass} w-full pl-9`}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        className={`${fieldClass} sm:w-[200px] font-medium`}
                        aria-label="Filter by status"
                    >
                        <option value={STATUS_FILTER_ALL}>All statuses</option>
                        {STATUS_CHOICES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16 text-text-tertiary">
                    <Loader2 className="animate-spin" size={28} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-border bg-bg-secondary/40">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
                        <MessageSquarePlus size={22} />
                    </div>
                    <h3 className="text-base font-bold text-text-primary">
                        {templates.length === 0 ? 'No templates yet' : 'No matching templates'}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-tertiary max-w-sm mx-auto">
                        {templates.length === 0
                            ? 'Create your first WhatsApp template to start messaging attendees or companies.'
                            : 'Try a different search, category, or status filter.'}
                    </p>
                    {templates.length === 0 && (
                        <button
                            type="button"
                            onClick={onCreate}
                            className="btn btn-primary mt-6 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                        >
                            Create template
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((t) => (
                        <TemplateCard
                            key={t.id}
                            template={t}
                            onView={onView}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TemplateList;
