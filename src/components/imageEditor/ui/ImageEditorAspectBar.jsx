import React from 'react';

const ImageEditorAspectBar = ({ ratios, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary mr-1">Aspect</span>
    {(ratios || []).map((item) => {
      const selected = Object.is(item.value, value) || (Number.isNaN(item.value) && Number.isNaN(value));
      return (
        <button
          key={item.label}
          type="button"
          onClick={() => onChange(item.value)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
            selected
              ? 'bg-accent text-white border-accent'
              : 'bg-bg-primary text-text-secondary border-border hover:border-accent'
          }`}
        >
          {item.label}
        </button>
      );
    })}
  </div>
);

export default ImageEditorAspectBar;
