import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatStatsNumber, rowAttendeeType } from '../domain/meetingStatsRows';
import { eventRowColor, eventRowStyle, uniqueEventIds } from '../domain/eventRowColors';
import ColumnInfoIcon from './ColumnInfoIcon';

const EVENT_INFO = {
  unique_meetings: {
    meaning: 'Distinct meeting requests for this event.',
    calc: 'Counts every meeting once, any status, ignoring attendee type.',
    example: '6 requests among different pairs → 6.',
  },
  total_participants: {
    meaning: 'Distinct people who sent or received a request.',
    calc: 'Badge IDs deduped across all attendee types.',
    example: 'A meets B and C → A counted once, not twice.',
  },
  active_users: {
    meaning: 'Distinct people who took an action.',
    calc: 'Every sender, plus receivers who accepted, rescheduled, declined or cancelled.',
    example: 'A receiver who never responds is not counted.',
  },
  meeting_requests_sent: {
    meaning: 'Total requests sent by anyone at this event.',
    calc: 'Count of meetings with a known sender.',
    example: '5 people each send 1 request → 5.',
  },
  meeting_requests_received: {
    meaning: 'Total requests received by anyone at this event.',
    calc: 'Count of meetings with a known receiver.',
    example: '5 requests to 3 people → 5.',
  },
  confirmed_meetings: {
    meaning: 'Meetings that were accepted.',
    calc: 'Distinct meetings with status Accepted, counted once per event.',
    example: '2 accepted + 1 declined → 2.',
  },
  unique_confirmed_participants: {
    meaning: 'Distinct people in at least one accepted meeting.',
    calc: 'Sender/receiver badge IDs from accepted meetings, deduped.',
    example: 'Same person confirms 3 meetings → counted once.',
  },
};

const TYPE_INFO = {
  total_participants: {
    meaning: 'Distinct people of this attendee type who sent or received a request.',
    calc: 'Badge IDs of this type only, deduped.',
    example: 'Same exhibitor meets 3 visitors → counted once.',
  },
  active_users: {
    meaning: 'Distinct people of this type who took an action.',
    calc: 'Senders of this type, plus receivers of this type who responded.',
    example: '',
  },
  meeting_requests_sent: {
    meaning: 'Requests sent by people of this type.',
    calc: 'Count of meetings where the sender is this attendee type.',
    example: '',
  },
  meeting_requests_received: {
    meaning: 'Requests received by people of this type.',
    calc: 'Count of meetings where the receiver is this attendee type.',
    example: '',
  },
  confirmed_meetings: {
    meaning: 'Accepted meetings involving this type.',
    calc: 'Counted once per type touching the meeting (same type on both sides → once).',
    example: '',
  },
  unique_confirmed_participants: {
    meaning: 'Distinct people of this type in an accepted meeting.',
    calc: 'Sender/receiver badge IDs of this type from accepted meetings, deduped.',
    example: '',
  },
};

const COLUMNS = [
  { key: 'event', label: 'Event', numeric: false },
  { key: 'unique_meetings', label: 'Unique Meetings', numeric: true },
  { key: 'total_participants', label: 'Total Participants', numeric: true },
  { key: 'active_users', label: 'Active Users', numeric: true },
  { key: 'meeting_requests_sent', label: 'Meeting Requests Sent', numeric: true },
  { key: 'meeting_requests_received', label: 'Meeting Requests Received', numeric: true },
  { key: 'confirmed_meetings', label: 'Confirmed Meetings', numeric: true },
];

const ATTENDEE_TYPE_COLUMNS = [
  { key: 'attendee_type', label: 'Attendee Type', numeric: false },
  { key: 'total_participants', label: 'Total Participants', numeric: true },
  { key: 'active_users', label: 'Active Users', numeric: true },
  { key: 'meeting_requests_sent', label: 'Meeting Requests Sent', numeric: true },
  { key: 'meeting_requests_received', label: 'Meeting Requests Received', numeric: true },
  { key: 'confirmed_meetings', label: 'Confirmed Meetings', numeric: true },
];

export default function MeetingStatsTotals({ totals = [], showUnique = false, loading = false }) {
  const [expanded, setExpanded] = useState(() => new Set());
  const eventIds = uniqueEventIds(totals);

  const columns = showUnique
    ? [...COLUMNS, { key: 'unique_confirmed_participants', label: 'Unique Confirmed Participants', numeric: true }]
    : COLUMNS;
  const attendeeTypeColumns = showUnique
    ? [
        ...ATTENDEE_TYPE_COLUMNS,
        { key: 'unique_confirmed_participants', label: 'Unique Confirmed Participants', numeric: true },
      ]
    : ATTENDEE_TYPE_COLUMNS;

  const toggle = (eventId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-bg-secondary text-text-secondary uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 border-b border-border font-semibold ${col.numeric ? 'text-right' : ''}`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {EVENT_INFO[col.key] && <ColumnInfoIcon {...EVENT_INFO[col.key]} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-tertiary">
                Loading meeting stats…
              </td>
            </tr>
          )}
          {!loading && totals.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-tertiary">
                No meeting stats for these filters.
              </td>
            </tr>
          )}
          {!loading &&
            totals.map((row) => {
              const attendeeTypes = row.attendee_types || [];
              const canExpand = attendeeTypes.length > 0;
              const isOpen = canExpand && expanded.has(row.event_id);
              const rgb = eventRowColor(row.event_id, eventIds);
              return (
                <Fragment key={row.event_id}>
                  <tr className="border-b border-border last:border-0" style={eventRowStyle(rgb)}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 ${col.numeric ? 'text-right tabular-nums text-text-primary' : 'text-text-primary'}`}
                      >
                        {col.key === 'event' ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-default"
                            onClick={() => toggle(row.event_id)}
                            disabled={!canExpand}
                          >
                            {canExpand ? (
                              isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                            ) : (
                              <span className="inline-block w-[14px]" aria-hidden />
                            )}
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: `rgb(${rgb})` }}
                              aria-hidden
                            />
                            <span>{row.event || '—'}</span>
                          </button>
                        ) : (
                          formatStatsNumber(row[col.key])
                        )}
                      </td>
                    ))}
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-border last:border-0">
                      <td
                        colSpan={columns.length}
                        className="px-4 py-3"
                        style={{ backgroundColor: `rgba(${rgb}, 0.05)`, borderLeft: `3px solid rgb(${rgb})` }}
                      >
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="text-text-tertiary uppercase text-[11px] tracking-wider">
                            <tr>
                              {attendeeTypeColumns.map((col) => (
                                <th
                                  key={col.key}
                                  className={`px-3 py-2 font-semibold ${col.numeric ? 'text-right' : ''}`}
                                >
                                  <span className="inline-flex items-center gap-1">
                                    {col.label}
                                    {TYPE_INFO[col.key] && <ColumnInfoIcon {...TYPE_INFO[col.key]} />}
                                  </span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {attendeeTypes.map((at, index) => (
                              <tr key={at.attendee_type_id ?? index} className="border-t border-border/60">
                                {attendeeTypeColumns.map((col) => (
                                  <td
                                    key={col.key}
                                    className={`px-3 py-2 ${
                                      col.numeric ? 'text-right tabular-nums text-text-primary' : 'text-text-secondary'
                                    }`}
                                  >
                                    {col.key === 'attendee_type'
                                      ? rowAttendeeType(at) || '—'
                                      : formatStatsNumber(at[col.key])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
