import { formatBytes } from '../domain/formatBytes';
import { useCanvasEditor } from '../hooks/editorContext';

export default function EditorCanvas() {
  const { hostRef, importer, session, error, status } = useCanvasEditor();

  return (
    <div
      className="absolute inset-0 ie-checker"
      onDragOver={(e) => { e.preventDefault(); importer.setDragOver(true); }}
      onDragLeave={() => importer.setDragOver(false)}
      onDrop={importer.onDrop}
    >
      <div ref={hostRef} className="ie-host ie-checker" />
      {session.meta.hasImage ? (
        <div className="absolute left-3 bottom-3 text-[11px] bg-bg-primary/90 border border-border rounded-md px-2 py-1 text-text-secondary">
          {session.meta.width}×{session.meta.height}px · {formatBytes(session.meta.fileSize)}
          {session.meta.scaled ? ' · working copy fitted' : ''}
        </div>
      ) : null}
      {error ? (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs bg-red-50 text-status-danger border border-red-200 rounded-md px-3 py-1.5" role="alert">
          {error}
        </div>
      ) : null}
      {status && !error ? (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs bg-bg-primary border border-border rounded-md px-3 py-1.5 text-text-secondary">
          {status}
        </div>
      ) : null}
    </div>
  );
}
