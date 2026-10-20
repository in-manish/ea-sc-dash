import { useState } from 'react';
import { Braces, Code, Layout, Mail } from 'lucide-react';
import { EMAIL_TEMPLATE_DEVICE_PRESETS } from '../constants/devicePreview';
import EmailTemplateFileImport from './EmailTemplateFileImport';
import EmailTemplateVisualEditor from './EmailTemplateVisualEditor';
import { formatHtml } from '../../../components/email/shared/formatHtml';

// Visual mode parses content through the browser's HTML parser, which mangles
// {% %} Jinja tags sitting inside table structure or tag attribute lists.
const JINJA_TAG_RE = /\{%[\s\S]*?%\}/;

export default function EmailTemplatePreviewCanvas({
  form,
  isEditing,
  previewDevice,
  onPatch,
}) {
  const [editorMode, setEditorMode] = useState('visual');
  const width = EMAIL_TEMPLATE_DEVICE_PRESETS[previewDevice]?.width || '1440px';
  const html = form?.content || '';
  const jinjaLocked = JINJA_TAG_RE.test(html);
  // Jinja tags get mangled the moment Visual mode parses them, so force Code
  // mode for as long as they're present, regardless of the last chosen mode.
  const effectiveMode = jinjaLocked ? 'code' : editorMode;

  return (
    <div className="flex-1 overflow-auto bg-bg-secondary p-4 sm:p-8 flex justify-center items-start min-w-0">
      {html || isEditing ? (
        <div
          className="bg-bg-primary rounded-xl shadow-lg border border-border flex flex-col overflow-hidden shrink-0"
          style={{ width, maxWidth: '100%', minHeight: '600px' }}
        >
          {isEditing ? (
            <EditorToolbar
              effectiveMode={effectiveMode}
              jinjaLocked={jinjaLocked}
              setEditorMode={setEditorMode}
              onFormat={() => onPatch({ content: formatHtml(html) })}
            />
          ) : (
            <div className="px-6 py-5 border-b border-border flex items-center gap-3">
              <div className="text-lg font-medium text-text-primary truncate">{form.subject || '(Subject)'}</div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-accent/10 text-accent shrink-0">
                Template
              </span>
            </div>
          )}
          <div className="flex-1 w-full min-h-[500px] flex flex-col border-t border-border">
            {isEditing ? (
              <div className="flex-1 flex flex-col overflow-hidden p-3 gap-2">
                {effectiveMode === 'code' ? (
                  <>
                    <EmailTemplateFileImport content={html} onChange={(content) => onPatch({ content })} />
                    <textarea
                      className="input-field font-mono text-sm flex-1 min-h-[500px] resize-none"
                      value={html}
                      onChange={(e) => onPatch({ content: e.target.value })}
                      placeholder="Write HTML or insert from file..."
                    />
                  </>
                ) : (
                  <EmailTemplateVisualEditor value={html} onChange={(content) => onPatch({ content })} />
                )}
              </div>
            ) : (
              <PreviewFrame html={html} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-text-tertiary h-full w-full">
          <Mail size={48} className="mb-4" />
          <span>No email content available</span>
        </div>
      )}
    </div>
  );
}

function EditorToolbar({ effectiveMode, jinjaLocked, setEditorMode, onFormat }) {
  return (
    <div className="px-4 py-2 border-b border-border bg-bg-secondary/50 flex flex-wrap justify-between items-center gap-2">
      <div className="flex p-1 bg-bg-primary border border-border rounded-lg">
        <ModeBtn
          active={effectiveMode === 'visual'}
          disabled={jinjaLocked}
          title={
            jinjaLocked
              ? 'Visual mode can corrupt Jinja tags ({% %}) — edit this template in Code mode'
              : undefined
          }
          onClick={() => setEditorMode('visual')}
        >
          <Layout size={14} /> Visual
        </ModeBtn>
        <ModeBtn active={effectiveMode === 'code'} onClick={() => setEditorMode('code')}>
          <Code size={14} /> Code
        </ModeBtn>
      </div>
      {effectiveMode === 'code' ? (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onFormat}>
          <Braces size={14} /> Format
        </button>
      ) : (
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
          Rich text editor
        </span>
      )}
    </div>
  );
}

function ModeBtn({ active, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={disabled ? undefined : onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border-none inline-flex items-center gap-2 ${
        disabled
          ? 'text-text-tertiary opacity-50 cursor-not-allowed'
          : active
            ? 'bg-accent text-white cursor-pointer'
            : 'bg-transparent text-text-secondary hover:bg-bg-secondary cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
}

function PreviewFrame({ html }) {
  return (
    <iframe
      title="Email template preview"
      sandbox=""
      srcDoc={html}
      className="w-full border-none min-h-[500px] flex-1 bg-bg-primary"
    />
  );
}
