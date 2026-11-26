import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getActivity, getStatus, setKillSwitch, setScheduleEnabled, setScheduleEveryMinutes,
} from '../api/chatReminderApi';

/** Status + recent activity, plus the controls that live outside the settings row (schedule, kill switch). */
export function useChatReminderOverview(token, onUnauthorized) {
  const [status, setStatus] = useState(null);
  const [activity, setActivity] = useState({ digests: [], events: [] });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const unauthorized = useRef(onUnauthorized);
  unauthorized.current = onUnauthorized;

  const fail = useCallback((err) => {
    if (err.status === 401) unauthorized.current?.();
    setError(err.message || 'Request failed.');
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [nextStatus, nextActivity] = await Promise.all([getStatus(token), getActivity(token, 20)]);
      setStatus(nextStatus);
      setActivity(nextActivity);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }, [token, fail]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Run one control action, then reload status so the screen shows the real state. */
  const act = useCallback(async (name, action, successText) => {
    setBusy(name);
    setError('');
    setNotice('');
    try {
      await action();
      setNotice(successText);
      await refresh();
    } catch (err) {
      fail(err);
    } finally {
      setBusy('');
    }
  }, [refresh, fail]);

  const stopReminders = (reason) => act('kill', () => setKillSwitch(token, status.kill_switch.type_key, false, reason),
    'Reminder emails stopped. Nothing will send until you resume.');
  const resumeReminders = () => act('kill', () => setKillSwitch(token, status.kill_switch.type_key, true, ''),
    'Reminder emails allowed again.');
  const setScheduleOn = (enabled) => act('schedule', () => setScheduleEnabled(token, status.schedule.name, enabled),
    enabled ? 'Automatic sending scheduled.' : 'Automatic sending paused.');
  const setScheduleEvery = (minutes) => act('interval', () => setScheduleEveryMinutes(token, status.schedule.id, minutes),
    `Sweep now runs every ${minutes} min.`);

  return {
    status, activity, loading, busy, error, notice, refresh,
    stopReminders, resumeReminders, setScheduleOn, setScheduleEvery,
  };
}
