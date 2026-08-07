import { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {
  emptyCropMeta,
  formatKb,
  formatRatio,
  measureImage,
  outputSize,
} from '../domain/cropImageMeta';

export function usePersonImageCrop({ speakers, setSpeakers, moderators, setModerators, imageBlobs, setImageBlobs }) {
  const [isCropping, setIsCropping] = useState(false);
  const [croppingTarget, setCroppingTarget] = useState(null);
  const [cropMeta, setCropMeta] = useState(emptyCropMeta());
  const cropperRef = useRef(null);
  const imageRef = useRef(null);
  const previewTimer = useRef(null);
  const previewUrlRef = useRef(null);

  const clearPreview = () => {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const resetCrop = () => {
    clearPreview();
    setIsCropping(false);
    setCroppingTarget(null);
    setCropMeta(emptyCropMeta());
  };

  const pickImage = (type, index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const dims = await measureImage(url);
      setCropMeta({
        before: {
          width: dims.width,
          height: dims.height,
          ratio: formatRatio(dims.width, dims.height),
          kb: formatKb(file.size),
        },
        after: { width: 0, height: 0, ratio: '—', kb: '—' },
        previewUrl: null,
      });
      setCroppingTarget({ type, index, url, originalFilename: file.name });
      setIsCropping(true);
    };
    input.click();
  };

  useEffect(() => {
    if (!isCropping || !imageRef.current) return undefined;

    const refreshAfter = () => {
      const data = cropperRef.current?.getData(true);
      if (!data) return;
      const size = outputSize(data.width, data.height);
      setCropMeta((prev) => ({
        ...prev,
        after: {
          ...prev.after,
          width: size.width,
          height: size.height,
          ratio: formatRatio(data.width, data.height),
        },
      }));

      if (previewTimer.current) clearTimeout(previewTimer.current);
      previewTimer.current = setTimeout(() => {
        const canvas = cropperRef.current?.getCroppedCanvas({
          width: size.width,
          height: size.height,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        });
        if (!canvas) return;
        canvas.toBlob((blob) => {
          if (!blob) return;
          if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
          const previewUrl = URL.createObjectURL(blob);
          previewUrlRef.current = previewUrl;
          setCropMeta((prev) => ({
            ...prev,
            after: { ...prev.after, kb: formatKb(blob.size) },
            previewUrl,
          }));
        }, 'image/jpeg', 0.85);
      }, 180);
    };

    cropperRef.current = new Cropper(imageRef.current, {
      aspectRatio: NaN,
      viewMode: 1,
      autoCropArea: 0.85,
      responsive: true,
      crop: refreshAfter,
      ready: refreshAfter,
    });

    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
      cropperRef.current?.destroy();
      cropperRef.current = null;
    };
  }, [isCropping, croppingTarget]);

  const saveCrop = () => {
    if (!cropperRef.current || !croppingTarget) return;
    const data = cropperRef.current.getData(true);
    const size = outputSize(data.width, data.height);
    const canvas = cropperRef.current.getCroppedCanvas({
      width: size.width,
      height: size.height,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const { type, index, originalFilename } = croppingTarget;
      const extension = blob.type === 'image/png' ? 'png' : 'jpg';
      const base = originalFilename?.replace(/\.[^/.]+$/, '') || 'image';
      const filename = `${base}.${extension}`;
      const next = new Map(imageBlobs);
      next.set(`${type}_image_${index}`, { blob, filename });
      setImageBlobs(next);

      const previewUrl = URL.createObjectURL(blob);
      if (type === 'speaker') {
        const nextSpeakers = [...speakers];
        nextSpeakers[index] = { ...nextSpeakers[index], speaker_image_preview: previewUrl };
        setSpeakers(nextSpeakers);
      } else {
        const nextMods = [...moderators];
        nextMods[index] = { ...nextMods[index], moderator_image_preview: previewUrl };
        setModerators(nextMods);
      }
      resetCrop();
    }, 'image/jpeg', 0.85);
  };

  return {
    isCropping,
    croppingTarget,
    cropMeta,
    imageRef,
    pickImage,
    saveCrop,
    cancelCrop: resetCrop,
    zoomIn: () => cropperRef.current?.zoom(0.1),
    zoomOut: () => cropperRef.current?.zoom(-0.1),
    rotateLeft: () => cropperRef.current?.rotate(-90),
    rotateRight: () => cropperRef.current?.rotate(90),
  };
}
