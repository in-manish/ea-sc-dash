import { useMemo, useState } from 'react';
import { QUESTION_OPTIONS_TOKEN } from '../constants';
import { catalogStats, parsePreviewCatalog } from '../domain/parsePreviewCatalog';
import { formatPreviewJson } from '../domain/previewQuery';
import AiPresetPreviewCatalog from './AiPresetPreviewCatalog';
import AiPresetPreviewPromptPane from './AiPresetPreviewPromptPane';
import AiPresetPreviewTabs from './AiPresetPreviewTabs';

export default function AiPresetPreviewResult({ result }) {
  const [tab, setTab] = useState('catalog');
  const questions = useMemo(
    () => parsePreviewCatalog(result?.catalog || ''),
    [result?.catalog]
  );
  const stats = catalogStats(questions);
  const userPrompt = formatPreviewJson(result?.user_prompt);

  if (!result) return null;

  const tabs = [
    {
      id: 'catalog',
      label: 'Catalog',
      meta: stats.questionCount ? `${stats.questionCount} Q` : null,
    },
    { id: 'system', label: 'System prompt' },
    { id: 'user', label: 'User prompt' },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary shrink-0">
        <span className="font-mono">{result.preset_key}</span>
        {result.preset_id != null ? <span>#{result.preset_id}</span> : null}
        {result.event_id != null ? <span>Event {result.event_id}</span> : null}
        {result.used_fallback ? (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-800">
            Fallback
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700">
            Saved preset
          </span>
        )}
      </div>
      {result.used_fallback ? (
        <p className="text-xs text-amber-800 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2 m-0 shrink-0">
          Using the fallback prompt because the saved preset is missing or has no{' '}
          <span className="font-mono">{QUESTION_OPTIONS_TOKEN}</span> token.
        </p>
      ) : null}
      <AiPresetPreviewTabs tabs={tabs} activeId={tab} onChange={setTab} />
      <div className="flex-1 min-h-0 pt-2 flex flex-col" role="tabpanel">
        {tab === 'catalog' ? <AiPresetPreviewCatalog catalog={result.catalog} /> : null}
        {tab === 'system' ? <AiPresetPreviewPromptPane text={result.system_prompt} /> : null}
        {tab === 'user' ? <AiPresetPreviewPromptPane text={userPrompt} /> : null}
      </div>
    </div>
  );
}
