import { Eye, Loader2, Plus, Sparkles } from 'lucide-react';

export default function AiPresetsHeader({ onCreate, onPreview, loading }) {
  return (
    <div className="mb-6 pb-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight m-0 flex items-center gap-2">
          <Sparkles size={22} className="text-accent" />
          AI
        </h1>
        <p className="text-sm text-text-secondary mt-1 mb-0">
          System prompt presets for matchmaking and other organizer AI tools.
          Use key <code className="text-xs bg-bg-secondary px-1.5 py-0.5 rounded">mm_seeking_mapper</code> for
          matchmaking.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
          onClick={onPreview}
          disabled={loading}
        >
          <Eye size={16} />
          Preview mapper
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
          onClick={onCreate}
          disabled={loading}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create preset
        </button>
      </div>
    </div>
  );
}
