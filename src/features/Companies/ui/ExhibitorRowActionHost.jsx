import { useCompanyBulkAction } from '../hooks/useCompanyBulkAction';
import { useExhibitorPasswordReset } from '../hooks/useExhibitorPasswordReset';
import { exhibitorPasswordResetPayload } from '../domain/exhibitorPasswordResetPayload';
import {
  buildFeatureCompanyPayload,
  buildLockCompanyPayload,
  featureSuccessMessage,
  lockSuccessMessage,
} from '../domain/companyBulkActionPayload';
import ConfirmCompanyLockModal from './ConfirmCompanyLockModal';
import ConfirmExhibitorPasswordResetModal from './ConfirmExhibitorPasswordResetModal';
import FeatureCompanyModal from './FeatureCompanyModal';

/**
 * Confirm dialogs for a single row ⋯ action (reset / lock / feature).
 */
export default function ExhibitorRowActionHost({
  eventId,
  token,
  company,
  action,
  onClose,
  onUpdated,
}) {
  const bulk = useCompanyBulkAction({ eventId, token });
  const reset = useExhibitorPasswordReset({ eventId, token });
  const targetLocked = !Boolean(company?.is_company_submit_locked);

  if (!company || !action) return null;

  const onConfirmLock = async () => {
    const data = await bulk.run(
      buildLockCompanyPayload({
        companyIds: [company.id],
        locked: targetLocked,
      }),
      (result) => lockSuccessMessage(result, targetLocked),
    );
    if (!data) return;
    onUpdated?.();
    onClose();
  };

  const onSubmitFeature = async (rows) => {
    const data = await bulk.run(buildFeatureCompanyPayload(rows), featureSuccessMessage);
    if (!data) return;
    onUpdated?.();
    onClose();
  };

  const onConfirmReset = async () => {
    const ok = await reset.resetPassword(
      exhibitorPasswordResetPayload({ companyId: company.id }),
    );
    if (ok) onClose();
  };

  return (
    <>
      {action === 'lock' && (
        <ConfirmCompanyLockModal
          locked={targetLocked}
          parentCount={1}
          loading={bulk.submitting}
          error={bulk.error}
          onConfirm={onConfirmLock}
          onCancel={() => !bulk.submitting && onClose()}
        />
      )}
      {action === 'feature' && (
        <FeatureCompanyModal
          companies={[company]}
          loading={bulk.submitting}
          error={bulk.error}
          onSubmit={onSubmitFeature}
          onCancel={() => !bulk.submitting && onClose()}
        />
      )}
      {action === 'reset' && (
        <ConfirmExhibitorPasswordResetModal
          title="Reset exhibitor POC password"
          description="Resets the exhibitor portal password for this POC."
          loading={reset.resetting}
          error={reset.error}
          onConfirm={onConfirmReset}
          onCancel={() => !reset.resetting && onClose()}
        />
      )}
    </>
  );
}
