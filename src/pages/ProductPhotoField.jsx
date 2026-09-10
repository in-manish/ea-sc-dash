import React from 'react';
import { EDITOR_PRESETS, useImageEditor } from '../components/imageEditor';

const ProductPhotoField = ({ currentUrl, hasNewFile, onFile }) => {
  const { editImage } = useImageEditor();

  const onPick = async (file) => {
    if (!file) return;
    const edited = await editImage(file, EDITOR_PRESETS.product);
    if (edited) onFile(edited);
  };

  return (
    <div>
      <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">Product Photo</label>
      <input
        type="file"
        accept="image/*"
        className="w-full p-2 text-sm border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-accent hover:file:bg-blue-100"
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {currentUrl && !hasNewFile ? (
        <div className="mt-2 text-xs text-text-secondary">Current photo exists. Uploading a new one will replace it.</div>
      ) : null}
    </div>
  );
};

export default ProductPhotoField;
