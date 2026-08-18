import { useState } from 'react';
import { Star } from 'lucide-react';
import { useCompanyBulkAction } from '../hooks/useCompanyBulkAction';
import {
  buildFeatureCompanyPayload,
  buildLockCompanyPayload,
  featureSuccessMessage,
  isParentExhibitor,
  lockSuccessMessage,
  parentCompanies,
} from '../domain/companyBulkActionPayload';
import ConfirmCompanyLockModal from './ConfirmCompanyLockModal';
import ExhibitorLockMenu from './ExhibitorLockMenu';
import FeatureCompanyModal from './FeatureCompanyModal';

export default function ExhibitorBulkActionBar({
  eventId,
  token,
  companies,
  selectedIds,
  onCleared,
  onUpdated,
}) {
  const { submitting, success, error, run, clearMessages } = useCompanyBulkAction({
    eventId,
    token,
  });
  const [lockConfirm, setLockConfirm] = useState(null);
  const [featureOpen, setFeatureOpen] = useState(false);

  const selected = companies.filter((c) => selectedIds.has(c.id));
  const parents = parentCompanies(selected);
  const hasCoExhibitors = selected.some((c) => !isParentExhibitor(c));
  const canLockSelected = parents.length >= 1 && !hasCoExhibitors;
  const canFeature = canLockSelected;
  const coExhibitorTitle = 'Deselect co-exhibitors. These actions apply to parent exhibitors only.';

  const openLock = (locked, all) => {
    if (!all && !canLockSelected) return;
    clearMessages();
    setLockConfirm({ locked, all });
  };

  const confirmLock = async () => {
    if (!lockConfirm) return;
    const data = await run(
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
    const data = await run(
      buildFeatureCompanyPayload(rows),
      featureSuccessMessage,
    );
    if (!data) return;
    setFeatureOpen(false);
    onCleared?.();
    onUpdated?.();
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <ExhibitorLockMenu
          disabled={submitting || hasCoExhibitors}
          disabledTitle={hasCoExhibitors ? coExhibitorTitle : undefined}
          parentCount={parents.length}
          hasCoExhibitors={hasCoExhibitors}
          onLockSelected={() => openLock(true, false)}
          onUnlockSelected={() => openLock(false, false)}
          onLockAll={() => openLock(true, true)}
          onUnlockAll={() => openLock(false, true)}
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
          disabled={submitting || !canFeature}
          onClick={() => {
            if (!canFeature) return;
            clearMessages();
            setFeatureOpen(true);
          }}
          title={
            hasCoExhibitors
              ? coExhibitorTitle
              : canFeature
                ? 'Set featured flag and rank for selected companies'
                : 'Select parent exhibitors to feature'
          }
        >
          <Star size={14} />
          Feature / rank
          {canFeature && (
            <span className="min-w-[1.15rem] h-4 px-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold leading-4 text-center">
              {parents.length}
            </span>
          )}
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
          all={lockConfirm.all}
          parentCount={parents.length}
          skippedCount={0}
          loading={submitting}
          error={error}
          onConfirm={confirmLock}
          onCancel={() => !submitting && setLockConfirm(null)}
        />
      )}
      {featureOpen && (
        <FeatureCompanyModal
          companies={selected}
          loading={submitting}
          error={error}
          onSubmit={submitFeature}
          onCancel={() => !submitting && setFeatureOpen(false)}
        />
      )}
    </div>
  );
}
