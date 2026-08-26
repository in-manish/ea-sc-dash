/** Show children when the parent `tr.group` is hovered or an action is focused. */
export const HOVER_REVEAL =
  'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100 transition-opacity duration-150';

/** Compact filled pill for table-row hover actions. */
export default function HoverActionButton({
  children,
  onClick,
  variant = 'accent',
  disabled = false,
}) {
  const tone = {
    accent: 'bg-accent text-white hover:bg-accent-hover',
    ghost: 'bg-transparent text-accent hover:underline px-1.5',
    danger: 'bg-transparent text-danger hover:underline px-1.5',
  }[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={`py-1 px-2.5 text-xs font-medium rounded-full border-none cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${tone}`}
    >
      {children}
    </button>
  );
}
