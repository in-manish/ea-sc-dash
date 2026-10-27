/** Label, control and inline error. `hint` shows under the control when there is no error. */
export default function RatingField({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">{label}</span>
      <div className="mt-1">{children}</div>
      {error ? (
        <span className="text-xs text-red-600 mt-1 block">{error}</span>
      ) : hint ? (
        <span className="text-xs text-text-tertiary mt-1 block">{hint}</span>
      ) : null}
    </label>
  );
}
