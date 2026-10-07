import { formatCalendarDate } from './permissionWindow';

/** "27 Oct 2026 to 28 Oct 2026". Empty when the option has no date. */
export function serviceOptionDays(option) {
  const first = formatCalendarDate(option.date);
  const last = formatCalendarDate(option.endDate);
  return first && last ? `${first} to ${last}` : first;
}

/** "12:30 pm to 2:00 pm", as SurveyJS sent it. Empty when there is no time. */
export function serviceOptionTimes(option) {
  return [option.startTime, option.endTime].filter(Boolean).join(' to ');
}

/** "27 Oct 2026 to 28 Oct 2026 · 12:30 pm to 2:00 pm". Times are shown as SurveyJS sent them. */
export function serviceOptionWhen(option) {
  const first = formatCalendarDate(option.date);
  const last = formatCalendarDate(option.endDate);
  const days = first && last ? `${first} to ${last}` : first;
  const times = [option.startTime, option.endTime].filter(Boolean).join(' to ');
  return [days, times].filter(Boolean).join(' · ') || 'No date or time';
}
