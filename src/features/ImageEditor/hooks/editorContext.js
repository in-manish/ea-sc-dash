import { createContext, useContext } from 'react';

export const EditorContext = createContext(null);

export function useCanvasEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useCanvasEditor must be used inside EditorProvider');
  return ctx;
}
