import React from 'react';
import ImageEditorCompressControls from './ImageEditorCompressControls';

const checker = {
  backgroundImage:
    'linear-gradient(45deg,#e8e8e8 25%,transparent 25%),linear-gradient(-45deg,#e8e8e8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e8e8e8 75%),linear-gradient(-45deg,transparent 75%,#e8e8e8 75%)',
  backgroundSize: '12px 12px',
  backgroundPosition: '0 0,0 6px,6px -6px,-6px 0',
  backgroundColor: '#f4f4f4',
};

function StatRow({ label, value, sub, accent }) {
  return (
    <div>
      <div className="text-[8px] font-black uppercase tracking-[0.16em] text-text-tertiary">{label}</div>
      <div className={`text-base font-black tabular-nums tracking-tight ${accent ? 'text-orange-500' : 'text-text-primary'}`}>
        {value}
      </div>
      {sub ? <div className="text-[10px] text-text-tertiary">original {sub}</div> : null}
    </div>
  );
}

function HintRow({ title, rec }) {
  if (!rec) return null;
  return (
    <div className={`rounded-lg px-2.5 py-2 border ${rec.ok ? 'border-success/30 bg-success/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
      <div className="text-[8px] font-black uppercase tracking-widest text-text-tertiary">{title}</div>
      <div className="text-xs font-bold text-text-primary tabular-nums">
        {rec.width} × {rec.height} px · ≤ {rec.maxKb} KB
      </div>
      <div className="text-[10px] text-text-secondary mt-0.5">{rec.label}</div>
    </div>
  );
}

const ImageEditorSidePanel = ({
  cropMeta,
  suggestions,
  allowOptimize,
  optimize,
  onOptimizeChange,
  compressionPct,
  onCompressionChange,
  targetKb,
  onTargetKbChange,
  recommendedKb,
}) => {
  const before = cropMeta?.before || {};
  const after = cropMeta?.after || {};

  return (
    <aside className="space-y-4 min-w-0 max-h-[min(70vh,640px)] overflow-y-auto pr-0.5">
      <div className="rounded-xl overflow-hidden aspect-square w-full flex items-center justify-center" style={checker}>
        {cropMeta?.previewUrl ? (
          <img src={cropMeta.previewUrl} alt="Live preview" className="max-w-full max-h-full object-contain" />
        ) : (
          <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">Preview</span>
        )}
      </div>

      <div className="space-y-3">
        <StatRow
          label="File size"
          value={after.kb || '—'}
          sub={before.kb}
          accent
        />
        <StatRow
          label="Dimensions"
          value={after.width ? `${after.width} × ${after.height} px` : '—'}
          sub={before.width ? `${before.width} × ${before.height} px` : null}
        />
        <StatRow label="Aspect ratio" value={after.ratio || '—'} sub={before.ratio} />
      </div>

      {suggestions ? (
        <div className="space-y-2">
          <div className="text-[8px] font-black uppercase tracking-[0.16em] text-text-tertiary">Preferred size</div>
          <HintRow title="Web" rec={suggestions.web} />
          <HintRow title="Mobile" rec={suggestions.mobile} />
          {suggestions.note ? (
            <p className="text-[10px] leading-relaxed text-text-tertiary">{suggestions.note}</p>
          ) : null}
        </div>
      ) : null}

      {allowOptimize !== false ? (
        <label className="flex items-start gap-2 text-xs text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 accent-accent"
            checked={optimize}
            onChange={(e) => onOptimizeChange(e.target.checked)}
          />
          <span>
            <span className="font-semibold text-text-primary">Optimize for web</span>
            <span className="block text-[10px] text-text-tertiary">Export WebP (falls back to JPEG). Smaller file, live preview updates.</span>
          </span>
        </label>
      ) : null}

      <ImageEditorCompressControls
        compressionPct={compressionPct}
        onCompressionChange={onCompressionChange}
        targetKb={targetKb}
        onTargetKbChange={onTargetKbChange}
        recommendedKb={recommendedKb}
      />
    </aside>
  );
};

export default ImageEditorSidePanel;
