export default function ToolButton({
  label, icon: Icon, active, onClick, disabled, shortcut,
}) {
  return (
    <button
      type="button"
      className={`ie-tooltip flex items-center justify-center w-9 h-9 rounded-md border-none transition-colors ${
        active
          ? 'bg-accent text-accent-text'
          : 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
      } disabled:opacity-40`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      {Icon ? <Icon size={18} strokeWidth={1.8} /> : <span className="text-[10px] font-semibold">{label}</span>}
    </button>
  );
}
