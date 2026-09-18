import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function AiPresetPreviewCopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="btn btn-ghost btn-sm inline-flex items-center gap-1.5 text-text-secondary"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : label}
    </button>
  );
}
