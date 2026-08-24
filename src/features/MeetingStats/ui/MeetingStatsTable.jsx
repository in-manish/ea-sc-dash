import { formatStatsNumber, rowAttendeeType } from '../domain/meetingStatsRows';
import { eventRowColor, eventRowStyle, uniqueEventIds } from '../domain/eventRowColors';

const COLUMNS = [
  { key: 'event', label: 'Event', numeric: false },
  { key: 'attendee_type', label: 'Attendee Type', numeric: false },
  { key: 'total_participants', label: 'Total Participants', numeric: true },
  { key: 'active_users', label: 'Active Users', numeric: true },
  { key: 'meeting_requests_sent', label: 'Meeting Requests Sent', numeric: true },
  { key: 'meeting_requests_received', label: 'Meeting Requests Received', numeric: true },
  { key: 'confirmed_meetings', label: 'Confirmed Meetings', numeric: true },
];

export default function MeetingStatsTable({ rows = [], showUnique = false, loading = false }) {
  const columns = showUnique
    ? [...COLUMNS, { key: 'unique_confirmed_participants', label: 'Unique Confirmed Participants', numeric: true }]
    : COLUMNS;
  const eventIds = uniqueEventIds(rows);

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
                {col.label}
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
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-tertiary">
                No meeting stats for these filters.
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((row, index) => (
              <StatsRow
                key={`${row.event_id}-${row.attendee_type_id}-${index}`}
                row={row}
                columns={columns}
                startGroup={index === 0 || rows[index - 1].event_id !== row.event_id}
                rgb={eventRowColor(row.event_id, eventIds)}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}

function StatsRow({ row, columns, startGroup, rgb }) {
  return (
    <tr
      className={`border-b border-border last:border-0 transition-colors ${
        startGroup ? 'border-t-2 border-t-border' : ''
      }`}
      style={eventRowStyle(rgb)}
    >
      {columns.map((col) => (
        <td
          key={col.key}
          className={`px-4 py-3 ${col.numeric ? 'text-right tabular-nums text-text-primary' : 'text-text-primary'}`}
        >
          {col.key === 'event' ? (
            <EventName name={row.event} eventId={row.event_id} rgb={rgb} />
          ) : col.key === 'attendee_type' ? (
            rowAttendeeType(row) || '—'
          ) : col.numeric ? (
            formatStatsNumber(row[col.key])
          ) : (
            row[col.key] || '—'
          )}
        </td>
      ))}
    </tr>
  );
}

function EventName({ name, eventId, rgb }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: `rgb(${rgb})` }}
        aria-hidden
      />
      {eventId != null && eventId !== '' && (
        <span className="text-[11px] font-mono font-semibold text-text-secondary">#{eventId}</span>
      )}
      <span>{name || '—'}</span>
    </span>
  );
}
