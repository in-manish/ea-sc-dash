import React, { useState } from 'react';
import { X } from 'lucide-react';
import { bytesToKb } from '../domain/imageMeta';
import { compareToRecommended } from '../domain/sizeSuggestions';
import ImageEditorAspectBar from './ImageEditorAspectBar';
import ImageEditorIndependentCrop from './ImageEditorIndependentCrop';
import ImageEditorSidePanel from './ImageEditorSidePanel';
import ImageEditorToolbar from './ImageEditorToolbar';

const checkerStyle = {
  backgroundImage:
    'linear-gradient(45deg,#e5e5e5 25%,transparent 25%),linear-gradient(-45deg,#e5e5e5 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e5e5 75%),linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
  backgroundColor: '#f0f0f0',
};

const ImageEditorModal = ({
  url,
  imageRef,
  cropMeta,
  cropBox,
  config,
  optimize,
  onOptimizeChange,
  compressionPct,
  onCompressionChange,
  targetKb,
  onTargetKbChange,
  onAspect,
  onIndependentSize,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onCancel,
  onUseOriginal,
  onApply,
}) => {
  const ratios = config?.aspectRatios || [];
  const [aspect, setAspect] = useState(Number.isFinite(ratios[0]?.value) ? ratios[0].value : NaN);
  const suggestions = compareToRecommended(
    cropMeta?.after?.width,
    cropMeta?.after?.height,
    bytesToKb(cropMeta?.after?.bytes),
    config?.recommended
  );

  const changeAspect = (value) => {
    setAspect(value);
    onAspect(value);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-text-primary/45 backdrop-blur-sm overflow-y-auto">
      <div className="bg-bg-primary rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full border border-border/60 my-auto">
        <div className="px-5 py-3 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-text-primary tracking-tight">Edit image</h2>
            <p className="text-[11px] text-text-tertiary m-0">Crop width and height independently · live preview</p>
          </div>
          <button type="button" className="p-1.5 rounded-lg text-text-tertiary hover:bg-bg-tertiary" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-5">
          <div className="space-y-3 min-w-0">
            <div className="rounded-xl overflow-hidden min-h-[240px] max-h-[380px]" style={checkerStyle}>
              <img key={url} ref={imageRef} src={url} alt="To crop" className="max-w-full block" />
            </div>
            <ImageEditorToolbar
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onRotateLeft={onRotateLeft}
              onRotateRight={onRotateRight}
            />
            <ImageEditorAspectBar ratios={ratios} value={aspect} onChange={changeAspect} />
            <ImageEditorIndependentCrop
              cropBox={cropBox}
              lockedAspect={aspect}
              onChange={onIndependentSize}
            />
          </div>
          <ImageEditorSidePanel
            cropMeta={cropMeta}
            suggestions={suggestions}
            allowOptimize={config?.allowOptimize}
            optimize={optimize}
            onOptimizeChange={onOptimizeChange}
            compressionPct={compressionPct}
            onCompressionChange={onCompressionChange}
            targetKb={targetKb}
            onTargetKbChange={onTargetKbChange}
            recommendedKb={config?.recommended?.web?.maxKb}
          />
        </div>

        <div className="px-5 py-3 flex flex-wrap justify-end gap-2 border-t border-border/50">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-bg-tertiary"
            onClick={onUseOriginal}
          >
            Use original
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-bg-tertiary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-accent text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
            onClick={onApply}
          >
            Save & apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
