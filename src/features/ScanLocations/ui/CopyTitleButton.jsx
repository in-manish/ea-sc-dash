import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const done = document.execCommand('copy');
    document.body.removeChild(area);
    return done;
  }
}

/** A small button that copies a title to the clipboard. It never selects the row it sits in. */
export default function CopyTitleButton({ text, label = 'Copy title' }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (event) => {
    event.stopPropagation();
    if (!(await copyText(text))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" onClick={copy} title={copied ? 'Copied' : label} aria-label={label}
      className="inline-flex shrink-0 items-center rounded-md border border-border p-1 text-text-tertiary hover:text-text-primary hover:bg-bg-secondary">
      {copied ? <Check size={13} className="text-green-700" /> : <Copy size={13} />}
    </button>
  );
}
