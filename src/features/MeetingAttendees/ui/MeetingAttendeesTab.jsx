import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAlert } from '../../../contexts/AlertContext';
import { buildCreateTemplateUrl, meetingTemplateSlug } from '../domain/meetingTemplates';
import { RESUME_PARAM, loadResume, saveResume } from '../domain/resumeState';
import { useAttendeeSelection } from '../hooks/useAttendeeSelection';
import { useAttendeeTypes } from '../hooks/useAttendeeTypes';
import { useEmailTemplateOptions } from '../hooks/useEmailTemplateOptions';
import { useMeetingAttendees } from '../hooks/useMeetingAttendees';
import { useSendMeetingAttendeeEmail } from '../hooks/useSendMeetingAttendeeEmail';
import MeetingAttendeesFilters from './MeetingAttendeesFilters';
import MeetingAttendeesPager from './MeetingAttendeesPager';
import MeetingAttendeesSelectionBar from './MeetingAttendeesSelectionBar';
import MeetingAttendeesTable from './MeetingAttendeesTable';
import SendEmailModal from './SendEmailModal';

export default function MeetingAttendeesTab() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token, logout } = useAuth();
  const { showAlert } = useAlert();
  // Coming back from creating a template: restore the filters and selection, and reopen the dialog.
  const [resume] = useState(() => (searchParams.get(RESUME_PARAM) ? loadResume(eventId) : null));
  const [sendOpen, setSendOpen] = useState(Boolean(resume));
  const { types, loading: typesLoading } = useAttendeeTypes({ eventId, token });
  const list = useMeetingAttendees({ eventId, token, onUnauthorized: logout, initialFilters: resume?.filters || null });
  const selection = useAttendeeSelection(resume);
  const templateState = useEmailTemplateOptions({ eventId, token, enabled: sendOpen });
  const mail = useSendMeetingAttendeeEmail({ eventId, token, filters: list.applied, onUnauthorized: logout });
  const { clear } = selection;
  const previousApplied = useRef(list.applied);

  useEffect(() => {
    if (previousApplied.current === list.applied) return;
    previousApplied.current = list.applied;
    clear();
  }, [list.applied, clear]);

  useEffect(() => {
    if (!searchParams.get(RESUME_PARAM)) return;
    setSearchParams((params) => {
      params.delete(RESUME_PARAM);
      return params;
    }, { replace: true });
  }, [searchParams, setSearchParams]);

  const rows = list.data?.results || [];
  const total = list.data?.count || 0;
  const appliedTypes = types.filter((type) => list.applied?.attendeeTypeIds.includes(type.id));

  const handleCreateTemplate = (type) => {
    saveResume(eventId, { filters: list.applied, selectedUuids: selection.selectedUuids, selectAll: selection.selectAll });
    const returnTo = `/event/${eventId}/meetings?tab=attendees&${RESUME_PARAM}=1`;
    navigate(buildCreateTemplateUrl(eventId, meetingTemplateSlug(type.name), returnTo));
  };

  const handleSend = async (options) => {
    const { ok, result } = await mail.send({
      ...options,
      selectAll: selection.selectAll,
      selectedUuids: selection.selectedUuids,
    });
    if (!ok) return;
    setSendOpen(false);
    selection.clear();
    const skipped = result.skipped_uuids?.length ? ` ${result.skipped_uuids.length} attendee(s) did not match the filter.` : '';
    showAlert(`${result.msg} to ${result.matched_count} attendee(s).${skipped}`, 'success', 'Email queued');
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <MeetingAttendeesFilters draft={list.draft} onPatch={list.patchDraft} onApply={list.apply} onReset={list.reset} types={types} typesLoading={typesLoading} />
      {list.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div className="text-red-600 text-sm whitespace-pre-line">{list.error}</div>
        </div>
      )}
      {!list.applied && <p className="text-sm text-text-tertiary m-0">Choose attendee types and press Apply to list attendees.</p>}
      {list.applied && (
        <>
          <MeetingAttendeesSelectionBar selection={selection} total={total} pageCount={rows.length} onSendEmail={() => { mail.clearError(); setSendOpen(true); }} />
          <MeetingAttendeesTable rows={rows} loading={list.loading} selection={selection} onTogglePage={selection.togglePage} />
          <MeetingAttendeesPager page={list.page} total={total} onPage={list.setPage} disabled={list.loading} />
        </>
      )}
      {sendOpen && (
        <SendEmailModal
          types={appliedTypes}
          templateState={templateState}
          recipientCount={selection.selectAll ? total : selection.selectedUuids.length}
          selectAll={selection.selectAll}
          sending={mail.sending}
          error={mail.error}
          onSend={handleSend}
          onCreateTemplate={handleCreateTemplate}
          onClose={() => !mail.sending && setSendOpen(false)}
        />
      )}
    </div>
  );
}
