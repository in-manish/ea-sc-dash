import { useState } from 'react';
import { CalendarClock, Loader2, OctagonX, Play } from 'lucide-react';
import { SectionHeader, ToggleSwitch } from '../../../pages/event-settings/components/SharedComponents';
import { formatTimestamp, isReminderStopped, killSwitchRow, scheduleMinutes } from '../domain/chatReminderStatus';
import Banner from './Banner';

function ScheduleRow({ schedule, busy, onToggle, onEvery }) {
  const current = scheduleMinutes(schedule);
  const [every, setEvery] = useState('');
  if (!schedule?.registered) {
    return <Banner tone="warning">The sweep task is not registered in the beat schedule on this server.</Banner>;
  }
  const toggle = (checked) => {
    const text = checked
      ? 'Enable automatic sending? This schedule is shared by every tenant; each tenant still needs "Reminders on".'
      : 'Pause automatic sending for every tenant?';
    if (window.confirm(text)) onToggle(checked);
  };
  const apply = () => {
    const minutes = Number(every);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 1440) {
      window.alert('Use a whole number of minutes from 5 to 1440.');
      return;
    }
    onEvery(minutes);
    setEvery('');
  };
  return (
    <div className="space-y-3 p-4 bg-bg-secondary rounded-lg border border-border">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-semibold text-text-primary">Automatic sending {schedule.enabled ? 'enabled' : 'paused'}</p>
          <p className="m-0 text-xs text-text-tertiary">
            Runs every {current ?? '?'} min · last run {formatTimestamp(schedule.last_run_at)} · shared by all tenants
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {busy === 'schedule' ? <Loader2 size={14} className="animate-spin text-accent" /> : null}
          <ToggleSwitch name="schedule" checked={!!schedule.enabled} isModified={false} onChange={(e) => toggle(e.target.checked)} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-secondary">Run every</span>
        <input type="number" min={5} max={1440} value={every} placeholder={String(current ?? 20)}
          onChange={(e) => setEvery(e.target.value)}
          className="w-24 p-2 border border-border rounded-md text-sm bg-bg-primary text-text-primary" />
        <span className="text-xs text-text-secondary">minutes</span>
        <button type="button" className="btn btn-secondary" disabled={!every || busy === 'interval'} onClick={apply}>
          {busy === 'interval' ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
        </button>
      </div>
    </div>
  );
}

function EmergencyStop({ status, busy, onStop, onResume }) {
  const stopped = isReminderStopped(status);
  const allRow = killSwitchRow(status, status.kill_switch.all_key);
  const stop = () => {
    const reason = window.prompt('Stop ALL chat reminder emails now? Optional reason:', 'stopped from dashboard');
    if (reason !== null) onStop(reason);
  };
  return (
    <div className={`space-y-2 p-4 rounded-lg border ${stopped ? 'border-red-500/40 bg-red-500/10' : 'border-border bg-bg-secondary'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-semibold text-text-primary">Emergency stop {stopped ? '(ACTIVE)' : ''}</p>
          <p className="m-0 text-xs text-text-tertiary">
            Blocks every chat reminder email at once, even mid-run. Does not change any setting.
          </p>
        </div>
        {stopped ? (
          <button type="button" className="btn btn-secondary shrink-0" disabled={busy === 'kill'} onClick={onResume}>
            {busy === 'kill' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            <span className="ml-1.5">Resume</span>
          </button>
        ) : (
          <button type="button" disabled={busy === 'kill'} onClick={stop}
            className="btn shrink-0 bg-red-600 text-white hover:bg-red-700 border-red-600">
            {busy === 'kill' ? <Loader2 size={14} className="animate-spin" /> : <OctagonX size={14} />}
            <span className="ml-1.5">Stop all reminders</span>
          </button>
        )}
      </div>
      {allRow && allRow.is_enabled === false ? (
        <Banner tone="danger">{`The global switch "${allRow.key}" is off, so no email of any type is sending.`}</Banner>
      ) : null}
    </div>
  );
}

/** Schedule (shared beat entry) and the emergency stop (kill switch). */
export default function ChatReminderControlsCard({ overview }) {
  const { status, busy, setScheduleOn, setScheduleEvery, stopReminders, resumeReminders } = overview;
  if (!status) return null;
  return (
    <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm space-y-4">
      <SectionHeader icon={CalendarClock} title="Schedule & emergency stop" colorClass="text-indigo-500" borderClass="bg-indigo-500" />
      <ScheduleRow schedule={status.schedule} busy={busy} onToggle={setScheduleOn} onEvery={setScheduleEvery} />
      <EmergencyStop status={status} busy={busy} onStop={stopReminders} onResume={resumeReminders} />
    </div>
  );
}
