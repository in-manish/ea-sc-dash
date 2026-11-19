import { ORDER_STATUS_OPTIONS } from '../domain/orderStatusOptions';

/** Checkbox chips for the order report's `status` filter. At least one must stay selected to send. */
export default function OrderStatusPicker({ value, onChange, disabled }) {
  const toggle = (status) =>
    onChange(value.includes(status) ? value.filter((s) => s !== status) : [...value, status]);

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Order status</span>
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUS_OPTIONS.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer ${
                checked ? 'border-accent text-accent bg-bg-secondary' : 'border-border text-text-secondary'
              }`}
            >
              <input
                type="checkbox"
                className="m-0"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(opt.value)}
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="text-xs text-status-danger m-0">Pick at least one status.</p>
      )}
    </div>
  );
}
