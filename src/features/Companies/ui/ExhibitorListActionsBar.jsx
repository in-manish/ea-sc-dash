import { useState } from 'react';
import { useSetupChecklistRemind } from '../hooks/useSetupChecklistRemind';
import { useCompanyBulkAction } from '../hooks/useCompanyBulkAction';
import { useExhibitorPasswordReset } from '../hooks/useExhibitorPasswordReset';
import { exhibitorPasswordResetPayload } from '../domain/exhibitorPasswordResetPayload';
import {
  buildFeatureCompanyPayload,
  buildLockCompanyPayload,
  featureSuccessMessage,
  isParentExhibitor,
  lockSuccessMessage,
  parentCompanies,
} from '../domain/companyBulkActionPayload';
import RemindSendProgress from './RemindSendProgress';
import ExhibitorListActionsMenu from './ExhibitorListActionsMenu';
import ExhibitorListActionDialogs from './ExhibitorListActionDialogs';

/**
 * FIND-adjacent ACT chrome: selection count + Actions menu + confirm dialogs.
 */
export default function ExhibitorListActionsBar({
  eventId,
  token,
  companies,
  selectedIds,
  onCleared,
  onUpdated,
}) {
  const selected = [...selectedIds];
  const selectedRows = companies.filter((c) => selectedIds.has(c.id));
  const parents = parentCompanies(selectedRows);
  const hasCoExhibitors = selectedRows.some((c) => !isParentExhibitor(c));
  const canLockSelected = parents.length >= 1 && !hasCoExhibitors;
  const coExhibitorTitle = hasCoExhibitors
    ? 'Deselect co-exhibitors. These actions apply to parent exhibitors only.'
    : undefined;

  const remind = useSetupChecklistRemind({ eventId, token });
  const bulk = useCompanyBulkAction({ eventId, token });
  const reset = useExhibitorPasswordReset({ eventId, token });
  const [confirmMode, setConfirmMode] = useState(null);
  const [lockConfirm, setLockConfirm] = useState(null);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const resetPayload =
    selected.length === 1
      ? exhibitorPasswordResetPayload({ companyId: selected[0] })
      : null;

  const runRemindAll = () => {
    setConfirmMode(null);
    void remind.sendRemind({
      key: 'all',
      successMessage: 'Reminder queued for all companies not fully complete.',
    });
  };

  const runRemindSelected = () => {
    if (!selected.length) return;
    const ids = selected;
    setConfirmMode(null);
    void remind.sendRemind({
      companyIds: ids,
      key: 'selected',
      successMessage: `Reminder sent to ${ids.length} selected compan${
        ids.length === 1 ? 'y' : 'ies'
      }.`,
    }).then((ok) => {
      if (ok) onCleared?.();
    });
  };

  const confirmLock = async () => {
    if (!lockConfirm) return;
    const data = await bulk.run(
      buildLockCompanyPayload({
        companyIds: parents.map((c) => c.id),
        locked: lockConfirm.locked,
        all: lockConfirm.all,
      }),
      (result) => lockSuccessMessage(result, lockConfirm.locked),
    );
    if (!data) return;
    setLockConfirm(null);
    if (!lockConfirm.all) onCleared?.();
    onUpdated?.();
  };

  const submitFeature = async (rows) => {
    const data = await bulk.run(buildFeatureCompanyPayload(rows), featureSuccessMessage);
    if (!data) return;
    setFeatureOpen(false);
    onCleared?.();
    onUpdated?.();
  };

  const confirmReset = async () => {
    const ok = await reset.resetPassword(resetPayload);
    if (ok) setResetOpen(false);
  };

  return (
    <div className="mb-3 space-y-2">
      <div className="flex items-center justify-between gap-3 min-h-[2.25rem]">
        {selected.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {selected.length} selected
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-text-secondary"
              onClick={onCleared}
            >
              Clear selection
            </button>
          </div>
        ) : (
          <span />
        )}
        <ExhibitorListActionsMenu
          selectedCount={selected.length}
          canRemindSelected={selected.length > 0}
          canResetPassword={selected.length === 1}
          canLockSelected={canLockSelected}
          coExhibitorTitle={coExhibitorTitle}
          reminding={remind.isReminding}
          submitting={bulk.submitting || reset.resetting}
          onRemindAll={() => setConfirmMode('all')}
          onRemindSelected={() => selected.length && setConfirmMode('selected')}
          onResetPassword={() => {
            if (selected.length !== 1) return;
            reset.clearMessages();
            setResetOpen(true);
          }}
          onLockSelected={(locked) => {
            if (!canLockSelected) return;
            bulk.clearMessages();
            setLockConfirm({ locked, all: false });
          }}
          onFeature={() => {
            if (!canLockSelected) return;
            bulk.clearMessages();
            setFeatureOpen(true);
          }}
          onLockAll={(locked) => {
            bulk.clearMessages();
            setLockConfirm({ locked, all: true });
          }}
        />
      </div>
      <RemindSendProgress progress={remind.progress} />
      {(remind.remindSuccess || bulk.success || reset.success) && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 m-0">
          {remind.remindSuccess || bulk.success || reset.success}
        </p>
      )}
      {(remind.remindError || (!lockConfirm && !featureOpen && !resetOpen && (bulk.error || reset.error))) && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          <p className="m-0 font-medium">
            {remind.remindError || bulk.error || reset.error}
          </p>
          {/portal_base_url/i.test(remind.remindError || '') && (
            <p className="m-0 mt-1 text-xs text-red-600">
              Set the portal base URL under Exhibitors → Checklist Reminder → Setup reminder.
            </p>
          )}
        </div>
      )}
      <ExhibitorListActionDialogs
        confirmMode={confirmMode}
        selectedCount={selected.length}
        onConfirmRemind={confirmMode === 'all' ? runRemindAll : runRemindSelected}
        onCancelRemind={() => setConfirmMode(null)}
        lockConfirm={lockConfirm}
        lockParentCount={lockConfirm?.all ? 0 : parents.length}
        lockLoading={bulk.submitting}
        lockError={bulk.error}
        onConfirmLock={confirmLock}
        onCancelLock={() => !bulk.submitting && setLockConfirm(null)}
        featureOpen={featureOpen}
        featureCompanies={selectedRows}
        featureLoading={bulk.submitting}
        featureError={bulk.error}
        onSubmitFeature={submitFeature}
        onCancelFeature={() => !bulk.submitting && setFeatureOpen(false)}
        resetOpen={resetOpen}
        resetLoading={reset.resetting}
        resetError={reset.error}
        onConfirmReset={confirmReset}
        onCancelReset={() => !reset.resetting && setResetOpen(false)}
      />
    </div>
  );
}
