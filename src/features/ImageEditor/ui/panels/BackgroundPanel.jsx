import { FabricImage } from 'fabric';
import { useCanvasEditor } from '../../hooks/editorContext';
import { makeLinearGradient, makeRadialGradient, setArtboardFill } from '../../domain/artboard';
import { findArtboard } from '../../domain/objectMeta';
import ColorField from '../ColorField';
import SliderField from '../SliderField';
import { useState } from 'react';

export default function BackgroundPanel() {
  const { canvas, history, session } = useCanvasEditor();
  const [color, setColor] = useState('#ffffff');
  const [from, setFrom] = useState('#0f172a');
  const [to, setTo] = useState('#94a3b8');
  const [angle, setAngle] = useState(90);
  const w = session.meta.width || 800;
  const h = session.meta.height || 600;

  const transparent = () => { setArtboardFill(canvas, 'transparent'); history.save(); };
  const solid = () => { setArtboardFill(canvas, color); history.save(); };
  const linear = () => {
    setArtboardFill(canvas, makeLinearGradient(
      [{ offset: 0, color: from }, { offset: 1, color: to }],
      angle,
      w,
      h,
    ));
    history.save();
  };
  const radial = () => {
    setArtboardFill(canvas, makeRadialGradient(
      [{ offset: 0, color: from }, { offset: 1, color: to }],
      w,
      h,
    ));
    history.save();
  };

  const addBgImage = async (file) => {
    if (!file || !canvas) return;
    const url = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(url);
    const board = findArtboard(canvas);
    img.set({ left: 0, top: 0, selectable: false, evented: false });
    img.scaleX = w / img.width;
    img.scaleY = h / img.height;
    img.isArtboard = false;
    img.layerType = 'image';
    img.layerName = 'Background image fill';
    canvas.add(img);
    canvas.sendObjectToBack(img);
    if (board) canvas.sendObjectToBack(board);
    history.save();
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Background</h3>
      <div className="grid grid-cols-2 gap-1 mb-3">
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={transparent}>Transparent</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={solid}>Solid</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={linear}>Linear</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={radial}>Radial</button>
      </div>
      <ColorField id="bg-solid" label="Solid color" value={color} onChange={setColor} />
      <ColorField id="bg-from" label="Gradient from" value={from} onChange={setFrom} />
      <ColorField id="bg-to" label="Gradient to" value={to} onChange={setTo} />
      <SliderField id="bg-angle" label="Angle" min={0} max={360} value={angle} onChange={setAngle} />
      <label className="btn btn-secondary w-full text-xs mt-1 cursor-pointer">
        Background image
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => addBgImage(e.target.files?.[0])} />
      </label>
    </div>
  );
}
