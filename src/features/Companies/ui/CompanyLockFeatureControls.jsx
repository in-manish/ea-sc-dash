import { useState } from 'react';
import { Lock, Star, Unlock } from 'lucide-react';
import { useCompanyBulkAction } from '../hooks/useCompanyBulkAction';
import {
  buildFeatureCompanyPayload,
  buildLockCompanyPayload,
  featureSuccessMessage,
  isParentExhibitor,
  lockSuccessMessage,
} from '../domain/companyBulkActionPayload';
import ConfirmCompanyLockModal from './ConfirmCompanyLockModal';
import FeatureCompanyModal from './FeatureCompanyModal';

export default function CompanyLockFeatureControls({
  eventId,
  token,
  company,
  onUpdated,
}) {
  const { submitting, success, error, run, clearMessages } = useCompanyBulkAction({
    eventId,
    token,
  });
  const [lockConfirm, setLockConfirm] = useState(null);
  const [featureOpen, setFeatureOpen] = useState(false);

  const isParent = isParentExhibitor(company);
  const locked = Boolean(company.is_company_submit_locked);

  const confirmLock = async () => {
    if (!lockConfirm) return;
    const data = await run(
      buildLockCompanyPayload({
        companyIds: [company.id],
        locked: lockConfirm.locked,
      }),
      (result) => lockSuccessMessage(result, lockConfirm.locked),
    );
    if (!data) return;
    setLockConfirm(null);
    onUpdated?.();
  };

  const submitFeature = async (rows) => {
    const data = await run(buildFeatureCompanyPayload(rows), featureSuccessMessage);
    if (!data) return;
    setFeatureOpen(false);
    onUpdated?.();
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={submitting || !isParent}
          onClick={() => {
            clearMessages();
            setLockConfirm({ locked: !locked });
          }}
          title={isParent ? `${locked ? 'Unlock' : 'Lock'} company submit` : 'Lock applies to parent exhibitors only'}
        >
          {locked ? <Unlock size={14} /> : <Lock size={14} />}
          {locked ? 'Unlock submit' : 'Lock submit'}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={submitting || !isParent}
          onClick={() => {
            clearMessages();
            setFeatureOpen(true);
          }}
          title={isParent ? 'Set featured flag and rank' : 'Feature / rank applies to parent exhibitors only'}
        >
          <Star size={14} />
          Feature / rank
        </button>
      </div>
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2 m-0">
          {success}
        </p>
      )}
      {!lockConfirm && !featureOpen && error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2 m-0">
          {error}
        </p>
      )}
      {lockConfirm && (
        <ConfirmCompanyLockModal
          locked={lockConfirm.locked}
          parentCount={1}
          loading={submitting}
          error={error}
          onConfirm={confirmLock}
          onCancel={() => !submitting && setLockConfirm(null)}
        />
      )}
      {featureOpen && (
        <FeatureCompanyModal
          companies={[company]}
          loading={submitting}
          error={error}
          onSubmit={submitFeature}
          onCancel={() => !submitting && setFeatureOpen(false)}
        />
      )}
    </div>
  );
}
