import { useState, useRef, useEffect } from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { activeBadgeApi } from '../api/activeBadgeApi';
import {
  eligibleForCreate,
  summarizeStatus,
  summarizeCreate,
} from '../domain/summarizeActiveBadge';

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
  const [statusResult, setStatusResult] = useState(null);
  const [createResult, setCreateResult] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultKind, setResultKind] = useState(null);
  const uuidsKey = selectedAttendeeUuids.join(',');
  const clearSelectionRef = useRef(clearSelection);
  clearSelectionRef.current = clearSelection;

  useEffect(() => {
    setStatusResult(null);
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

  const eligible = statusResult
    ? eligibleForCreate(statusResult.data)
    : null;
  const canSetActiveBadge =
    canUseSelection && (!statusResult || (eligible && eligible.length > 0));

  const openResult = (kind, payload) => {
    setResultKind(kind);
    if (kind === 'status') setStatusResult(payload);
    if (kind === 'create') setCreateResult(payload);
    setResultOpen(true);
  };

  const closeResult = () => {
    const wasCreate = resultKind === 'create';
    setResultOpen(false);
    setResultKind(null);
    if (wasCreate) clearSelectionRef.current?.();
  };

  const checkStatus = async () => {
    if (!selectedEvent?.id || !token || !canUseSelection) {
      await showAlert(
        'Select specific attendees on this page to check active badge status.',
        'info',
        'Active Badge Status',
      );
      return;
    }

    setChecking(true);
    try {
      const raw = await activeBadgeApi.getStatus(selectedEvent.id, token, {
        uuids: selectedAttendeeUuids,
      });
      const summarized = summarizeStatus(raw);
      openResult('status', summarized);
    } catch (err) {
      await showAlert(
        err.message || 'Failed to check active badge status.',
        'error',
        'Active Badge Status',
      );
    } finally {
      setChecking(false);
    }
  };

  const setActiveBadge = async () => {
    if (!selectedEvent?.id || !token || !canUseSelection) {
      await showAlert(
        'Select specific attendees on this page to set active badges.',
        'info',
        'Set Active Badge',
      );
      return;
    }

    setCreating(true);
    try {
      let status = statusResult;
      if (!status) {
        const raw = await activeBadgeApi.getStatus(selectedEvent.id, token, {
          uuids: selectedAttendeeUuids,
        });
        status = summarizeStatus(raw);
        setStatusResult(status);
      }

      const toCreate = eligibleForCreate(status.data);
      if (!toCreate.length) {
        openResult('status', status);
        await showAlert(
          status.active.length
            ? 'All selected badges already have an active badge.'
            : 'No selected badges are eligible (need email or phone, and no active badge).',
          'info',
          'Set Active Badge',
        );
        return;
      }

      const confirmed = await showConfirm(
        `Create active badges for ${toCreate.length} attendee${toCreate.length === 1 ? '' : 's'}? Badges that already have an active badge will be skipped.`,
        {
          title: 'Set Active Badge',
          confirmText: 'Create',
          cancelText: 'Cancel',
        },
      );
      if (!confirmed) return;

      const raw = await activeBadgeApi.create(selectedEvent.id, token, {
        uuids: toCreate.map((item) => item.uuid).filter(Boolean),
      });
      const summarized = summarizeCreate(raw);
      openResult('create', summarized);
    } catch (err) {
      await showAlert(
        err.message || 'Failed to create active badges.',
        'error',
        'Set Active Badge',
      );
    } finally {
      setCreating(false);
    }
  };

  return {
    checking,
    creating,
    canUseSelection,
    canSetActiveBadge,
    statusResult,
    createResult,
    resultOpen,
    resultKind,
    closeResult,
    checkStatus,
    setActiveBadge,
  };
}
