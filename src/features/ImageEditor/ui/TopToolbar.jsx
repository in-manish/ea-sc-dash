import {
  Copy, Download, FlipHorizontal, FlipVertical, Redo2, RotateCcw, RotateCw, Undo2,
} from 'lucide-react';
import { useCanvasEditor } from '../hooks/editorContext';
import { transformMain } from '../hooks/useEditorKeyboard';
import ToolButton from './ToolButton';

export default function TopToolbar() {
  const { history, exporter, canvas, session, viewport, zoom } = useCanvasEditor();
  const disabled = !session.meta.hasImage;

  return (
    <header className="flex items-center gap-2 px-3 py-2 border-b border-border bg-bg-primary shrink-0">
      <h1 className="text-sm font-semibold text-text-primary m-0 mr-auto">Image Editor</h1>
      <ToolButton label="Undo" icon={Undo2} onClick={history.undo} disabled={!history.canUndo} shortcut="⌘Z" />
      <ToolButton label="Redo" icon={Redo2} onClick={history.redo} disabled={!history.canRedo} shortcut="⌘⇧Z" />
      <div className="w-px h-5 bg-border mx-1" />
      <ToolButton label="Rotate left" icon={RotateCcw} disabled={disabled} onClick={() => transformMain(canvas, history, 'rotateLeft')} />
      <ToolButton label="Rotate right" icon={RotateCw} disabled={disabled} onClick={() => transformMain(canvas, history, 'rotateRight')} />
      <ToolButton label="Flip horizontal" icon={FlipHorizontal} disabled={disabled} onClick={() => transformMain(canvas, history, 'flipX')} />
      <ToolButton label="Flip vertical" icon={FlipVertical} disabled={disabled} onClick={() => transformMain(canvas, history, 'flipY')} />
      <div className="w-px h-5 bg-border mx-1 hidden sm:block" />
      <span className="text-[11px] text-text-tertiary hidden md:inline tabular-nums">{Math.round(zoom * 100)}%</span>
      <button type="button" className="btn btn-ghost text-xs py-1 px-2 hidden md:inline-flex" onClick={() => viewport.zoomBy(-1)} disabled={disabled} title="Zoom out">−</button>
      <button type="button" className="btn btn-ghost text-xs py-1 px-2 hidden md:inline-flex" onClick={() => viewport.zoomBy(1)} disabled={disabled} title="Zoom in">+</button>
      <button type="button" className="btn btn-ghost text-xs py-1 px-2 hidden md:inline-flex" onClick={viewport.fit} disabled={disabled}>Fit</button>
      <button type="button" className="btn btn-ghost text-xs py-1 px-2 hidden md:inline-flex" onClick={viewport.actual} disabled={disabled}>100%</button>
      <button
        type="button"
        className="btn btn-secondary text-xs py-1.5 px-2 inline-flex items-center gap-1"
        disabled={disabled}
        onClick={() => exporter.copyImage()}
        title="Copy edited image"
      >
        <Copy size={14} />
        <span className="hidden sm:inline">Copy image</span>
      </button>
      <button
        type="button"
        className="btn btn-primary text-xs py-1.5 px-2 inline-flex items-center gap-1"
        disabled={disabled}
        onClick={() => exporter.setOpen(true)}
      >
        <Download size={14} />
        Export
      </button>
    </header>
  );
}
