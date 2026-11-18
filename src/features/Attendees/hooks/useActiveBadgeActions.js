import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useAlert } from '../../../contexts/AlertContext';
import { eligibleForCreate } from '../domain/summarizeActiveBadge';
import { createActiveBadgeHandlers } from '../domain/createActiveBadgeHandlers';
import { transferActiveBadge } from '../domain/activeBadgeFlow';
import { activeBadgeApi, buildActiveBadgeBody } from '../api/activeBadgeApi';
import { getApiUrl } from '../../../config';

export default function useActiveBadgeActions({
  selectedEvent,
  token,
  selectionMode,
  selectedAttendeeUuids,
  selectedAttendees = [],
  clearSelection,
}) {
  const { showAlert, showConfirm } = useAlert();
  const [checking, setChecking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [searching, setSearching] = useState(false);
  const [checkingActiveBadge, setCheckingActiveBadge] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [createResult, setCreateResult] = useState(null);
  const [transferResult, setTransferResult] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultKind, setResultKind] = useState(null);
  const [scope, setScope] = useState(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [sourceActiveBadge, setSourceActiveBadge] = useState(null);
  const [checkedActiveBadges, setCheckedActiveBadges] = useState({});
  // Table-level active badge checks (separate from modal)
  const [tableCheckedActiveBadges, setTableCheckedActiveBadges] = useState({});
  const [tableCheckingUuid, setTableCheckingUuid] = useState(null);
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

  // Transfer: requires exactly one selected attendee with evc_id
  const transferSourceAttendee = useMemo(() => {
    if (selectionMode !== 'selected' || selectedAttendees.length !== 1) return null;
    const attendee = selectedAttendees[0];
    // Must have evc_id (linked to SC / has active badge)
    if (!attendee?.evc_id) return null;
    return attendee;
  }, [selectionMode, selectedAttendees]);

  const canTransfer = Boolean(transferSourceAttendee);

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

  const openTransferModal = useCallback(async () => {
    if (!canTransfer) {
      await showAlert(
        'Select exactly one attendee with an active badge to transfer.',
        'info',
        'Transfer Active Badge',
      );
      return;
    }
    setTransferResult(null);
    setSearchResults([]);
    setSourceActiveBadge(null);
    setCheckedActiveBadges({});
    setTransferModalOpen(true);

    if (!selectedEvent?.id || !token) return;

    // Fetch source's active badge info
    const sourceUuid = transferSourceAttendee?.uuid;
    if (sourceUuid) {
      try {
        const statusData = await activeBadgeApi.getStatus(
          selectedEvent.id,
          token,
          buildActiveBadgeBody({ uuids: [sourceUuid] })
        );
        // Response: { data: [{ uuid, has_active_badge, active_badge_id, ... }] }
        const items = statusData?.data || [];
        const found = items.find(item => item.uuid === sourceUuid);
        if (found?.has_active_badge && found?.active_badge_id) {
          setSourceActiveBadge({ id: found.active_badge_id });
        }
      } catch (err) {
        console.error('Failed to fetch source active badge:', err);
      }
    }

    // Fetch initial suggestions (top 5)
    setSearching(true);
    try {
      const params = new URLSearchParams({ page_size: '5' });
      const response = await fetch(
        `${getApiUrl()}/events/${selectedEvent.id}/attendees/search?${params}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || data.users || []);
      }
    } catch (err) {
      console.error('Initial suggestions error:', err);
    } finally {
      setSearching(false);
    }
  }, [canTransfer, showAlert, selectedEvent?.id, token, transferSourceAttendee?.uuid]);

  const closeTransferModal = useCallback(() => {
    setTransferModalOpen(false);
    setTransferResult(null);
    setSearchResults([]);
    setSourceActiveBadge(null);
    setCheckedActiveBadges({});
  }, []);

  const checkActiveBadgeForUuid = useCallback(
    async (uuid) => {
      if (!selectedEvent?.id || !token || !uuid) return;
      setCheckingActiveBadge(true);
      try {
        const statusData = await activeBadgeApi.getStatus(
          selectedEvent.id,
          token,
          buildActiveBadgeBody({ uuids: [uuid] })
        );
        // Response: { data: [{ uuid, has_active_badge, active_badge_id, ... }] }
        const items = statusData?.data || [];
        const found = items.find(item => item.uuid === uuid);
        if (found?.has_active_badge && found?.active_badge_id) {
          setCheckedActiveBadges(prev => ({
            ...prev,
            [uuid]: { id: found.active_badge_id },
          }));
        } else {
          setCheckedActiveBadges(prev => ({
            ...prev,
            [uuid]: null, // checked but no active badge
          }));
        }
      } catch (err) {
        console.error('Failed to check active badge:', err);
        setCheckedActiveBadges(prev => ({
          ...prev,
          [uuid]: null,
        }));
      } finally {
        setCheckingActiveBadge(false);
      }
    },
    [selectedEvent?.id, token]
  );

  const searchForTarget = useCallback(
    async (query) => {
      if (!selectedEvent?.id || !token || !query) return;
      setSearching(true);
      try {
        const params = new URLSearchParams({
          search_query: query,
          page_size: '10',
        });
        const response = await fetch(
          `${getApiUrl()}/events/${selectedEvent.id}/attendees/search?${params}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Token ${token}`,
            },
          },
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSearchResults(data.results || data.users || []);
      } catch (err) {
        console.error('Transfer search error:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    },
    [selectedEvent?.id, token],
  );

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
        if (result.success) {
          clearRef.current?.();
        }
      } catch (err) {
        setTransferResult({ success: false, error: err.message });
      } finally {
        setTransferring(false);
      }
    },
    [selectedEvent?.id, token],
  );

  // Table-level active badge check (for attendee rows)
  const checkActiveBadgeInTable = useCallback(
    async (uuid) => {
      if (!selectedEvent?.id || !token || !uuid) return;
      setTableCheckingUuid(uuid);
      try {
        const statusData = await activeBadgeApi.getStatus(
          selectedEvent.id,
          token,
          buildActiveBadgeBody({ uuids: [uuid] })
        );
        // Response: { data: [{ uuid, has_active_badge, active_badge_id, ... }] }
        const items = statusData?.data || [];
        const found = items.find(item => item.uuid === uuid);
        if (found?.has_active_badge && found?.active_badge_id) {
          setTableCheckedActiveBadges(prev => ({
            ...prev,
            [uuid]: { id: found.active_badge_id },
          }));
        } else {
          setTableCheckedActiveBadges(prev => ({
            ...prev,
            [uuid]: null, // checked but no active badge
          }));
        }
      } catch (err) {
        console.error('Failed to check active badge:', err);
        setTableCheckedActiveBadges(prev => ({
          ...prev,
          [uuid]: null,
        }));
      } finally {
        setTableCheckingUuid(null);
      }
    },
    [selectedEvent?.id, token]
  );

  return {
    checking,
    creating,
    transferring,
    searching,
    checkingActiveBadge,
    busy: checking || creating || transferring,
    canUseSelection,
    canSetSelected,
    canCreateFromPreview,
    canTransfer,
    statusResult,
    createResult,
    transferResult,
    searchResults,
    resultOpen,
    resultKind,
    closeResult,
    previewAllEligible: handlers.previewAllEligible,
    checkSelected: handlers.checkSelected,
    createAllEligible: handlers.createAllEligible,
    createFromPreview: handlers.createFromPreview,
    setSelected: handlers.setSelected,
    // Transfer modal
    transferModalOpen,
    transferSourceAttendee,
    sourceActiveBadge,
    checkedActiveBadges,
    openTransferModal,
    closeTransferModal,
    searchForTarget,
    runTransfer,
    checkActiveBadgeForUuid,
    // Table-level active badge check
    tableCheckedActiveBadges,
    tableCheckingUuid,
    checkActiveBadgeInTable,
  };
}
