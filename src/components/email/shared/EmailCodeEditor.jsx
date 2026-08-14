import { useRef } from 'react';
import {
  highlightEscapedHtml,
  placeholderAtIndex,
  PLACEHOLDER_HIGHLIGHT_CSS,
} from './placeholderHighlight';

export default function EmailCodeEditor({
  value,
  onChange,
  highlightName,
  onHover,
  onLeave,
  onToggle,
}) {
  const preRef = useRef(null);
  const html = highlightEscapedHtml(value, highlightName);
  const interactive = Boolean(onHover || onToggle);

  if (!interactive) {
    return (
      <div className="flex-1 p-4 bg-gray-50">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-6 text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none shadow-premium-sm"
          placeholder="Write your email content or HTML, or browse a file..."
          style={{ minHeight: '500px' }}
        />
      </div>
    );
  }

  const syncFromCaret = (el, pin) => {
    const name = placeholderAtIndex(el.value, el.selectionStart);
    if (name) {
      if (pin) onToggle?.(name);
      else onHover?.(name);
    } else {
      onLeave?.();
    }
  };

  return (
    <div className="flex-1 p-4 bg-gray-50">
      <style>{PLACEHOLDER_HIGHLIGHT_CSS}</style>
      <div className="relative h-full min-h-[500px]">
        <pre
          ref={preRef}
          className="absolute inset-0 m-0 p-6 overflow-auto whitespace-pre-wrap break-words text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded-xl"
          aria-hidden
          dangerouslySetInnerHTML={{ __html: html || ' ' }}
        />
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            if (!preRef.current) return;
            preRef.current.scrollTop = e.target.scrollTop;
            preRef.current.scrollLeft = e.target.scrollLeft;
          }}
          onKeyUp={(e) => syncFromCaret(e.target, false)}
          onClick={(e) => syncFromCaret(e.target, true)}
          className="absolute inset-0 w-full h-full p-6 text-sm font-mono bg-transparent text-transparent caret-gray-900 border border-transparent rounded-xl resize-none focus:outline-none"
          placeholder="Write your email content or HTML, or browse a file..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
