import { useMemo, useState } from 'react';
import { allEventIds, matchesEventSearch } from '../domain/organizerEvents';
import { toggleEventId, uniqueIds } from '../domain/meetingStatsQuery';

export default function MeetingStatsEventPicker({
  events = [],
  loading = false,
  selectedIds = [],
  currentEventId,
  onChange,
}) {
  const [query, setQuery] = useState('');
  const currentId = Number(currentEventId);
  const visible = useMemo(
    () => events.filter((event) => matchesEventSearch(event, query)),
    [events, query],
  );

  const toggle = (id) => onChange(toggleEventId(selectedIds, id));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-text-secondary">Events</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="text-xs font-medium text-accent hover:underline bg-transparent border-none cursor-pointer p-0"
            onClick={() => onChange(allEventIds(events))}
            disabled={loading || events.length === 0}
          >
            Select all
          </button>
          <button
            type="button"
            className="text-xs font-medium text-text-secondary hover:text-accent hover:underline bg-transparent border-none cursor-pointer p-0"
            onClick={() => onChange(uniqueIds([currentId]))}
            disabled={!Number.isFinite(currentId)}
          >
            This event only
          </button>
        </div>
      </div>
      <p className="text-xs text-text-tertiary m-0">
        {selectedIds.length} selected. At least one event is required.
      </p>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events by name or ID…"
        className="p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent"
      />
      <div className="max-h-52 overflow-y-auto border border-border rounded-lg bg-bg-secondary/40 divide-y divide-border">
        {loading && <p className="px-3 py-3 text-xs text-text-tertiary m-0">Loading events…</p>}
        {!loading && visible.length === 0 && (
          <p className="px-3 py-3 text-xs text-text-tertiary m-0">No events match.</p>
        )}
        {!loading &&
          visible.map((event) => {
            const checked = selectedIds.includes(event.id);
            const isCurrent = event.id === currentId;
            return (
              <label
                key={event.id}
                className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary cursor-pointer hover:bg-bg-secondary transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(event.id)}
                  className="rounded border-border text-accent focus:ring-accent"
                />
                <span className="flex-1 min-w-0 truncate">{event.name}</span>
                <span className="text-[10px] font-mono text-text-tertiary">#{event.id}</span>
                {isCurrent && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                    Current
                  </span>
                )}
              </label>
            );
          })}
      </div>
    </div>
  );
}
