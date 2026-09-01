import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../contexts/AlertContext';
import { keepKnownTypeNames } from '../domain/attendeeTypeNames';
import { loadPersistedEmails, persistEmails } from '../domain/meetingStatsEmails';
import { useAttendeeTypeOptions } from '../hooks/useAttendeeTypeOptions';
import { useEmailMeetingStatsReport } from '../hooks/useEmailMeetingStatsReport';
import { useMeetingStatsFilters, useMeetingStatsReport } from '../hooks/useMeetingStatsReport';
import { useOrganizerEvents } from '../hooks/useOrganizerEvents';
import MeetingStatsEmailModal from './MeetingStatsEmailModal';
import MeetingStatsFilters from './MeetingStatsFilters';
import MeetingStatsHeader from './MeetingStatsHeader';
import MeetingStatsTotals from './MeetingStatsTotals';

export default function MeetingStatsReportTab() {
  const { id: eventId } = useParams();
  const { token, logout, selectedEvent, user, recentEvents } = useAuth();
  const { showAlert } = useAlert();
  const { draft, applied, patchDraft, apply, reset } = useMeetingStatsFilters(eventId);
  const { types, loading: typesLoading } = useAttendeeTypeOptions({
    eventIds: draft.eventIds,
    token,
  });
  const { events, loading: eventsLoading } = useOrganizerEvents({
    token,
    user,
    selectedEvent,
    recentEvents,
    currentEventId: eventId,
  });
  const report = useMeetingStatsReport({
    eventId,
    token,
    filters: applied,
    onUnauthorized: logout,
  });
  const email = useEmailMeetingStatsReport({
    eventId,
    token,
    filters: applied,
    onUnauthorized: logout,
  });
  const [emailOpen, setEmailOpen] = useState(false);
  const [emails, setEmails] = useState(loadPersistedEmails);

  useEffect(() => {
    persistEmails(emails);
  }, [emails]);

  useEffect(() => {
    if (typesLoading) return;
    const sender = keepKnownTypeNames(draft.senderAttendeeTypeNames, types);
    const receiver = keepKnownTypeNames(draft.receiverAttendeeTypeNames, types);
    if (
      sender.length !== draft.senderAttendeeTypeNames.length ||
      receiver.length !== draft.receiverAttendeeTypeNames.length
    ) {
      patchDraft({
        senderAttendeeTypeNames: sender,
        receiverAttendeeTypeNames: receiver,
      });
    }
  }, [
    types,
    typesLoading,
    draft.senderAttendeeTypeNames,
    draft.receiverAttendeeTypeNames,
    patchDraft,
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <MeetingStatsFilters
        draft={draft}
        onPatch={patchDraft}
        onApply={apply}
        onReset={reset}
        attendeeTypes={types}
        typesLoading={typesLoading}
        events={events}
        eventsLoading={eventsLoading}
        eventId={eventId}
      />

      <MeetingStatsHeader
        data={report.data}
        refreshing={report.refreshing}
        onRefresh={report.refresh}
        onEmail={() => {
          email.clearMessages();
          setEmailOpen(true);
        }}
        disableEmail={report.loading || email.sending || email.cooldownLeft > 0}
        emailLabel={email.cooldownLeft > 0 ? `Wait ${email.cooldownLeft}s` : 'Email report'}
      />

      <MeetingStatsTotals
        totals={report.data?.totals || []}
        showUnique={Boolean(report.data?.showUnique)}
        loading={report.loading}
      />

      {report.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div className="text-red-600 text-sm">{report.error}</div>
        </div>
      )}

      {emailOpen && (
        <MeetingStatsEmailModal
          sending={email.sending}
          cooldownLeft={email.cooldownLeft}
          error={email.error}
          success={email.success}
          emails={emails}
          onEmailsChange={setEmails}
          onSend={async (list) => {
            const result = await email.sendEmail(list);
            if (result?.ok) {
              setEmailOpen(false);
              showAlert(result.message, 'success', 'Email sent');
            }
          }}
          onClose={() => {
            if (!email.sending) setEmailOpen(false);
          }}
        />
      )}
    </div>
  );
}
