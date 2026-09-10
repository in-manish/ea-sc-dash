import React, { useState } from 'react';

const ImageEditorIndependentCrop = ({ cropBox, lockedAspect, onChange }) => {
  const [focus, setFocus] = useState(null);
  const [draftW, setDraftW] = useState('');
  const [draftH, setDraftH] = useState('');
  const width = focus === 'width' ? draftW : (cropBox?.width || '');
  const height = focus === 'height' ? draftH : (cropBox?.height || '');

  const commitWidth = () => {
    const next = Number(draftW);
    setFocus(null);
    if (!next || next < 1) return;
    if (Number.isFinite(lockedAspect) && lockedAspect > 0) {
      onChange({ width: next, height: Math.round(next / lockedAspect) });
      return;
    }
    onChange({ width: next });
  };

  const commitHeight = () => {
    const next = Number(draftH);
    setFocus(null);
    if (!next || next < 1) return;
    if (Number.isFinite(lockedAspect) && lockedAspect > 0) {
      onChange({ height: next, width: Math.round(next * lockedAspect) });
      return;
    }
    onChange({ height: next });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="space-y-1">
        <span className="block text-[9px] font-black uppercase tracking-widest text-text-tertiary">
          Crop width
        </span>
        <input
          type="number"
          min={1}
          value={width}
          onFocus={() => {
            setFocus('width');
            setDraftW(cropBox?.width || '');
          }}
          onChange={(e) => setDraftW(e.target.value)}
          onBlur={commitWidth}
          onKeyDown={(e) => e.key === 'Enter' && commitWidth()}
          className="w-24 px-2.5 py-1.5 rounded-lg border border-border bg-bg-secondary text-sm font-semibold tabular-nums"
        />
      </label>
      <span className="text-text-tertiary pb-1.5">×</span>
      <label className="space-y-1">
        <span className="block text-[9px] font-black uppercase tracking-widest text-text-tertiary">
          Crop height
        </span>
        <input
          type="number"
          min={1}
          value={height}
          onFocus={() => {
            setFocus('height');
            setDraftH(cropBox?.height || '');
          }}
          onChange={(e) => setDraftH(e.target.value)}
          onBlur={commitHeight}
          onKeyDown={(e) => e.key === 'Enter' && commitHeight()}
          className="w-24 px-2.5 py-1.5 rounded-lg border border-border bg-bg-secondary text-sm font-semibold tabular-nums"
        />
      </label>
      <p className="text-[10px] text-text-tertiary leading-snug max-w-xs pb-1">
        {Number.isFinite(lockedAspect)
          ? 'Aspect is locked — changing one side updates the other.'
          : 'Free crop: width and height are independent. Drag box edges or type a size.'}
      </p>
    </div>
  );
};

export default ImageEditorIndependentCrop;
