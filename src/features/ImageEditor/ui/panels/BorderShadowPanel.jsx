import { applyShadow } from '../../domain/createObjects';
import { findArtboard } from '../../domain/objectMeta';
import { useCanvasEditor } from '../../hooks/editorContext';
import ColorField from '../ColorField';
import SliderField from '../SliderField';
import { useState } from 'react';

export default function BorderShadowPanel() {
  const { canvas, selection, history } = useCanvasEditor();
  const obj = selection.selected && !selection.selected.isCropGuide ? selection.selected : findArtboard(canvas);
  const [shadow, setShadow] = useState({ enabled: false, color: '#000000', blur: 16, offsetX: 0, offsetY: 8 });
  const [border, setBorder] = useState({ width: 0, color: '#0f172a', radius: 0 });

  const applyBorder = (next) => {
    const merged = { ...border, ...next };
    setBorder(merged);
    if (!obj) return;
    obj.set({
      stroke: merged.color,
      strokeWidth: merged.width,
      rx: obj.type === 'rect' ? merged.radius : obj.rx,
      ry: obj.type === 'rect' ? merged.radius : obj.ry,
    });
    canvas.requestRenderAll();
  };

  const applySh = (next) => {
    const merged = { ...shadow, ...next };
    setShadow(merged);
    applyShadow(obj, merged);
    canvas.requestRenderAll();
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Border & shadow</h3>
      <SliderField id="bd-w" label="Border width" min={0} max={40} value={border.width} onChange={(v) => applyBorder({ width: v })} />
      <ColorField id="bd-c" label="Border color" value={border.color} onChange={(v) => applyBorder({ color: v })} />
      <SliderField id="bd-r" label="Rounded corners" min={0} max={80} value={border.radius} onChange={(v) => applyBorder({ radius: v })} />
      <div className="flex gap-1 mb-3">
        {[['none', 0], ['thin', 4], ['thick', 12], ['frame', 24]].map(([label, width]) => (
          <button key={label} type="button" className="btn btn-secondary text-[11px] py-1 capitalize" onClick={() => applyBorder({ width })}>
            {label}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-text-secondary mb-2">
        <input type="checkbox" checked={shadow.enabled} onChange={(e) => applySh({ enabled: e.target.checked })} />
        Enable shadow
      </label>
      <ColorField id="sh-c" label="Shadow color" value={shadow.color} onChange={(v) => applySh({ color: v })} />
      <SliderField id="sh-b" label="Blur" min={0} max={60} value={shadow.blur} onChange={(v) => applySh({ blur: v })} />
      <SliderField id="sh-x" label="Offset X" min={-40} max={40} value={shadow.offsetX} onChange={(v) => applySh({ offsetX: v })} />
      <SliderField id="sh-y" label="Offset Y" min={-40} max={40} value={shadow.offsetY} onChange={(v) => applySh({ offsetY: v })} />
      <button type="button" className="btn btn-secondary text-xs w-full" onClick={() => history.save()}>Apply to history</button>
    </div>
  );
}
