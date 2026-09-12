import { CROP_ASPECTS } from '../../domain/cropAspects';
import { useCanvasEditor } from '../../hooks/editorContext';
import { useState } from 'react';

export default function CropPanel() {
  const { crop, session } = useCanvasEditor();
  const [w, setW] = useState(session.meta.width || 0);
  const [h, setH] = useState(session.meta.height || 0);

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Crop</h3>
      <p className="text-[11px] text-text-tertiary mt-0 mb-3">Adjust the box on the image, then apply. This trims the exported picture.</p>
      <div className="grid grid-cols-2 gap-1 mb-3">
        {CROP_ASPECTS.map((item) => (
          <button key={item.id} type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => crop.enter(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <label className="text-[11px] text-text-secondary">
          Width
          <input className="input-field py-1 text-xs mt-1" type="number" min={1} value={w} onChange={(e) => setW(Number(e.target.value))} />
        </label>
        <label className="text-[11px] text-text-secondary">
          Height
          <input className="input-field py-1 text-xs mt-1" type="number" min={1} value={h} onChange={(e) => setH(Number(e.target.value))} />
        </label>
      </div>
      <button type="button" className="btn btn-secondary text-xs w-full mb-2" onClick={() => crop.resizeGuide(w, h)}>
        Set box size
      </button>
      <div className="flex gap-2">
        <button type="button" className="btn btn-primary text-xs flex-1" onClick={crop.apply}>Apply crop</button>
        <button type="button" className="btn btn-secondary text-xs flex-1" onClick={crop.cancel}>Cancel</button>
      </div>
    </div>
  );
}
