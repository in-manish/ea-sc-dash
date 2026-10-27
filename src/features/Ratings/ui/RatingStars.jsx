import { Star } from 'lucide-react';

/** Five stars, filled to `value` (partial stars are clipped). */
export default function RatingStars({ value, size = 16 }) {
  const width = Math.max(0, Math.min(5, value)) * size;
  const row = (className) => (
    <span className={`flex ${className}`} style={{ width: size * 5 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} className="shrink-0" fill="currentColor" />
      ))}
    </span>
  );
  return (
    <span className="relative inline-block align-middle" aria-label={`${value} out of 5`} role="img">
      <span className="text-border">{row('')}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden text-amber-400" style={{ width }}>
        {row('')}
      </span>
    </span>
  );
}
