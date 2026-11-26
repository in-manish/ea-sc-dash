import { useAuth } from '../../../contexts/AuthContext';
import { useChatReminderConfig } from '../hooks/useChatReminderConfig';
import { useChatReminderOverview } from '../hooks/useChatReminderOverview';
import { useChatReminderRun } from '../hooks/useChatReminderRun';
import Banner from './Banner';
import ChatReminderActivityCard from './ChatReminderActivityCard';
import ChatReminderControlsCard from './ChatReminderControlsCard';
import ChatReminderRunCard from './ChatReminderRunCard';
import ChatReminderSettingsCard from './ChatReminderSettingsCard';
import ChatReminderStatusCard from './ChatReminderStatusCard';

/** Event Settings → Chat Reminder: everything that controls unread chat reminder emails for this tenant. */
export default function ChatReminderPage() {
  const { token, logout } = useAuth();
  const overview = useChatReminderOverview(token, logout);
  const config = useChatReminderConfig(token, logout, overview.refresh);
  const run = useChatReminderRun(token, logout, overview.refresh);
  const status = overview.status;

  return (
    <div className="max-w-[900px] space-y-6">
      <ChatReminderStatusCard status={status} loading={overview.loading} onRefresh={overview.refresh} />
      <Banner tone="danger">{overview.error}</Banner>
      <Banner tone="success">{overview.notice}</Banner>
      <ChatReminderSettingsCard
        config={config}
        events={status?.active_events || []}
        scheduleOn={!!status?.schedule?.enabled}
      />
      <ChatReminderControlsCard overview={overview} />
      <ChatReminderRunCard run={run} activate={!!config.saved.activate} realUsers={!!status?.emails_go_to_real_users} />
      <ChatReminderActivityCard activity={overview.activity} />
    </div>
  );
}
