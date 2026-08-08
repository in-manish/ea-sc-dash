import { ShieldCheck, ShieldAlert } from 'lucide-react';

/** Contact field card: value + verify switch only (matches render full-width below). */
export default function EditContactField({
  id,
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  verified,
  onVerifyChange,
  duplicateCount = 0,
}) {
  return (
    <section className="rounded-xl border border-border bg-bg-secondary/30 overflow-hidden">
      <div className="px-4 pt-3.5 pb-2.5 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-bg-primary border border-border flex items-center justify-center text-text-secondary">
          <Icon size={15} />
        </span>
        <label htmlFor={id} className="text-sm font-semibold text-text-primary flex-1">
          {label}
        </label>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            verified
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-bg-primary text-text-tertiary border-border'
          }`}
        >
          {verified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
          {verified ? 'Verified' : 'Unverified'}
        </span>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="input-field text-sm"
          required
        />

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-primary px-3.5 py-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">Mark as verified</p>
            <p className="text-xs text-text-tertiary leading-snug mt-0.5">
              {duplicateCount > 0
                ? `Also used by ${duplicateCount} other user${duplicateCount === 1 ? '' : 's'} — see matches below`
                : 'Confirms this contact belongs to this user'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={verified}
            aria-label={`${label} verified`}
            onClick={() => onVerifyChange(!verified)}
            className={`relative w-12 h-7 rounded-full border-none cursor-pointer transition-colors shrink-0 ${
              verified ? 'bg-accent' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                verified ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
