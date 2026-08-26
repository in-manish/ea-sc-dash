import ConfirmRemindSendModal from './ConfirmRemindSendModal';
import ConfirmCompanyLockModal from './ConfirmCompanyLockModal';
import ConfirmExhibitorPasswordResetModal from './ConfirmExhibitorPasswordResetModal';
import FeatureCompanyModal from './FeatureCompanyModal';

/** Confirm/form dialogs for list Actions menu operations. */
export default function ExhibitorListActionDialogs({
  confirmMode,
  selectedCount,
  onConfirmRemind,
  onCancelRemind,
  lockConfirm,
  lockParentCount,
  lockLoading,
  lockError,
  onConfirmLock,
  onCancelLock,
  featureOpen,
  featureCompanies,
  featureLoading,
  featureError,
  onSubmitFeature,
  onCancelFeature,
  resetOpen,
  resetLoading,
  resetError,
  onConfirmReset,
  onCancelReset,
}) {
  return (
    <>
      {confirmMode && (
        <ConfirmRemindSendModal
          mode={confirmMode}
          selectedCount={selectedCount}
          onConfirm={onConfirmRemind}
          onCancel={onCancelRemind}
        />
      )}
      {lockConfirm && (
        <ConfirmCompanyLockModal
          locked={lockConfirm.locked}
          all={lockConfirm.all}
          parentCount={lockParentCount}
          skippedCount={0}
          loading={lockLoading}
          error={lockError}
          onConfirm={onConfirmLock}
          onCancel={onCancelLock}
        />
      )}
      {featureOpen && (
        <FeatureCompanyModal
          companies={featureCompanies}
          loading={featureLoading}
          error={featureError}
          onSubmit={onSubmitFeature}
          onCancel={onCancelFeature}
        />
      )}
      {resetOpen && (
        <ConfirmExhibitorPasswordResetModal
          title="Reset exhibitor POC password"
          description="Resets the exhibitor portal password for this POC."
          loading={resetLoading}
          error={resetError}
          onConfirm={onConfirmReset}
          onCancel={onCancelReset}
        />
      )}
    </>
  );
}
