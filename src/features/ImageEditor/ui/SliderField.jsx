export default function SliderField({
  id, label, min, max, value, onChange, onReset, step = 1,
}) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-text-secondary">{label}</label>
        <div className="flex items-center gap-1">
          <input
            id={`${id}-num`}
            type="number"
            className="w-14 input-field py-1 px-1 text-xs"
            min={min}
            max={max}
            step={step}
            value={Math.round(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={`${label} value`}
          />
          {onReset ? (
            <button type="button" className="btn btn-ghost text-[10px] px-1.5 py-1" onClick={onReset}>
              Reset
            </button>
          ) : null}
        </div>
      </div>
      <input
        id={id}
        type="range"
        className="ie-range w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  );
}
