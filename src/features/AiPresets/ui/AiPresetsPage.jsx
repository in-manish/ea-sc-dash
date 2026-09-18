import { AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useAiPresetEditor } from '../hooks/useAiPresetEditor';
import { useAiPresetList } from '../hooks/useAiPresetList';
import { useDeleteAiPreset } from '../hooks/useDeleteAiPreset';
import AiPresetEditorModal from './AiPresetEditorModal';
import AiPresetTable from './AiPresetTable';
import AiPresetsHeader from './AiPresetsHeader';

export default function AiPresetsPage() {
  const { token, logout } = useAuth();
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const list = useAiPresetList({ token, onUnauthorized: logout });
  const editor = useAiPresetEditor({ token, onUnauthorized: logout });
  const goPreview = () => navigate(`/event/${eventId}/ai/preview`);
  const onDelete = useDeleteAiPreset({
    token,
    onUnauthorized: logout,
    onDeleted: list.reload,
  });

  const handleSubmit = async () => {
    const saved = await editor.submit();
    if (saved) list.reload();
  };

  return (
    <div className="ai-presets-page animate-fade-in max-w-[1200px]">
      <AiPresetsHeader
        onCreate={editor.startCreate}
        onPreview={goPreview}
        loading={list.loading}
      />

      {list.error ? (
        <div className="bg-red-50 text-danger p-4 rounded-lg text-sm border border-red-100 mb-6 flex items-start gap-2.5">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-0.5">Error loading presets</h4>
            <p className="text-red-600 mb-0">{list.error}</p>
          </div>
        </div>
      ) : null}

      {list.loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-bg-primary rounded-lg border border-border shadow-sm">
          <Loader2 size={40} className="animate-spin text-accent mb-4" />
          <span className="text-text-secondary font-medium">Loading presets...</span>
        </div>
      ) : (
        <AiPresetTable
          rows={list.results}
          onEdit={editor.startEdit}
          onDelete={onDelete}
          onPreview={goPreview}
        />
      )}

      {editor.isOpen && (
        <AiPresetEditorModal
          isCreate={editor.isCreate}
          form={editor.form}
          fieldErrors={editor.fieldErrors}
          error={editor.error}
          isSaving={editor.isSaving}
          onPatch={editor.patch}
          onClose={editor.close}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
