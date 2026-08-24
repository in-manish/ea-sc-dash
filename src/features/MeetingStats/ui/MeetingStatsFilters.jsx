import MeetingStatsChipGroup from './MeetingStatsChipGroup';
import MeetingStatsEventPicker from './MeetingStatsEventPicker';
import { MEETING_DURATIONS, MEETING_STATUSES } from '../constants';
import { attendeeTypeChipOptions } from '../domain/attendeeTypeNames';
import { toggleValue } from '../domain/meetingStatsQuery';

const inputClass =
  'p-2.5 bg-bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent';

export default function MeetingStatsFilters({
  draft,
  onPatch,
  onApply,
  onReset,
  attendeeTypes = [],
  typesLoading = false,
  events = [],
  eventsLoading = false,
  eventId,
}) {
  const typeOptions = attendeeTypeChipOptions(attendeeTypes);
  const toggle = (key, value) => onPatch({ [key]: toggleValue(draft[key], value) });

  return (
    <form
      className="flex flex-col gap-5 pb-5 border-b border-border"
      onSubmit={(e) => {
        e.preventDefault();
        onApply();
      }}
    >
      <MeetingStatsEventPicker
        events={events}
        loading={eventsLoading}
        selectedIds={draft.eventIds}
        currentEventId={eventId}
        onChange={(eventIds) => onPatch({ eventIds })}
      />

      <MeetingStatsChipGroup
        label="Sender attendee types"
        options={typeOptions}
        selected={draft.senderAttendeeTypeNames}
        onToggle={(value) => toggle('senderAttendeeTypeNames', value)}
        loading={typesLoading}
        emptyText="No attendee types for the selected events"
      />
      <MeetingStatsChipGroup
        label="Receiver attendee types"
        options={typeOptions}
        selected={draft.receiverAttendeeTypeNames}
        onToggle={(value) => toggle('receiverAttendeeTypeNames', value)}
        loading={typesLoading}
        emptyText="No attendee types for the selected events"
      />
      <p className="text-xs text-text-tertiary m-0">
        Names are case-insensitive. Both sides set uses AND (sender type and receiver type).
        Same-side names are a union. Blank = all types.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Sender EVC IDs">
          <input
            type="text"
            value={draft.senderIds}
            onChange={(e) => onPatch({ senderIds: e.target.value })}
            placeholder="SnapCard evc_ids, comma-separated"
            className={inputClass}
          />
        </Field>
        <Field label="Meeting date">
          <input
            type="date"
            value={draft.meetingDate}
            onChange={(e) => onPatch({ meetingDate: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Range start">
          <input
            type="date"
            value={draft.rangeStart}
            onChange={(e) => onPatch({ rangeStart: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Range end">
          <input
            type="date"
            value={draft.rangeEnd}
            onChange={(e) => onPatch({ rangeEnd: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <p className="text-xs text-text-tertiary m-0">
        If both a single date and a range are set, the range is used.
      </p>

      <MeetingStatsChipGroup
        label="Duration"
        options={MEETING_DURATIONS}
        selected={draft.duration}
        onToggle={(value) => toggle('duration', value)}
      />
      <MeetingStatsChipGroup
        label="Status"
        options={MEETING_STATUSES}
        selected={draft.status}
        onToggle={(value) => toggle('status', value)}
      />

      <label className="inline-flex items-center gap-2 text-sm text-text-primary cursor-pointer">
        <input
          type="checkbox"
          checked={draft.uniqueParticipants}
          onChange={(e) => onPatch({ uniqueParticipants: e.target.checked })}
          className="rounded border-border text-accent focus:ring-accent"
        />
        Unique confirmed participants
      </label>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={!draft.eventIds?.length}>
          Apply filters
        </button>
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      {children}
    </div>
  );
}
