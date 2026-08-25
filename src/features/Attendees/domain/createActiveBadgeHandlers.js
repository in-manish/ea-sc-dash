import { eligibleForCreate } from './summarizeActiveBadge';
import {
  fetchActiveBadgeStatus,
  createActiveBadges,
  selectedStatusBody,
  allEligibleBody,
  createFromEligibleItems,
  noneEligibleMessage,
  confirmCreateMessage,
} from './activeBadgeFlow';

/** Imperative status/create handlers; UI supplies openResult + alerts. */
export function createActiveBadgeHandlers(deps) {
  const {
    getEventId,
    getToken,
    getSelection,
    getStatusResult,
    getScope,
    openResult,
    showAlert,
    showConfirm,
    setChecking,
    setCreating,
  } = deps;

  const runStatus = async (body, scope) => {
    setChecking(true);
    try {
      const summarized = await fetchActiveBadgeStatus(
        getEventId(),
        getToken(),
        body,
      );
      openResult('status', summarized, scope);
      return summarized;
    } catch (err) {
      await showAlert(
        err.message || 'Failed to check status.',
        'error',
        'Active Badge',
      );
      return null;
    } finally {
      setChecking(false);
    }
  };

  const runCreate = async (body, scope, message) => {
    const ok = await showConfirm(message, {
      title: 'Create Active Badges',
      confirmText: 'Create',
      cancelText: 'Cancel',
    });
    if (!ok) return;
    setCreating(true);
    try {
      openResult(
        'create',
        await createActiveBadges(getEventId(), getToken(), body),
        scope,
      );
    } catch (err) {
      await showAlert(
        err.message || 'Failed to create.',
        'error',
        'Active Badge',
      );
    } finally {
      setCreating(false);
    }
  };

  const createAllEligible = async () => {
    if (!getEventId() || !getToken()) return;
    let preview = getStatusResult()?.allWithoutActive
      ? getStatusResult()
      : null;
    if (!preview) {
      // Preview first so the user can review, then confirm via modal CTA
      // or click Create all eligible again.
      preview = await runStatus(allEligibleBody(), 'all');
      if (!preview?.eligible?.length) {
        await showAlert(
          'No contact badges are missing an active badge.',
          'info',
          'Active Badge',
        );
      }
      return;
    }
    if (!preview.eligible.length) {
      await showAlert(
        'No contact badges are missing an active badge.',
        'info',
        'Active Badge',
      );
      return;
    }
    await runCreate(
      allEligibleBody(),
      'all',
      confirmCreateMessage(preview.eligible.length, { all: true }),
    );
  };

  return {
    previewAllEligible: async () => {
      if (!getEventId() || !getToken()) return;
      await runStatus(allEligibleBody(), 'all');
    },

    checkSelected: async () => {
      const { canUseSelection, uuids } = getSelection();
      if (!getEventId() || !getToken() || !canUseSelection) {
        await showAlert(
          'Select attendees on this page, or use Preview eligible.',
          'info',
          'Active Badge',
        );
        return;
      }
      await runStatus(selectedStatusBody(uuids), 'selected');
    },

    createAllEligible,

    createFromPreview: async () => {
      const status = getStatusResult();
      if (!status?.eligible?.length) return;
      if (status.allWithoutActive || getScope() === 'all') {
        await createAllEligible();
        return;
      }
      await runCreate(
        createFromEligibleItems(status.data),
        'selected',
        confirmCreateMessage(status.eligible.length),
      );
    },

    setSelected: async () => {
      const { canUseSelection, uuids } = getSelection();
      if (!getEventId() || !getToken() || !canUseSelection) {
        await showAlert(
          'Select attendees on this page, or use Create all eligible.',
          'info',
          'Active Badge',
        );
        return;
      }
      let status = getStatusResult()?.allWithoutActive
        ? null
        : getStatusResult();
      if (!status) {
        status = await runStatus(selectedStatusBody(uuids), 'selected');
        if (!status) return;
      }
      const toCreate = eligibleForCreate(status.data);
      if (!toCreate.length) {
        await showAlert(noneEligibleMessage(status), 'info', 'Active Badge');
        return;
      }
      await runCreate(
        createFromEligibleItems(status.data),
        'selected',
        confirmCreateMessage(toCreate.length, { selectedTotal: uuids.length }),
      );
    },
  };
}
