import AiPresetPreviewCopyButton from './AiPresetPreviewCopyButton';

function lineCount(text) {
  if (!text) return 0;
  return String(text).split('\n').length;
}

export default function AiPresetPreviewPromptPane({ text }) {
  const body = text || '—';
  const lines = text ? lineCount(text) : 0;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-xs text-text-tertiary">{lines ? `${lines} lines` : 'Empty'}</span>
        <AiPresetPreviewCopyButton text={text || ''} />
      </div>
      <pre className="flex-1 min-h-0 overflow-auto custom-scrollbar text-xs font-mono leading-relaxed whitespace-pre-wrap break-words bg-bg-secondary border border-border rounded-lg p-4 m-0">
        {body}
      </pre>
    </div>
  );
}
