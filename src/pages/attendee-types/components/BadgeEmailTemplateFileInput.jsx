import React from 'react';
import { EDITOR_PRESETS, useImageEditor } from '../../../components/imageEditor';

const BadgeEmailTemplateFileInput = ({ disabled, onUpload }) => {
  const { editImage } = useImageEditor();

  return (
    <input
      type="file"
      className="sr-only"
      accept="image/*"
      disabled={disabled}
      onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        const edited = await editImage(file, EDITOR_PRESETS.badge);
        if (edited) onUpload(edited);
      }}
    />
  );
};

export default BadgeEmailTemplateFileInput;
