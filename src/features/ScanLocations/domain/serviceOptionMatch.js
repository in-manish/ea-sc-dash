import { formatCalendarDate } from './permissionWindow';

/** Same ideas as EA's recommendation: dates overlap, then the daily times overlap. */
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** "11:30 am", "1:00 PM", "12 pm", "13:45", "13:45:00" → minutes from midnight, or null. */
export function clockMinutes(value) {
  const match = /^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(am|pm)?$/i.exec(String(value || '').trim());
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const half = (match[3] || '').toLowerCase();
  if (half) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (half === 'pm' ? 12 : 0);
  }
  return hours > 23 || minutes > 59 ? null : hours * 60 + minutes;
}

function window(start, end) {
  const first = clockMinutes(start);
  const last = clockMinutes(end);
  if (first == null || last == null) return null;
  return [first, last < first ? last + 1440 : last];
}

function words(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
}

/** The permission name is in the option title (every word of it), or the reverse. */
export function titlesAgree(optionTitle, permissionName) {
  const title = words(optionTitle);
  const name = words(permissionName);
  if (!title.length || !name.length) return false;
  return name.every((word) => title.includes(word)) || title.every((word) => name.includes(word));
}

function datesOverlap(option, permission) {
  if (!DATE_RE.test(option.date || '')) return null;
  const hasDates = DATE_RE.test(permission.from_date || '') || DATE_RE.test(permission.end_date || '');
  if (!hasDates) return null;
  const optionEnd = DATE_RE.test(option.endDate || '') ? option.endDate : option.date;
  if (permission.from_date && optionEnd < permission.from_date) return false;
  if (permission.end_date && option.date > permission.end_date) return false;
  return true;
}

function describe(option, permission) {
  const day = [formatCalendarDate(option.date), formatCalendarDate(option.endDate)].filter(Boolean).join(' to ');
  const times = [option.startTime, option.endTime].filter(Boolean).join(' to ');
  const have = [formatCalendarDate(permission.from_date), formatCalendarDate(permission.end_date)].filter(Boolean).join(' to ');
  const open = [permission.from_time, permission.end_time].filter(Boolean).join(' to ');
  return {
    option: [day, times].filter(Boolean).join(' · ') || 'no date or time',
    permission: [have, open].filter(Boolean).join(' · ') || 'any date, all day',
  };
}

/**
 * How well a permission fits a SurveyJS option.
 * level: 'match' (green) - timing fits or cannot be compared, and the name agrees;
 *        'mismatch' (red) - the date or the daily time does not overlap;
 *        'check' (amber) - the name differs, or nothing could be compared.
 * Returns {level, timing: 'fits' | 'differs' | 'unknown', dateState, timeState (each 'fits' | 'differs' |
 * 'unknown'), name: 'agrees' | 'differs', label, detail}.
 */
export function matchPermission(option, permission) {
  const dates = datesOverlap(option, permission);
  const wanted = window(option.startTime, option.endTime);
  const offered = window(permission.from_time, permission.end_time);
  let timing = 'unknown';
  let reason = '';
  if (dates === false) {
    timing = 'differs';
    reason = 'Date differs';
  } else if (wanted && offered) {
    const overlap = Math.max(wanted[0], offered[0]) < Math.min(wanted[1], offered[1]);
    timing = overlap ? (dates === true ? 'fits' : 'unknown') : 'differs';
    if (!overlap) reason = 'Time differs';
  } else if (dates === true && !wanted && !offered) {
    timing = 'fits';
  }
  const dateState = dates == null ? 'unknown' : dates ? 'fits' : 'differs';
  let timeState = 'unknown';
  if (wanted && offered) timeState = Math.max(wanted[0], offered[0]) < Math.min(wanted[1], offered[1]) ? 'fits' : 'differs';
  const name = titlesAgree(option.title, permission.name) ? 'agrees' : 'differs';
  const seen = describe(option, permission);
  const detail = `Option: ${seen.option}. Permission: ${seen.permission}.`;

  const base = { timing, dateState, timeState, name, detail };
  if (timing === 'differs') return { level: 'mismatch', label: reason, ...base };
  if (name === 'differs') {
    return { level: 'check', label: timing === 'fits' ? 'Name differs' : 'Cannot confirm', ...base };
  }
  return { level: 'match', label: timing === 'fits' ? 'Fits' : 'Name matches', ...base };
}

/** Standard palette colours: this app's success and danger tokens do not take part in Tailwind classes. */
export const LEVEL_STYLE = {
  match: { chip: 'border-green-600/40 bg-green-500/10 text-green-700', bar: 'border-l-green-600', rank: 0 },
  check: { chip: 'border-amber-500/50 bg-amber-500/10 text-amber-700', bar: 'border-l-amber-500', rank: 1 },
  mismatch: { chip: 'border-red-500/50 bg-red-500/10 text-red-700', bar: 'border-l-red-500', rank: 2 },
};

/** The worst level among the mapped permissions, or null when none is mapped. */
export function worstLevel(option, permissions) {
  const levels = permissions.map((permission) => matchPermission(option, permission).level);
  if (levels.length === 0) return null;
  return levels.reduce((worst, level) => (LEVEL_STYLE[level].rank > LEVEL_STYLE[worst].rank ? level : worst));
}
