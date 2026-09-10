import React from 'react';
import { Upload } from 'lucide-react';
import { EDITOR_PRESETS, useImageEditor } from '../../components/imageEditor';

const DocumentThumbnailField = ({ preview, onFile }) => {
  const { editImage } = useImageEditor();

  const onPick = async (file) => {
    if (!file) return;
    const edited = await editImage(file, EDITOR_PRESETS.thumbnail);
    if (edited) onFile(edited);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Thumbnail Image</label>
      <label className="group relative aspect-video border-2 border-dashed border-border rounded-xl bg-bg-secondary hover:bg-bg-tertiary flex flex-col items-center justify-center gap-2 cursor-pointer transition-all overflow-hidden">
        <input
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={(e) => {
            onPick(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {preview ? (
          <>
            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={24} className="text-white" />
            </div>
          </>
        ) : (
          <>
            <Upload size={20} className="text-text-tertiary group-hover:text-accent transition-colors" />
            <span className="text-[10px] font-bold text-text-tertiary uppercase">Upload Image</span>
          </>
        )}
      </label>
    </div>
  );
};

export default DocumentThumbnailField;
