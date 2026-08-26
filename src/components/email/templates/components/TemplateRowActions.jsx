import { MoreHorizontal } from 'lucide-react';

/** Opens the template actions modal. */
export default function TemplateRowActions({ template, onOpenActions }) {
  return (
    <button
      type="button"
      className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-secondary border-none bg-transparent cursor-pointer"
      aria-label="Template actions"
      onClick={(e) => {
        e.stopPropagation();
        onOpenActions(template);
      }}
    >
      <MoreHorizontal size={16} />
    </button>
  );
}
