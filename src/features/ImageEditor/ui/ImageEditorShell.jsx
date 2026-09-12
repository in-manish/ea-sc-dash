import { useRef } from 'react';
import { ACCEPT_ATTR } from '../constants';
import { useCanvasEditor } from '../hooks/editorContext';
import CropBar from './CropBar';
import EditorCanvas from './EditorCanvas';
import EmptyState from './EmptyState';
import ExportDialog from './ExportDialog';
import LeftTools from './LeftTools';
import MobileSheet from './MobileSheet';
import MobileToolbar from './MobileToolbar';
import RightPanel from './RightPanel';
import TopToolbar from './TopToolbar';

export default function ImageEditorShell() {
  const { session, importer, exporter } = useCanvasEditor();
  const fileRef = useRef(null);

  const onPick = (file) => {
    if (file) importer.loadFile(file, session.meta.hasImage);
  };

  return (
    <div className="ie-page flex flex-col bg-bg-primary overflow-hidden -m-8 h-screen max-h-screen">
      <TopToolbar />
      <div className="flex flex-1 min-h-0">
        <LeftTools onAddImage={() => fileRef.current?.click()} />
        <div className="relative flex-1 min-w-0 min-h-0 overflow-hidden">
          <EditorCanvas />
          <CropBar />
          {!session.meta.hasImage ? <EmptyState onPick={onPick} /> : null}
        </div>
        <RightPanel />
      </div>
      <MobileToolbar />
      <MobileSheet />
      {exporter.open ? <ExportDialog /> : null}
      <input ref={fileRef} type="file" accept={ACCEPT_ATTR} className="sr-only" onChange={(e) => onPick(e.target.files?.[0])} />
    </div>
  );
}
