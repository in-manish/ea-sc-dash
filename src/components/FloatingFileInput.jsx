import React from 'react';
import { EDITOR_PRESETS, isImageFile, useImageEditor } from './imageEditor';

const FloatingFileInput = ({ onFile }) => {
  const { editImage } = useImageEditor();

  return (
    <input
      type="file"
      onChange={async (event) => {
        const file = event.target.files?.[0] || null;
        event.target.value = '';
        if (!file) {
          onFile(null);
          return;
        }
        if (!isImageFile(file)) {
          onFile(file);
          return;
        }
        const edited = await editImage(file, EDITOR_PRESETS.generic);
        if (edited) onFile(edited);
      }}
      className="w-full text-sm text-text-primary file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-bg-secondary file:text-text-primary"
    />
  );
};

export default FloatingFileInput;
