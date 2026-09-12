export default function ColorField({ id, label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-2 mb-2 text-xs text-text-secondary" htmlFor={id}>
      <span>{label}</span>
      <span className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          className="w-8 h-8 p-0 border border-border rounded cursor-pointer bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className="input-field py-1 px-2 w-24 text-xs"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} hex`}
        />
      </span>
    </label>
  );
}
