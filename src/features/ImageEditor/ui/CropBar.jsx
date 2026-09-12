import { TOOLS } from '../constants';
import { useCanvasEditor } from '../hooks/editorContext';

export default function CropBar() {
  const { tool, crop } = useCanvasEditor();
  if (tool !== TOOLS.crop) return null;
  return (
    <div className="absolute bottom-12 md:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-bg-primary border border-border rounded-lg shadow-sm px-2 py-2">
      <button type="button" className="btn btn-primary text-xs py-1.5 px-3" onClick={crop.apply}>
        Apply crop
      </button>
      <button type="button" className="btn btn-secondary text-xs py-1.5 px-3" onClick={crop.cancel}>
        Cancel
      </button>
      <span className="hidden sm:inline text-[11px] text-text-tertiary pr-1">Enter to apply · Esc to cancel</span>
    </div>
  );
}
