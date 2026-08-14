import { useEffect, useRef } from 'react';
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
  insertRef,
}) {
  const preRef = useRef(null);
  const textareaRef = useRef(null);
  const caretRef = useRef({ start: 0, end: 0 });
  const valueRef = useRef(value);
  valueRef.current = value;
  const html = highlightEscapedHtml(value, highlightName);
  const interactive = Boolean(onHover || onToggle);

  useEffect(() => {
    if (!insertRef) return undefined;
    insertRef.current = (token) => {
      const current = String(valueRef.current || '');
      const { start, end } = caretRef.current;
      const from = Number.isFinite(start) ? start : current.length;
      const to = Number.isFinite(end) ? end : from;
      const next = `${current.slice(0, from)}${token}${current.slice(to)}`;
      onChange(next);
      const pos = from + token.length;
      caretRef.current = { start: pos, end: pos };
      requestAnimationFrame(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
      return true;
    };
    return () => {
      insertRef.current = null;
    };
  }, [insertRef, onChange]);

  const saveCaret = (el) => {
    caretRef.current = {
      start: el.selectionStart ?? 0,
      end: el.selectionEnd ?? 0,
    };
  };

  const syncFromCaret = (el, pin) => {
    saveCaret(el);
    const name = placeholderAtIndex(el.value, el.selectionStart);
    if (name) {
      if (pin) onToggle?.(name);
      else onHover?.(name);
    } else {
      onLeave?.();
    }
  };

  const textareaClass = interactive
    ? 'absolute inset-0 w-full h-full p-6 text-sm font-mono bg-transparent text-transparent caret-gray-900 border border-transparent rounded-xl resize-none focus:outline-none'
    : 'w-full h-full p-6 text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none shadow-premium-sm';

  const field = (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        saveCaret(e.target);
        onChange(e.target.value);
      }}
      onSelect={(e) => saveCaret(e.target)}
      onScroll={(e) => {
        if (!preRef.current) return;
        preRef.current.scrollTop = e.target.scrollTop;
        preRef.current.scrollLeft = e.target.scrollLeft;
      }}
      onKeyUp={(e) => syncFromCaret(e.target, false)}
      onClick={(e) => syncFromCaret(e.target, interactive)}
      onBlur={(e) => saveCaret(e.target)}
      className={textareaClass}
      placeholder="Write your email content or HTML, or browse a file..."
      spellCheck={false}
      style={interactive ? undefined : { minHeight: '500px' }}
    />
  );

  if (!interactive) {
    return <div className="flex-1 p-4 bg-gray-50">{field}</div>;
  }

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
        {field}
      </div>
    </div>
  );
}
