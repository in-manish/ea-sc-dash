import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import {
  highlightEscapedHtml,
  placeholderAtIndex,
  PLACEHOLDER_HIGHLIGHT_CSS,
} from './placeholderHighlight';
import {
  highlightTemplateCode,
  TEMPLATE_CODE_HIGHLIGHT_CSS,
} from './highlightTemplateCode';

export default function EmailCodeEditor({
  value,
  onChange,
  highlightName,
  onHover,
  onLeave,
  onToggle,
  insertRef,
  tokenRe,
}) {
  const preRef = useRef(null);
  const textareaRef = useRef(null);
  const caretRef = useRef({ start: 0, end: 0 });
  const valueRef = useRef(value);
  valueRef.current = value;
  const [syntaxHighlight, setSyntaxHighlight] = useState(true);
  const interactive = Boolean(onHover || onToggle);
  // Display-only: this never touches `value`/`onChange`, so a bug here can at
  // worst mis-paint the preview — it can never corrupt the saved content.
  const { html, issues } = useMemo(() => {
    if (!syntaxHighlight)
      return {
        html: highlightEscapedHtml(value, highlightName, tokenRe),
        issues: [],
      };
    try {
      return highlightTemplateCode(value, { highlightName, tokenRe });
    } catch {
      return {
        html: highlightEscapedHtml(value, highlightName, tokenRe),
        issues: [],
      };
    }
  }, [value, highlightName, tokenRe, syntaxHighlight]);

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
    const name = placeholderAtIndex(el.value, el.selectionStart, tokenRe);
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
    <div className="flex-1 p-4 bg-gray-50 flex flex-col gap-2 overflow-hidden">
      <style>{PLACEHOLDER_HIGHLIGHT_CSS}</style>
      <style>{TEMPLATE_CODE_HIGHLIGHT_CSS}</style>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setSyntaxHighlight((on) => !on)}
          title="Toggle HTML/Jinja syntax highlighting"
          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border inline-flex items-center gap-1.5 ${
            syntaxHighlight
              ? 'bg-accent/10 border-accent/30 text-accent'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Sparkles size={12} />
          Highlight
        </button>
        {syntaxHighlight && issues.length > 0 ? (
          <span
            className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 border border-red-200 text-red-600 inline-flex items-center gap-1.5"
            title={issues.map((issue) => issue.message).join('\n')}
          >
            <AlertTriangle size={12} />
            {issues.length} Jinja {issues.length === 1 ? 'issue' : 'issues'}
          </span>
        ) : null}
      </div>
      <div className="relative flex-1 min-h-[500px]">
        <pre
          ref={preRef}
          className="ea-code-pre absolute inset-0 m-0 p-6 overflow-auto whitespace-pre-wrap break-words text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded-xl"
          aria-hidden
          dangerouslySetInnerHTML={{ __html: html || ' ' }}
        />
        {field}
      </div>
    </div>
  );
}
