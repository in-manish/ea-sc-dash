import { CheckCircle2, Plus } from 'lucide-react';
import { meetingTemplateSlug } from '../domain/meetingTemplates';

/** One row per attendee type: template created, or the slug to create it with. */
export default function TypeTemplateStatus({ types, ownTemplates, choices, activeId, onActive, onCreate }) {
  return (
    <div className="flex flex-col gap-2">
      {types.map((type) => {
        const own = ownTemplates[type.id];
        const active = type.id === activeId;
        return (
          <div
            key={type.id}
            className={`flex flex-wrap items-center gap-3 p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border bg-bg-primary'}`}
          >
            <button type="button" onClick={() => onActive(type.id)} className="bg-transparent border-none cursor-pointer p-0 text-left min-w-[10rem]">
              <span className="text-sm font-semibold text-text-primary">{type.name}</span>
              {choices[type.id] && <span className="ml-2 text-xs text-accent">selected</span>}
            </button>
            {own ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                <CheckCircle2 size={14} /> Template already created: {own.name}
              </span>
            ) : (
              <span className="text-xs text-amber-700">
                No template yet. Slug: <code className="px-1 rounded bg-bg-secondary">{meetingTemplateSlug(type.name)}</code>
              </span>
            )}
            {!own && (
              <button type="button" className="btn btn-secondary ml-auto inline-flex items-center gap-1 text-xs" onClick={() => onCreate(type)}>
                <Plus size={12} /> Create template
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
