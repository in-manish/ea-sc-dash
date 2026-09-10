import { EDITOR_PRESETS, useImageEditor } from '../../../components/imageEditor';

export function usePersonImageCrop({ setSpeakers, setModerators, setImageBlobs }) {
  const { editImage } = useImageEditor();

  const pickImage = (type, index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const edited = await editImage(file, EDITOR_PRESETS.avatar);
      if (!edited) return;

      setImageBlobs((prev) => {
        const next = new Map(prev);
        next.set(`${type}_image_${index}`, { blob: edited, filename: edited.name });
        return next;
      });

      const previewUrl = URL.createObjectURL(edited);
      if (type === 'speaker') {
        setSpeakers((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], speaker_image_preview: previewUrl };
          return next;
        });
      } else {
        setModerators((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], moderator_image_preview: previewUrl };
          return next;
        });
      }
    };
    input.click();
  };

  return { pickImage };
}
