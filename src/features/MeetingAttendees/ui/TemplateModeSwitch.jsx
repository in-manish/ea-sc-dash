const MODES = [
  { value: 'common', label: 'One template for all types', hint: 'Pick one template. Everyone gets the same email.' },
  { value: 'perType', label: 'A template for each type', hint: 'Each attendee type gets its own template.' },
];

/** Two big choices: the same template for every selected attendee type, or one per type. */
export default function TemplateModeSwitch({ mode, onChange }) {
  return (
    <div role="radiogroup" aria-label="How to choose templates" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {MODES.map(({ value, label, hint }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(value)}
            className={`text-left p-3 border rounded-lg transition-colors duration-200 cursor-pointer ${
              active ? 'border-accent bg-accent/5 ring-2 ring-accent/10' : 'border-border bg-bg-primary hover:border-accent'
            }`}
          >
            <span className="block text-sm font-medium text-text-primary">{label}</span>
            <span className="block text-xs text-text-tertiary mt-0.5">{hint}</span>
          </button>
        );
      })}
    </div>
  );
}
