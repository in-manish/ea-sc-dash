import { useEffect, useRef } from 'react';
import {
  paintPlaceholderRoot,
  PLACEHOLDER_HIGHLIGHT_CSS,
} from './placeholderHighlight';

export default function EmailPreviewFrame({
  html,
  highlightName,
  onHover,
  onLeave,
  onToggle,
}) {
  const iframeRef = useRef(null);
  const handlersRef = useRef({ onHover, onLeave, onToggle });
  handlersRef.current = { onHover, onLeave, onToggle };

  const apply = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.body) return;
    paintPlaceholderRoot(doc.body, highlightName, handlersRef.current);
    try {
      iframeRef.current.style.height = `${Math.max(500, doc.documentElement.scrollHeight)}px`;
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    apply();
  }, [html, highlightName]);

  return (
    <iframe
      ref={iframeRef}
      title="Email Preview"
      srcDoc={previewSrcDoc(html)}
      onLoad={apply}
      className="w-full border-none transition-all duration-300"
      sandbox="allow-same-origin allow-popups"
      style={{ minHeight: '500px' }}
    />
  );
}

function previewSrcDoc(html) {
  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Inter, system-ui, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
        margin: 24px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      p, div, h1, h2, h3, h4, h5, h6, ul, ol, li, table { white-space: normal; }
      ${PLACEHOLDER_HIGHLIGHT_CSS}
    </style>
  </head>
  <body>${html || ''}</body>
</html>`;
}
