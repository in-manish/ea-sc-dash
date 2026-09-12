import EditorProvider from '../hooks/EditorProvider';
import ImageEditorShell from './ImageEditorShell';
import './imageEditor.css';

export default function ImageEditorPage() {
  return (
    <EditorProvider>
      <ImageEditorShell />
    </EditorProvider>
  );
}
