import { MATCHMAKING_PRESET_KEY, QUESTION_OPTIONS_TOKEN } from '../constants';

const fieldClass =
  'w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-danger mt-1 mb-0">{message}</p>;
}

export default function AiPresetFormFields({ form, fieldErrors, isCreate, onPatch }) {
  const needsCatalog = form.preset_key.trim() === MATCHMAKING_PRESET_KEY;
  const missingToken = needsCatalog && !form.system_prompt.includes(QUESTION_OPTIONS_TOKEN);

  const insertToken = () => {
    if (form.system_prompt.includes(QUESTION_OPTIONS_TOKEN)) return;
    const next = form.system_prompt.trimEnd();
    onPatch({ system_prompt: next ? `${next}\n\n${QUESTION_OPTIONS_TOKEN}` : QUESTION_OPTIONS_TOKEN });
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="block">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Preset key</span>
        <input
          className={`${fieldClass} mt-1.5 font-mono ${isCreate ? '' : 'opacity-70'}`}
          value={form.preset_key}
          onChange={(e) => onPatch({ preset_key: e.target.value })}
          disabled={!isCreate}
          placeholder="mm_seeking_mapper"
        />
        <FieldError message={fieldErrors.preset_key} />
        {!isCreate && (
          <p className="text-xs text-text-tertiary mt-1 mb-0">Key cannot change after create.</p>
        )}
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</span>
        <input
          className={`${fieldClass} mt-1.5`}
          value={form.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          placeholder="Matchmaking seeking mapper"
        />
        <FieldError message={fieldErrors.name} />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">System prompt</span>
        <textarea
          className={`${fieldClass} mt-1.5 min-h-[240px] font-mono leading-relaxed resize-y`}
          value={form.system_prompt}
          onChange={(e) => onPatch({ system_prompt: e.target.value })}
        />
        <FieldError message={fieldErrors.system_prompt} />
        {needsCatalog && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={insertToken}
              disabled={!missingToken}
            >
              Insert {QUESTION_OPTIONS_TOKEN}
            </button>
            {missingToken ? (
              <span className="text-xs text-danger">Required for matchmaking catalog injection.</span>
            ) : (
              <span className="text-xs text-text-tertiary">Catalog token is present.</span>
            )}
          </div>
        )}
      </label>

      <div className="flex flex-wrap gap-5">
        <label className="inline-flex items-center gap-2 text-sm text-text-primary cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => onPatch({ is_active: e.target.checked })}
          />
          Active
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-text-primary cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) => onPatch({ is_default: e.target.checked })}
          />
          Default (only one active default)
        </label>
      </div>
    </div>
  );
}
