import React from 'react';
import { Minus, Plus, RotateCcw, RotateCw } from 'lucide-react';

const btn =
  'w-9 h-9 rounded-full border border-border/80 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors bg-bg-primary';

const ImageEditorToolbar = ({ onZoomIn, onZoomOut, onRotateLeft, onRotateRight }) => (
  <div className="flex items-center justify-center gap-2">
    <button type="button" className={btn} onClick={onZoomIn} title="Zoom in">
      <Plus size={16} />
    </button>
    <button type="button" className={btn} onClick={onZoomOut} title="Zoom out">
      <Minus size={16} />
    </button>
    <button type="button" className={btn} onClick={onRotateLeft} title="Rotate left">
      <RotateCcw size={16} />
    </button>
    <button type="button" className={btn} onClick={onRotateRight} title="Rotate right">
      <RotateCw size={16} />
    </button>
  </div>
);

export default ImageEditorToolbar;
