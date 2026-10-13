import { toggleId } from '../domain/attendeeFilters';
import MeetingCountFilters from './MeetingCountFilters';

function TypeChips({ types, loading, selected, onToggle }) {
  if (loading) return <p className="text-xs text-text-tertiary m-0">Loading…</p>;
  if (types.length === 0) return <p className="text-xs text-text-tertiary m-0">No attendee types</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {types.map((type) => {
        const active = selected.includes(type.id);
        return (
          <button
            key={type.id}
            type="button"
            onClick={() => onToggle(type.id)}
            className={`py-1.5 px-3 border rounded-full text-xs font-medium transition-all duration-200 ${
              active
                ? 'bg-accent text-white border-accent'
                : 'bg-bg-primary border-border text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-secondary'
            }`}
          >
            {type.name}
          </button>
        );
      })}
    </div>
  );
}

export default function MeetingAttendeesFilters({
  draft,
  onPatch,
  onApply,
  onReset,
  types,
  typesLoading,
}) {
  return (
    <form
      className="flex flex-col gap-4 pb-5 border-b border-border"
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-secondary">Attendee types</span>
        <TypeChips
          types={types}
          loading={typesLoading}
          selected={draft.attendeeTypeIds}
          onToggle={(id) => onPatch({ attendeeTypeIds: toggleId(draft.attendeeTypeIds, id) })}
        />
      </div>

      <MeetingCountFilters draft={draft} onPatch={onPatch} />

      <label className="inline-flex items-center gap-2 text-sm text-text-primary cursor-pointer">
        <input
          type="checkbox"
          checked={draft.hasEmail}
          onChange={(e) => onPatch({ hasEmail: e.target.checked })}
          className="rounded border-border text-accent focus:ring-accent"
        />
        Only attendees with an email
      </label>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary">Apply</button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}
