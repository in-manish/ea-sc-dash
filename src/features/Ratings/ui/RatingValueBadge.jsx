import { colorForValue } from '../domain/ratingColors';

/** A coloured dot and the rating number. */
export default function RatingValueBadge({ value, label, scales }) {
  const color = colorForValue(value, scales);
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
        style={{ backgroundColor: color }}
      >
        {value}
      </span>
      {label ? <span className="font-medium text-text-secondary">{label}</span> : null}
    </span>
  );
}
