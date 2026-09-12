import { useCanvasEditor } from '../hooks/editorContext';
import AdjustPanel from './panels/AdjustPanel';
import CropPanel from './panels/CropPanel';
import DrawPanel from './panels/DrawPanel';
import FiltersPanel from './panels/FiltersPanel';
import LayersPanel from './panels/LayersPanel';
import TextPanel from './panels/TextPanel';

const MAP = {
  adjust: AdjustPanel,
  filters: FiltersPanel,
  crop: CropPanel,
  draw: DrawPanel,
  text: TextPanel,
  layers: LayersPanel,
};

export default function MobileSheet() {
  const { mobilePanel, setMobilePanel } = useCanvasEditor();
  const Panel = MAP[mobilePanel];
  if (!Panel) return null;
  return (
    <div className="md:hidden fixed inset-0 z-[80] bg-black/40" onClick={() => setMobilePanel(null)}>
      <div
        className="ie-sheet absolute bottom-0 left-0 right-0 bg-bg-primary rounded-t-lg p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold capitalize">{mobilePanel}</span>
          <button type="button" className="btn btn-ghost text-xs" onClick={() => setMobilePanel(null)}>Close</button>
        </div>
        <Panel />
      </div>
    </div>
  );
}
