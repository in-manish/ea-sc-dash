import { Loader2 } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import usePermissionCodes from '../hooks/usePermissionCodes';
import { usePermissionHolderMetrics } from '../hooks/usePermissionMetrics';
import PanelMessage from './PanelMessage';
import PermissionCodeForm from './PermissionCodeForm';
import PermissionCodeTable from './PermissionCodeTable';

export default function PermissionCodesPanel({ eventId, token, user, focusId, onUnauthorized }) {
  const { showConfirm } = useAlert();
  const {
    codes, loading, error, notice, clearNotice, clearError, canEdit, refresh, createCode, updateCode, removeCode,
  } = usePermissionCodes(eventId, token, onUnauthorized, user);

  const holders = usePermissionHolderMetrics(eventId, token, onUnauthorized, { enabled: canEdit });
  const usage = new Map((holders.data?.permissions || []).map((row) => [row.id, row]));

  const remove = async (row) => {
    const ok = await showConfirm(
      `Delete code ${row.code} (${row.name})? If a location or badge still uses it, delete is refused until you remove it there.`,
      { title: 'Delete permission code', confirmText: 'Delete', variant: 'danger' },
    );
    if (!ok) return;
    try {
      await removeCode(row);
    } catch {
      /* message is on the panel banner */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => { refresh(); if (canEdit) holders.refresh(true); }}
          disabled={loading}
          className="text-sm font-semibold text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      <PanelMessage type="success" text={notice} onClear={clearNotice} />
      <PanelMessage type="error" text={error} onClear={clearError} />
      {canEdit ? <PermissionCodeForm onCreate={createCode} /> : null}
      {loading ? (
        <div className="h-40 flex items-center justify-center gap-2 text-text-secondary">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Loading permission codes…</span>
        </div>
      ) : null}
      {!loading && codes.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-10 border border-dashed border-border rounded-2xl m-0">
          No permission codes for this event yet.
        </p>
      ) : null}
      {codes.length > 0 ? (
        <PermissionCodeTable
          codes={codes}
          eventId={eventId}
          focusId={focusId}
          canEdit={canEdit}
          usage={usage}
          onSave={updateCode}
          onDelete={remove}
        />
      ) : null}
    </div>
  );
}
