import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { eligibleForCreate } from '../domain/summarizeActiveBadge';
import { createActiveBadgeHandlers } from '../domain/createActiveBadgeHandlers';
import { transferActiveBadge } from '../domain/activeBadgeFlow';

export default function useActiveBadgeActions({
  selectedEvent,
  token,
  selectionMode,
  selectedAttendeeUuids,
  clearSelection,
}) {
  const { showAlert, showConfirm } = useAlert();
  const [checking, setChecking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [createResult, setCreateResult] = useState(null);
  const [transferResult, setTransferResult] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultKind, setResultKind] = useState(null);
  const [scope, setScope] = useState(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const uuidsKey = selectedAttendeeUuids.join(',');
  const clearRef = useRef(clearSelection);
  clearRef.current = clearSelection;
  const statusRef = useRef(statusResult);
  statusRef.current = statusResult;
  const scopeRef = useRef(scope);
  scopeRef.current = scope;
  const openResultRef = useRef(null);

  useEffect(() => {
    // Keep event-wide eligible preview; only reset selection-scoped status.
    if (statusRef.current?.allWithoutActive) return;
    setStatusResult(null);
    setScope(null);
    setResultKind((kind) => {
      if (kind === 'status') {
        setResultOpen(false);
        return null;
      }
      return kind;
    });
  }, [uuidsKey, selectionMode]);

  const canUseSelection =
    selectionMode === 'selected' && selectedAttendeeUuids.length > 0;
  const eligible = statusResult ? eligibleForCreate(statusResult.data) : null;
  const canCreateFromPreview = Boolean(eligible?.length);
  const canSetSelected =
    canUseSelection &&
    (!statusResult || statusResult.allWithoutActive || canCreateFromPreview);

  const openResult = (kind, payload, nextScope) => {
    setResultKind(kind);
    setScope(nextScope ?? null);
    if (kind === 'status') setStatusResult(payload);
    if (kind === 'create') setCreateResult(payload);
    setResultOpen(true);
  };
  openResultRef.current = openResult;

  const closeResult = () => {
    const wasCreate = resultKind === 'create';
    setResultOpen(false);
    setResultKind(null);
    if (!wasCreate) return;
    setStatusResult(null);
    setScope(null);
    clearRef.current?.();
  };

  const handlers = useMemo(
    () =>
      createActiveBadgeHandlers({
        getEventId: () => selectedEvent?.id,
        getToken: () => token,
        getSelection: () => ({
          canUseSelection:
            selectionMode === 'selected' && selectedAttendeeUuids.length > 0,
          uuids: selectedAttendeeUuids,
        }),
        getStatusResult: () => statusRef.current,
        getScope: () => scopeRef.current,
        openResult: (...args) => openResultRef.current?.(...args),
        showAlert,
        showConfirm,
        setChecking,
        setCreating,
      }),
    [selectedEvent?.id, token, selectionMode, uuidsKey, showAlert, showConfirm],
  );

  const openTransferModal = useCallback(() => {
    setTransferResult(null);
    setTransferModalOpen(true);
  }, []);

  const closeTransferModal = useCallback(() => {
    setTransferModalOpen(false);
    setTransferResult(null);
  }, []);

  const runTransfer = useCallback(
    async (sourceRegId, targetRegId) => {
      if (!selectedEvent?.id || !token) return;
      setTransferring(true);
      setTransferResult(null);
      try {
        const result = await transferActiveBadge(
          selectedEvent.id,
          token,
          sourceRegId,
          targetRegId,
        );
        setTransferResult(result);
      } catch (err) {
        setTransferResult({ success: false, error: err.message });
      } finally {
        setTransferring(false);
      }
    },
    [selectedEvent?.id, token],
  );

  return {
    checking,
    creating,
    transferring,
    busy: checking || creating || transferring,
    canUseSelection,
    canSetSelected,
    canCreateFromPreview,
    statusResult,
    createResult,
    transferResult,
    resultOpen,
    resultKind,
    closeResult,
    previewAllEligible: handlers.previewAllEligible,
    checkSelected: handlers.checkSelected,
    createAllEligible: handlers.createAllEligible,
    createFromPreview: handlers.createFromPreview,
    setSelected: handlers.setSelected,
    // Transfer
    transferModalOpen,
    openTransferModal,
    closeTransferModal,
    runTransfer,
  };
}
