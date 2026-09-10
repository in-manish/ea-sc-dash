import { useAlert } from '../../../contexts/AlertContext';
import { useImageEditor } from '../../../components/imageEditor';

export function useEventImageEdit({ eventData, handleFileChange }) {
  const { editImage } = useImageEditor();
  const { showAlert } = useAlert();

  const onPickFile = async (name, file, kind, editorConfig) => {
    if (kind === 'video') {
      handleFileChange(name, file);
      return;
    }
    const edited = await editImage(file, editorConfig);
    if (edited) handleFileChange(name, edited);
  };

  const onEditExisting = async (name, editorConfig) => {
    try {
      const edited = await editImage(eventData[name], editorConfig);
      if (edited) handleFileChange(name, edited);
    } catch (err) {
      await showAlert(
        err?.message || 'Could not open this image for editing.',
        'error',
      );
    }
  };

  return { onPickFile, onEditExisting };
}
