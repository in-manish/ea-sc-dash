import { CalendarDays, Clock } from 'lucide-react';

const STATE = {
  fits: 'border-green-600/50 bg-green-500/10 text-green-800',
  differs: 'border-red-500/50 bg-red-500/10 text-red-800',
  unknown: 'border-sky-300 bg-sky-100 text-sky-900',
  none: 'border-border bg-bg-secondary text-text-tertiary',
};

function Chip({ icon, text, state, empty }) {
  const Icon = icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${STATE[empty ? 'none' : state]}`}>
      <Icon size={12} aria-hidden="true" />
      {text}
    </span>
  );
}

/**
 * The date and the time of an option or a permission as two highlighted chips. dateState and timeState
 * ('fits', 'differs', 'unknown') colour them green, red or blue; empty text shows a muted placeholder.
 */
export default function TimingChips({ dateText, timeText, dateState = 'unknown', timeState = 'unknown' }) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <Chip icon={CalendarDays} text={dateText || 'No date'} state={dateState} empty={!dateText} />
      <Chip icon={Clock} text={timeText || 'No time'} state={timeState} empty={!timeText} />
    </span>
  );
}
