import { useCanvasEditor } from '../hooks/editorContext';
import AdjustPanel from './panels/AdjustPanel';
import AlignPanel from './panels/AlignPanel';
import BackgroundPanel from './panels/BackgroundPanel';
import BorderShadowPanel from './panels/BorderShadowPanel';
import ColorInfo from './panels/ColorInfo';
import CropPanel from './panels/CropPanel';
import DrawPanel from './panels/DrawPanel';
import FiltersPanel from './panels/FiltersPanel';
import LayersPanel from './panels/LayersPanel';
import MaskPanel from './panels/MaskPanel';
import RedactPanel from './panels/RedactPanel';
import ResizePanel from './panels/ResizePanel';
import ShapePanel from './panels/ShapePanel';
import StickersPanel from './panels/StickersPanel';
import TextPanel from './panels/TextPanel';

const TABS = [
  ['adjust', 'Adjust'],
  ['filters', 'Filters'],
  ['crop', 'Crop'],
  ['resize', 'Size'],
  ['draw', 'Draw'],
  ['shapes', 'Shapes'],
  ['text', 'Text'],
  ['stickers', 'Stickers'],
  ['layers', 'Layers'],
  ['bg', 'BG'],
  ['border', 'Frame'],
  ['mask', 'Mask'],
  ['align', 'Align'],
  ['redact', 'Redact'],
];

const PANELS = {
  adjust: AdjustPanel,
  filters: FiltersPanel,
  crop: CropPanel,
  resize: ResizePanel,
  draw: DrawPanel,
  shapes: ShapePanel,
  text: TextPanel,
  stickers: StickersPanel,
  layers: LayersPanel,
  bg: BackgroundPanel,
  border: BorderShadowPanel,
  mask: MaskPanel,
  align: AlignPanel,
  redact: RedactPanel,
};

export default function RightPanel() {
  const { rightTab, setRightTab, session, crop } = useCanvasEditor();
  const Panel = PANELS[rightTab] || AdjustPanel;
  const openTab = (id) => {
    setRightTab(id);
    if (id === 'crop') crop.enter('free');
  };
  return (
    <aside className="hidden md:flex flex-col w-[280px] shrink-0 border-l border-border bg-bg-primary min-h-0">
      <div className="flex flex-wrap gap-1 p-2 border-b border-border">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`text-[10px] px-1.5 py-1 rounded-md border-none ${rightTab === id ? 'bg-accent text-accent-text' : 'bg-transparent text-text-secondary hover:bg-bg-secondary'}`}
            onClick={() => openTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <ColorInfo />
        {session.meta.hasImage ? <Panel /> : <p className="text-xs text-text-tertiary">Load an image to edit properties.</p>}
      </div>
    </aside>
  );
}
