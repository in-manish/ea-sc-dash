import React from 'react';
import { EDITOR_PRESETS, useImageEditor } from '../../components/imageEditor';

const CertificateTemplateFileInput = ({ disabled, onFile, className = 'hidden' }) => {
  const { editImage } = useImageEditor();

  return (
    <input
      type="file"
      accept="image/*"
      className={className}
      disabled={disabled}
      onChange={async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        const edited = await editImage(file, EDITOR_PRESETS.certificate);
        if (edited) onFile(edited);
      }}
    />
  );
};

export default CertificateTemplateFileInput;
