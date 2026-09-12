import {
  Circle, Crop, Eraser, Eye, Hand, Highlighter, ImagePlus, MousePointer2, Paintbrush,
  PenLine, Pentagon, Pipette, Square, Star, Type,
} from 'lucide-react';
import { TOOLS } from '../constants';
import { useCanvasEditor } from '../hooks/editorContext';
import ToolButton from './ToolButton';

const GROUPS = [
  [
    { id: TOOLS.select, label: 'Select', icon: MousePointer2 },
    { id: TOOLS.pan, label: 'Pan', icon: Hand },
    { id: TOOLS.crop, label: 'Crop', icon: Crop },
    { id: TOOLS.eyedropper, label: 'Eyedropper', icon: Pipette },
  ],
  [
    { id: TOOLS.pencil, label: 'Pencil', icon: PenLine },
    { id: TOOLS.brush, label: 'Brush', icon: Paintbrush },
    { id: TOOLS.highlighter, label: 'Highlighter', icon: Highlighter },
    { id: TOOLS.eraser, label: 'Eraser', icon: Eraser },
  ],
  [
    { id: TOOLS.rect, label: 'Rectangle', icon: Square },
    { id: TOOLS.circle, label: 'Circle', icon: Circle },
    { id: TOOLS.star, label: 'Star', icon: Star },
    { id: TOOLS.polygon, label: 'Polygon', icon: Pentagon },
    { id: TOOLS.text, label: 'Text', icon: Type },
  ],
];

export default function LeftTools({ onAddImage }) {
  const { tool, setTool, crop, eyedropper, setRightTab, session } = useCanvasEditor();
  const disabled = !session.meta.hasImage;

  const choose = (id) => {
    if (id === TOOLS.crop) crop.enter('free');
    else if (id === TOOLS.eyedropper) {
      if (tool === TOOLS.crop) crop.cancel();
      setTool(id);
      eyedropper.pick();
    } else {
      if (tool === TOOLS.crop) crop.cancel();
      setTool(id);
    }
  };

  return (
    <aside className="hidden md:flex flex-col gap-2 p-2 border-r border-border bg-bg-primary w-[52px] shrink-0 overflow-y-auto">
      {GROUPS.map((group, index) => (
        <div key={index} className="flex flex-col gap-1 pb-2 border-b border-border">
          {group.map((item) => (
            <ToolButton
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={tool === item.id}
              disabled={disabled}
              onClick={() => choose(item.id)}
            />
          ))}
        </div>
      ))}
      <ToolButton label="Add image" icon={ImagePlus} disabled={false} onClick={onAddImage} />
      <ToolButton label="Adjust" icon={Eye} disabled={disabled} onClick={() => setRightTab('adjust')} />
    </aside>
  );
}
