import { useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { useAlert } from '../../../contexts/AlertContext';
import { createScanLocation, deleteScanLocation, updateScanLocation } from '../api/scanLocationsApi';
import { buildScanLocationBody } from '../domain/buildScanLocationPatch';
import usePermissionCodes from '../hooks/usePermissionCodes';
import useScanLocations from '../hooks/useScanLocations';
import PanelMessage from './PanelMessage';
import ScanLocationCard from './ScanLocationCard';
import ScanLocationCreateForm from './ScanLocationCreateForm';
import ScanLocationEditor from './ScanLocationEditor';

export default function ScanLocationsPanel({ eventId, token, onUnauthorized }) {
  const { showConfirm } = useAlert();
  const { locations, loading, error, refresh, clearError } = useScanLocations(eventId, token, onUnauthorized);
  const codes = usePermissionCodes(eventId, token, onUnauthorized);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [notice, setNotice] = useState('');

  const fail = (err, fallback) => {
    setSaveError(err.message || fallback);
    if (err.status === 401) onUnauthorized?.();
  };

  const create = async (draft) => {
    setSaving(true);
    setSaveError('');
    try {
      await createScanLocation(token, eventId, buildScanLocationBody(draft));
      setNotice(`${draft.name} created.`);
      await refresh();
    } catch (err) {
      if (err.status === 401) onUnauthorized?.();
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const save = async (location, draft) => {
    setSaving(true);
    setSaveError('');
    try {
      await updateScanLocation(token, eventId, location.id, buildScanLocationBody(draft));
      setNotice(`${draft.name} updated.`);
      setEditingId(null);
      await refresh();
    } catch (err) {
      fail(err, 'Failed to update the scan location.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (location) => {
    const ok = await showConfirm(
      `Delete ${location.name}? It is hidden from this list. That name cannot be used again.`,
      { title: 'Delete scan location', confirmText: 'Delete', variant: 'danger' },
    );
    if (!ok) return;
    setSaving(true);
    setSaveError('');
    try {
      await deleteScanLocation(token, eventId, location.id);
      setNotice(`${location.name} deleted.`);
      if (editingId === location.id) setEditingId(null);
      await refresh();
    } catch (err) {
      fail(err, 'Failed to delete the scan location.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => { refresh(); codes.refresh(); }}
          disabled={loading}
          className="text-sm font-semibold text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      <PanelMessage type="success" text={notice} onClear={() => setNotice('')} />
      <PanelMessage type="error" text={error} onClear={clearError} />
      <PanelMessage type="error" text={saveError} onClear={() => setSaveError('')} />
      {codes.error ? <PanelMessage type="error" text={codes.error} onClear={codes.clearError} /> : null}
      <ScanLocationCreateForm
        codes={codes.codes}
        codesReady={!codes.loading}
        saving={saving}
        onCreate={create}
      />
      {loading ? (
        <div className="h-40 flex items-center justify-center gap-2 text-text-secondary">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Loading scan locations…</span>
        </div>
      ) : null}
      {!loading && !error && locations.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <MapPin size={24} className="mx-auto text-text-tertiary mb-2" />
          <p className="text-sm text-text-secondary m-0">No scan locations for this event</p>
        </div>
      ) : null}
      {!loading && locations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {locations.map((location) => (
            <ScanLocationCard
              key={location.id ?? location.name}
              location={location}
              onEdit={() => { setSaveError(''); setEditingId(location.id); }}
              onDelete={() => remove(location)}
            >
              {editingId === location.id ? (
                <ScanLocationEditor
                  location={location}
                  codes={codes.codes}
                  codesReady={!codes.loading}
                  saving={saving}
                  onCancel={() => setEditingId(null)}
                  onSave={(draft) => save(location, draft)}
                />
              ) : null}
            </ScanLocationCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}
