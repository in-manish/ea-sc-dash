import { useCallback } from 'react';
import { deletePreset } from '../api/aiPresetsApi';
import { useAlert } from '../../../contexts/AlertContext';

export function useDeleteAiPreset({ token, onUnauthorized, onDeleted }) {
  const { showConfirm, showAlert } = useAlert();

  return useCallback(
    async (preset) => {
      const ok = await showConfirm(
        `Delete "${preset.name || preset.preset_key}"? This cannot be undone.`,
        { title: 'Delete preset', confirmText: 'Delete', variant: 'danger' }
      );
      if (!ok) return false;
      try {
        await deletePreset(token, preset.id);
        onDeleted?.();
        return true;
      } catch (err) {
        if (err.status === 401) onUnauthorized?.();
        await showAlert(err.message || 'Failed to delete preset.', 'error');
        return false;
      }
    },
    [token, onUnauthorized, onDeleted, showConfirm, showAlert]
  );
}
