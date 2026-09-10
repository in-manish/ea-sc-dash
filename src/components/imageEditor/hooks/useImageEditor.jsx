import { useCallback, useRef, useState } from 'react';
import { emptyCropMeta, formatKb, formatRatio, isImageFile, measureImage } from '../domain/imageMeta';
import { fileFromImageSource } from '../domain/fileFromSource';
import { EDITOR_PRESETS } from '../domain/editorPresets';
import { useCropperSession } from './useCropperSession';
import ImageEditorModal from '../ui/ImageEditorModal';

export function useImageEditorController() {
  const [session, setSession] = useState(null);
  const resolverRef = useRef(null);
  const imageRef = useRef(null);
  const [optimize, setOptimize] = useState(true);
  const [compressionPct, setCompressionPct] = useState(20);
  const [targetKb, setTargetKb] = useState('');

  const config = session?.config || EDITOR_PRESETS.generic;
  const cropper = useCropperSession({
    active: Boolean(session),
    sessionKey: session?.url,
    imageRef,
    maxOutputDim: config.maxOutputDim,
    sourceType: session?.file?.type,
    optimize: config.allowOptimize !== false && optimize,
    compressionPct,
    targetKb,
    originalName: session?.file?.name,
    initialAspect: config.aspectRatios?.[0]?.value,
  });

  const settle = useCallback((file) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    cropper.clearPreview();
    if (session?.url) URL.revokeObjectURL(session.url);
    setSession(null);
    resolve?.(file);
  }, [cropper, session]);

  const editImage = useCallback(async (fileOrUrl, nextConfig) => {
    const file = await fileFromImageSource(fileOrUrl);
    if (!isImageFile(file)) return file;
    const cfg = { ...EDITOR_PRESETS.generic, ...(nextConfig || {}) };
    if (cfg.enabled === false) return file;

    if (resolverRef.current) resolverRef.current(null);

    const url = URL.createObjectURL(file);
    const dims = await measureImage(url);
    setOptimize(cfg.allowOptimize !== false && cfg.defaultOptimize !== false);
    setCompressionPct(20);
    setTargetKb('');
    setSession((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return {
        file,
        url,
        config: cfg,
        before: {
          width: dims.width,
          height: dims.height,
          ratio: formatRatio(dims.width, dims.height),
          kb: formatKb(file.size),
          bytes: file.size,
        },
      };
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const apply = async () => {
    const out = await cropper.exportFile();
    settle(out || session?.file || null);
  };

  const cancel = () => settle(null);
  const useOriginal = () => settle(session?.file || null);

  const cropMeta = session
    ? {
        before: session.before,
        after: {
          width: cropper.preview.width,
          height: cropper.preview.height,
          ratio: cropper.preview.ratio,
          kb: cropper.preview.kb,
          bytes: cropper.preview.bytes,
        },
        previewUrl: cropper.preview.url,
      }
    : emptyCropMeta();

  const modal = session ? (
    <ImageEditorModal
      url={session.url}
      imageRef={imageRef}
      cropMeta={cropMeta}
      cropBox={cropper.cropBox}
      config={config}
      optimize={optimize}
      onOptimizeChange={setOptimize}
      compressionPct={compressionPct}
      onCompressionChange={setCompressionPct}
      targetKb={targetKb}
      onTargetKbChange={setTargetKb}
      onAspect={cropper.setAspectRatio}
      onIndependentSize={cropper.setIndependentSize}
      onZoomIn={cropper.zoomIn}
      onZoomOut={cropper.zoomOut}
      onRotateLeft={cropper.rotateLeft}
      onRotateRight={cropper.rotateRight}
      onCancel={cancel}
      onUseOriginal={useOriginal}
      onApply={apply}
    />
  ) : null;

  return { editImage, modal };
}
