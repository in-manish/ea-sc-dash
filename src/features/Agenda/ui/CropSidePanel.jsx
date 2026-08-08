import React from 'react';
import { Minus, Plus, RotateCcw, RotateCw } from 'lucide-react';

const checker = {
  backgroundImage:
    'linear-gradient(45deg,#e8e8e8 25%,transparent 25%),linear-gradient(-45deg,#e8e8e8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e8e8e8 75%),linear-gradient(-45deg,transparent 75%,#e8e8e8 75%)',
  backgroundSize: '12px 12px',
  backgroundPosition: '0 0,0 6px,6px -6px,-6px 0',
  backgroundColor: '#f4f4f4',
};

const CropSidePanel = ({ cropMeta }) => {
  const before = cropMeta?.before || {};
  const after = cropMeta?.after || {};

  return (
    <aside className="space-y-4 min-w-0">
      <div className="rounded-xl overflow-hidden aspect-square w-full flex items-center justify-center" style={checker}>
        {cropMeta?.previewUrl ? (
          <img src={cropMeta.previewUrl} alt="Live preview" className="max-w-full max-h-full object-contain" />
        ) : (
          <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Preview</span>
        )}
      </div>

      <div className="space-y-3">
        <StatRow label="File size" value={after.kb || '—'} sub={before.kb} accent />
        <StatRow label="Aspect ratio" value={after.ratio || '—'} sub={before.ratio} />
        <StatRow
          label="Resolution"
          value={after.width ? `${after.width} × ${after.height}` : '—'}
          sub={before.width ? `${before.width} × ${before.height}` : null}
        />
      </div>

      <p className="text-[10px] leading-relaxed text-text-tertiary">
        Drag to crop · scroll to zoom · toolbar to rotate. Output is optimized automatically.
      </p>
    </aside>
  );
};

function StatRow({ label, value, sub, accent }) {
  return (
    <div>
      <div className="text-[8px] font-black uppercase tracking-[0.16em] text-text-tertiary">{label}</div>
      <div className={`text-base font-black tabular-nums tracking-tight ${accent ? 'text-orange-500' : 'text-text-primary'}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-text-tertiary">was {sub}</div>}
    </div>
  );
}

export function CropToolbar({ onZoomIn, onZoomOut, onRotateLeft, onRotateRight }) {
  const btn =
    'w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors bg-bg-primary';
  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button" className={btn} onClick={onZoomIn} title="Zoom in"><Plus size={16} /></button>
      <button type="button" className={btn} onClick={onZoomOut} title="Zoom out"><Minus size={16} /></button>
      <button type="button" className={btn} onClick={onRotateLeft} title="Rotate left"><RotateCcw size={16} /></button>
      <button type="button" className={btn} onClick={onRotateRight} title="Rotate right"><RotateCw size={16} /></button>
    </div>
  );
}

export default CropSidePanel;
