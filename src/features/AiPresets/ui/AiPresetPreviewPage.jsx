import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { MATCHMAKING_PRESET_KEY } from '../constants';
import { useAiPresetPreview } from '../hooks/useAiPresetPreview';
import AiPresetPreviewForm from './AiPresetPreviewForm';
import AiPresetPreviewResult from './AiPresetPreviewResult';

export default function AiPresetPreviewPage() {
  const { token, logout } = useAuth();
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const preview = useAiPresetPreview({ token, eventId, onUnauthorized: logout });

  const handleSubmit = (e) => {
    e.preventDefault();
    preview.submit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-[calc(100vh-4rem)] min-h-0 animate-fade-in"
    >
      <header className="shrink-0 mb-4">
        <button
          type="button"
          onClick={() => navigate(`/event/${eventId}/ai`)}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary bg-transparent border-none cursor-pointer p-0 mb-3"
        >
          <ArrowLeft size={16} />
          Back to AI presets
        </button>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight m-0">
          Preview matchmaking prompt
        </h1>
        <p className="text-sm text-text-secondary mt-1 mb-0">
          Fills <span className="font-mono">{MATCHMAKING_PRESET_KEY}</span> with this event's seeking
          catalog. Does not call the LLM.
        </p>
      </header>

      <div className="shrink-0 bg-bg-primary border border-border rounded-lg p-4 mb-4">
        <AiPresetPreviewForm
          userQuery={preview.userQuery}
          filtersText={preview.filtersText}
          loading={preview.loading}
          onUserQueryChange={preview.setUserQuery}
          onFiltersChange={preview.setFiltersText}
        />
      </div>

      {preview.error ? (
        <div className="shrink-0 mb-4 text-sm text-danger bg-red-500/5 border border-red-500/20 rounded-md px-3 py-2 whitespace-pre-line">
          {preview.error}
        </div>
      ) : null}

      <div className="flex-1 min-h-0 bg-bg-primary border border-border rounded-lg p-4 flex flex-col overflow-hidden">
        {preview.loading && !preview.result ? (
          <div className="flex items-center gap-2 h-full text-sm text-text-secondary">
            <Loader2 size={16} className="animate-spin text-accent" />
            Loading catalog preview…
          </div>
        ) : (
          <AiPresetPreviewResult result={preview.result} />
        )}
      </div>
    </form>
  );
}
