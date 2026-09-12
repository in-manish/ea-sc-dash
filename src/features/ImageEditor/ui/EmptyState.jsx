import { ACCEPT_ATTR, ACCEPT_LABEL } from '../constants';
import { useCanvasEditor } from '../hooks/editorContext';

export default function EmptyState({ onPick }) {
  const { importer, error } = useCanvasEditor();

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center p-6"
      onDragOver={(e) => { e.preventDefault(); importer.setDragOver(true); }}
      onDragLeave={() => importer.setDragOver(false)}
      onDrop={importer.onDrop}
    >
      <div className={`max-w-md w-full text-center bg-bg-primary border border-border rounded-lg shadow-sm p-8 ${importer.dragOver ? 'ring-2 ring-accent' : ''}`}>
        <h2 className="text-lg font-semibold text-text-primary m-0">Start editing an image</h2>
        <p className="text-sm text-text-secondary mt-2 mb-5">
          Upload from your computer, drag and drop, or paste from the clipboard. Images stay in this browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <label className="btn btn-primary cursor-pointer">
            Upload Image
            <input type="file" accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => onPick(e.target.files?.[0])} />
          </label>
          <span className="btn btn-secondary pointer-events-none">Paste (Ctrl/Cmd + V)</span>
        </div>
        <p className="text-xs text-text-tertiary mt-4 mb-0">Supported: {ACCEPT_LABEL}. Drag &amp; drop anywhere.</p>
        {error ? <p className="text-xs text-status-danger mt-3 mb-0" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
