import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  catalogStats,
  filterCatalogQuestions,
  parsePreviewCatalog,
} from '../domain/parsePreviewCatalog';
import AiPresetPreviewCopyButton from './AiPresetPreviewCopyButton';
import AiPresetPreviewPromptPane from './AiPresetPreviewPromptPane';

const fieldClass =
  'rounded-lg border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent';

export default function AiPresetPreviewCatalog({ catalog }) {
  const questions = useMemo(() => parsePreviewCatalog(catalog), [catalog]);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(() => new Set());
  const visible = useMemo(() => filterCatalogQuestions(questions, query), [questions, query]);
  const { questionCount, optionCount } = catalogStats(questions);

  if (!questions.length) {
    return <AiPresetPreviewPromptPane text={catalog || '—'} />;
  }

  const allCollapsed = collapsed.size === questions.length;
  const toggleAll = () => {
    setCollapsed(allCollapsed ? new Set() : new Set(questions.map((q) => q.questionId)));
  };
  const toggleOne = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2">
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <input
          className={`${fieldClass} flex-1 min-w-[180px]`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions or options"
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
        <span className="text-xs text-text-tertiary">
          {questionCount} questions · {optionCount} options
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={toggleAll}>
          {allCollapsed ? 'Expand all' : 'Collapse all'}
        </button>
        <AiPresetPreviewCopyButton text={catalog || ''} />
      </div>
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar border border-border rounded-lg bg-bg-secondary">
        {visible.length === 0 ? (
          <p className="text-sm text-text-tertiary px-4 py-6 m-0">No matches.</p>
        ) : (
          visible.map((item) => (
            <CatalogQuestion
              key={item.questionId}
              item={item}
              open={!collapsed.has(item.questionId)}
              onToggle={() => toggleOne(item.questionId)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CatalogQuestion({ item, open, onToggle }) {
  const Icon = open ? ChevronDown : ChevronRight;
  return (
    <section className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start gap-2 px-3 py-2.5 text-left bg-transparent border-none cursor-pointer hover:bg-bg-primary/60"
      >
        <Icon size={16} className="shrink-0 mt-0.5 text-text-tertiary" />
        <span className="text-xs font-mono text-text-tertiary shrink-0">Q {item.questionId}</span>
        <span className="text-sm text-text-primary flex-1">{item.title}</span>
        <span className="text-[11px] text-text-tertiary shrink-0">{item.options.length}</span>
      </button>
      {open ? (
        <ul className="m-0 pl-0 pb-2 list-none">
          {item.options.map((opt) => (
            <li
              key={opt.id}
              className="grid grid-cols-[72px_1fr] gap-x-3 px-10 py-0.5 text-xs font-mono"
            >
              <span className="text-text-tertiary tabular-nums">{opt.id}</span>
              <span className="text-text-primary break-words">{opt.name}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
