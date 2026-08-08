import React from 'react';
import { X } from 'lucide-react';
import CropSidePanel, { CropToolbar } from './CropSidePanel';

const checkerStyle = {
  backgroundImage:
    'linear-gradient(45deg,#e5e5e5 25%,transparent 25%),linear-gradient(-45deg,#e5e5e5 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e5e5 75%),linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0,0 8px,8px -8px,-8px 0',
  backgroundColor: '#f0f0f0',
};

const ImageCropModal = ({
  url,
  imageRef,
  cropMeta,
  onCancel,
  onSave,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
}) => (
  <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-text-primary/45 backdrop-blur-sm overflow-y-auto">
    <div className="bg-bg-primary rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full border border-border/60 my-auto">
      <div className="px-5 py-3 flex justify-between items-center">
        <h2 className="text-lg font-black text-text-primary tracking-tight">Edit Image</h2>
        <button type="button" className="p-1.5 rounded-lg text-text-tertiary hover:bg-bg-tertiary" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
        <div className="space-y-3 min-w-0">
          <div className="rounded-xl overflow-hidden min-h-[240px] max-h-[360px]" style={checkerStyle}>
            <img ref={imageRef} src={url} alt="To crop" className="max-w-full block" />
          </div>
          <CropToolbar
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onRotateLeft={onRotateLeft}
            onRotateRight={onRotateRight}
          />
        </div>

        <CropSidePanel cropMeta={cropMeta} />
      </div>

      <div className="px-5 py-3 flex justify-end gap-2 border-t border-border/50">
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
          onClick={onSave}
        >
          Save & Apply
        </button>
      </div>
    </div>
  </div>
);

export default ImageCropModal;
