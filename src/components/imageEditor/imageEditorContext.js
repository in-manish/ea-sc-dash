import { createContext, useContext } from 'react';

export const ImageEditorContext = createContext(null);

export function useImageEditor() {
  const ctx = useContext(ImageEditorContext);
  if (!ctx) {
    throw new Error('useImageEditor must be used within ImageEditorProvider');
  }
  return ctx;
}
