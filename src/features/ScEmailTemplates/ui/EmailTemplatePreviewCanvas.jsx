import { useState } from 'react';
import { Code, Layout, Mail } from 'lucide-react';
import { EMAIL_TEMPLATE_DEVICE_PRESETS } from '../constants/devicePreview';
import EmailTemplateFileImport from './EmailTemplateFileImport';
import EmailTemplateVisualEditor from './EmailTemplateVisualEditor';

export default function EmailTemplatePreviewCanvas({
  form,
  isEditing,
  previewDevice,
  onPatch,
}) {
  const [editorMode, setEditorMode] = useState('visual');
  const width = EMAIL_TEMPLATE_DEVICE_PRESETS[previewDevice]?.width || '1440px';
  const html = form?.content || '';

  return (
    <div className="flex-1 overflow-auto bg-bg-secondary p-4 sm:p-8 flex justify-center items-start min-w-0">
      {html || isEditing ? (
        <div
          className="bg-bg-primary rounded-xl shadow-lg border border-border flex flex-col overflow-hidden shrink-0"
          style={{ width, maxWidth: '100%', minHeight: '600px' }}
        >
          {isEditing ? (
            <EditorToolbar editorMode={editorMode} setEditorMode={setEditorMode} />
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
                {editorMode === 'code' ? (
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

function EditorToolbar({ editorMode, setEditorMode }) {
  return (
    <div className="px-4 py-2 border-b border-border bg-bg-secondary/50 flex justify-between items-center">
      <div className="flex p-1 bg-bg-primary border border-border rounded-lg">
        <ModeBtn active={editorMode === 'visual'} onClick={() => setEditorMode('visual')}>
          <Layout size={14} /> Visual
        </ModeBtn>
        <ModeBtn active={editorMode === 'code'} onClick={() => setEditorMode('code')}>
          <Code size={14} /> Code
        </ModeBtn>
      </div>
      <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
        {editorMode === 'visual' ? 'Rich text editor' : 'HTML source'}
      </span>
    </div>
  );
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border-none cursor-pointer inline-flex items-center gap-2 ${
        active ? 'bg-accent text-white' : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
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
