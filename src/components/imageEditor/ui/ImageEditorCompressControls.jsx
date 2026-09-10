import React from 'react';

const ImageEditorCompressControls = ({
  compressionPct,
  onCompressionChange,
  targetKb,
  onTargetKbChange,
  recommendedKb,
}) => (
  <div className="space-y-3 pt-1 border-t border-border/60">
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.16em] text-text-tertiary">
        Compression
        <span className="text-xs font-black tabular-nums text-text-primary tracking-normal">
          {compressionPct}%
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={compressionPct}
        onChange={(e) => onCompressionChange(Number(e.target.value))}
        className="w-full accent-accent cursor-pointer"
      />
      <span className="flex justify-between text-[9px] text-text-tertiary">
        <span>Better quality</span>
        <span>Smaller file</span>
      </span>
    </label>

    <label className="block space-y-1">
      <span className="text-[8px] font-black uppercase tracking-[0.16em] text-text-tertiary">
        Target size
      </span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={10}
          step={10}
          value={targetKb}
          placeholder="Optional"
          onChange={(e) => onTargetKbChange(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-bg-secondary text-sm font-semibold tabular-nums"
        />
        <span className="text-[10px] font-bold text-text-tertiary shrink-0">KB</span>
      </div>
      {recommendedKb ? (
        <button
          type="button"
          className="text-[10px] font-semibold text-accent hover:underline"
          onClick={() => onTargetKbChange(String(recommendedKb))}
        >
          Use web target ({recommendedKb} KB)
        </button>
      ) : null}
      <p className="text-[10px] text-text-tertiary leading-snug m-0">
        Live preview aims at or under this size by lowering quality, then shrinking if needed.
      </p>
    </label>
  </div>
);

export default ImageEditorCompressControls;
