import { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { useSetupChecklistRemind } from '../hooks/useSetupChecklistRemind';
import { exhibitorPasswordResetPayload } from '../domain/exhibitorPasswordResetPayload';
import ConfirmRemindSendModal from './ConfirmRemindSendModal';
import ExhibitorPasswordResetControl from './ExhibitorPasswordResetControl';
import RemindSendProgress from './RemindSendProgress';

/**
 * Bulk remind from exhibitor list only — no step_id.
 * All / multi-select (>1) require typing "send" in a warning modal.
 */
export default function ExhibitorRemindBar({
  eventId,
  token,
  selectedIds,
  onCleared,
}) {
  const [confirmMode, setConfirmMode] = useState(null);
  const {
    remindingKey,
    remindSuccess,
    remindError,
    progress,
    sendRemind,
    isReminding,
  } = useSetupChecklistRemind({ eventId, token });

  const selected = [...selectedIds];

  const runAll = () => {
    setConfirmMode(null);
    void sendRemind({
      key: 'all',
      successMessage: 'Reminder queued for all companies not fully complete.',
    });
  };

  const runSelected = () => {
    if (!selected.length) return;
    const ids = selected;
    setConfirmMode(null);
    void sendRemind({
      companyIds: ids,
      key: 'selected',
      successMessage: `Reminder sent to ${ids.length} selected compan${
        ids.length === 1 ? 'y' : 'ies'
      }.`,
    }).then((ok) => {
      if (ok) onCleared?.();
    });
  };

  const onRemindAllClick = () => setConfirmMode('all');

  const onRemindSelectedClick = () => {
    if (!selected.length) return;
    if (selected.length > 1) setConfirmMode('selected');
    else runSelected();
  };

  const onConfirm = () => {
    if (confirmMode === 'all') runAll();
    else if (confirmMode === 'selected') runSelected();
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-primary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={isReminding}
          onClick={onRemindAllClick}
          title="Checklist remind every company that has incomplete setup"
        >
          {remindingKey === 'all' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Bell size={14} />
          )}
          Checklist Remind all incomplete
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={isReminding || selected.length === 0}
          onClick={onRemindSelectedClick}
          title="Checklist remind selected companies (full incomplete setup)"
        >
          {remindingKey === 'selected' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Bell size={14} />
          )}
          Checklist Remind selected ({selected.length})
        </button>
        <ExhibitorPasswordResetControl
          eventId={eventId}
          token={token}
          payload={
            selected.length === 1
              ? exhibitorPasswordResetPayload({ companyId: selected[0] })
              : null
          }
          enabled={selected.length === 1}
          disabled={isReminding}
          disabledTitle="Select a single exhibitor to reset its POC password"
        />
        {selected.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost btn-sm text-text-secondary"
            disabled={isReminding}
            onClick={onCleared}
          >
            Clear selection
          </button>
        )}
      </div>
      <RemindSendProgress progress={progress} />
      {remindSuccess && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 m-0">
          {remindSuccess}
        </p>
      )}
      {remindError && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          <p className="m-0 font-medium">{remindError}</p>
          {/portal_base_url/i.test(remindError) && (
            <p className="m-0 mt-1 text-xs text-red-600">
              Set the portal base URL under Exhibitors → Checklist Reminder → Setup reminder.
            </p>
          )}
        </div>
      )}

      {confirmMode && (
        <ConfirmRemindSendModal
          mode={confirmMode}
          selectedCount={selected.length}
          onConfirm={onConfirm}
          onCancel={() => setConfirmMode(null)}
        />
      )}
    </div>
  );
}
