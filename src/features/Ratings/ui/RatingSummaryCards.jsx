import { formatAverage } from '../domain/ratingColors';
import RatingDistribution from './RatingDistribution';
import RatingStars from './RatingStars';

function Card({ title, children }) {
  return (
    <div className="bg-bg-primary border border-border rounded-xl p-4 shadow-sm">
      <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-2">{title}</div>
      {children}
    </div>
  );
}

function Stat({ average, total, empty }) {
  if (!total) return <p className="text-sm text-text-tertiary m-0">{empty}</p>;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-text-primary tabular-nums">{formatAverage(average)}</span>
        <span className="text-sm text-text-tertiary">/ 5 · {total} rating{total === 1 ? '' : 's'}</span>
      </div>
      <RatingStars value={average} size={18} />
    </div>
  );
}

/** `analytics` follows the list filters; `profile` is the person's overall profile rating. */
export default function RatingSummaryCards({ analytics, profile }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Ratings shown">
        <Stat average={analytics.average} total={analytics.total} empty="No ratings match these filters." />
      </Card>
      <Card title="Profile rating">
        <Stat average={profile.average} total={profile.total} empty="Nobody has rated this profile yet." />
      </Card>
      <Card title="Spread">
        <RatingDistribution distribution={analytics.distribution} />
      </Card>
    </div>
  );
}
