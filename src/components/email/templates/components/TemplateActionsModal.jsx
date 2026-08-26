import { Eye, Trash2, X } from 'lucide-react';

function Action({ icon: Icon, label, danger, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium rounded-xl border transition-colors ${
        danger
          ? 'text-danger bg-danger/5 hover:bg-danger hover:text-white border-danger/20'
          : 'text-text-primary bg-bg-primary hover:bg-bg-secondary border-border'
      }`}
    >
      <Icon size={16} className="shrink-0" />
      {label}
    </button>
  );
}

export default function TemplateActionsModal({
  template,
  onClose,
  onView,
  onDelete,
}) {
  if (!template) return null;

  const pick = (fn) => {
    onClose();
    fn?.(template);
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-bg-primary rounded-2xl shadow-2xl border border-border w-full max-w-sm overflow-hidden">
        <header className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-text-primary truncate">
              {template.email_name || 'Template actions'}
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 truncate">
              {template.subject || '(No subject)'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary rounded-lg border-none bg-transparent cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-4 flex flex-col gap-2">
          <Action icon={Eye} label="View template" onClick={() => pick(onView)} />
          <Action icon={Trash2} label="Delete template" danger onClick={() => pick(onDelete)} />
        </div>
      </div>
    </div>
  );
}
