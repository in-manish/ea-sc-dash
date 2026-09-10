import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { ImageEditorContext } from './imageEditorContext';
import { useImageEditorController } from './hooks/useImageEditor';

function ImageEditorHost({ implRef }) {
  const { editImage, modal } = useImageEditorController();
  useLayoutEffect(() => {
    implRef.current = editImage;
  }, [editImage, implRef]);
  return modal;
}

export function ImageEditorProvider({ children }) {
  const implRef = useRef(null);
  const editImage = useCallback((file, config) => {
    if (!implRef.current) return Promise.resolve(file);
    return implRef.current(file, config);
  }, []);
  const api = useMemo(() => ({ editImage }), [editImage]);

  return (
    <ImageEditorContext.Provider value={api}>
      {children}
      <ImageEditorHost implRef={implRef} />
    </ImageEditorContext.Provider>
  );
}
