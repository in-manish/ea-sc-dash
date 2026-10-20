import { Check } from 'lucide-react';
import { htmlToSnippet } from '../domain/templateText';

export default function TemplateCard({ template, selected, recommended, onSelect, onHover, onLeave }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={onLeave}
      className={`text-left p-3 rounded-lg border transition-colors cursor-pointer w-full ${
        selected ? 'border-accent bg-accent/5' : 'border-border bg-bg-primary hover:border-accent/60 hover:bg-bg-secondary'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-text-primary">
          {template.name}
          {recommended && <span className="ml-2 text-[0.65rem] px-1.5 py-0.5 rounded bg-green-100 text-green-700">For this type</span>}
        </span>
        {selected && <Check size={16} className="text-accent shrink-0" />}
      </div>
      {template.subject && (
        <p className="m-0 mt-1 text-xs text-text-secondary truncate">Subject: {template.subject}</p>
      )}
      <p className="m-0 mt-1 text-xs text-text-tertiary line-clamp-2">
        {htmlToSnippet(template.content) || 'No content'}
      </p>
    </button>
  );
}
