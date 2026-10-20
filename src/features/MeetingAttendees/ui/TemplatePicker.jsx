import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import TemplateCard from './TemplateCard';

/** Searchable list of template cards for one attendee type. */
export default function TemplatePicker({ templates, selectedId, recommendedId, onSelect, onHover, onLeave }) {
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return templates;
    return templates.filter((item) => `${item.name} ${item.subject}`.toLowerCase().includes(needle));
  }, [templates, query]);

  return (
    <div className="flex flex-col gap-2 min-h-0">
      <label className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates"
          className="w-full pl-8 pr-3 py-2 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
        />
      </label>
      <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: '340px' }}>
        {visible.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={String(template.id) === String(selectedId)}
            recommended={String(template.id) === String(recommendedId)}
            onSelect={onSelect}
            onHover={onHover}
            onLeave={onLeave}
          />
        ))}
        {visible.length === 0 && <p className="text-xs text-text-tertiary m-0">No template matches “{query}”.</p>}
      </div>
    </div>
  );
}
