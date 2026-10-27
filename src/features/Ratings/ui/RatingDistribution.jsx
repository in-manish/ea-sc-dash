import { colorForValue } from '../domain/ratingColors';

/** One bar per rating value, widest = most ratings. Shows 1–5 even when a value has no ratings. */
export default function RatingDistribution({ distribution }) {
  const counts = new Map(distribution.map((d) => [d.value, d.count]));
  const values = [...new Set([1, 2, 3, 4, 5, ...counts.keys()])].sort((a, b) => b - a);
  const max = Math.max(1, ...counts.values());
  return (
    <div className="flex flex-col gap-2" role="list" aria-label="Ratings by value">
      {values.map((value) => {
        const count = counts.get(value) || 0;
        return (
          <div key={value} role="listitem" className="flex items-center gap-3 text-sm">
            <span className="w-6 text-right font-semibold text-text-secondary">{value}</span>
            <div className="flex-1 h-3 rounded-full bg-bg-tertiary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(count / max) * 100}%`, backgroundColor: colorForValue(value) }}
              />
            </div>
            <span className="w-8 text-text-tertiary tabular-nums">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
