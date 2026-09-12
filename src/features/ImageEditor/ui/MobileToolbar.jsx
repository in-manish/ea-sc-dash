import { Crop, Layers, MousePointer2, Paintbrush, Type } from 'lucide-react';
import { TOOLS } from '../constants';
import { useCanvasEditor } from '../hooks/editorContext';
import ToolButton from './ToolButton';

export default function MobileToolbar() {
  const { tool, setTool, setMobilePanel, crop } = useCanvasEditor();
  return (
    <div className="md:hidden flex items-center justify-around gap-1 p-2 border-t border-border bg-bg-primary">
      <ToolButton label="Select" icon={MousePointer2} active={tool === TOOLS.select} onClick={() => (tool === TOOLS.crop ? crop.cancel() : setTool(TOOLS.select))} />
      <ToolButton label="Crop" icon={Crop} active={tool === TOOLS.crop} onClick={() => crop.enter('free')} />
      <ToolButton label="Draw" icon={Paintbrush} onClick={() => { setTool(TOOLS.pencil); setMobilePanel('draw'); }} />
      <ToolButton label="Text" icon={Type} onClick={() => { setTool(TOOLS.text); setMobilePanel('text'); }} />
      <ToolButton label="Layers" icon={Layers} onClick={() => setMobilePanel('layers')} />
      <button type="button" className="btn btn-secondary text-[11px] py-1 px-2" onClick={() => setMobilePanel('adjust')}>Adjust</button>
    </div>
  );
}
