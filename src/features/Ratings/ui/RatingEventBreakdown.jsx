import { formatAverage } from '../domain/ratingColors';
import RatingStars from './RatingStars';

/** Interaction ratings (meetings and similar), one block per event, newest first. */
export default function RatingEventBreakdown({ events }) {
  if (!events.length) return null;
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text-primary m-0">By event</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {events.map((event) => (
          <div key={event.eventId} className="border border-border rounded-xl p-4 bg-bg-primary">
            <div className="text-sm font-semibold text-text-primary mb-2 truncate" title={event.eventName}>
              {event.eventName}
            </div>
            <ul className="m-0 p-0 list-none flex flex-col gap-2">
              {event.types.map((type) => (
                <li key={type.key} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-text-secondary">{type.label}</span>
                  <span className="flex items-center gap-2">
                    <RatingStars value={type.average} size={13} />
                    <span className="font-semibold text-text-primary tabular-nums">{formatAverage(type.average)}</span>
                    <span className="text-text-tertiary text-xs">({type.total})</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
