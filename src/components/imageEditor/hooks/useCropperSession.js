import { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { bytesToKb, formatKb, formatRatio } from '../domain/imageMeta';
import { encodeCanvas, parseTargetBytes, qualityFromCompression } from '../domain/encodeImage';
import { outputSize, resolveExportMime } from '../domain/imageOutput';

const PREVIEW_MS = 200;

function encodeOptions(opts) {
  const targetBytes = parseTargetBytes(opts.targetKb);
  const lossy = opts.optimize || opts.compressionPct > 0 || Boolean(targetBytes);
  return {
    mime: resolveExportMime({ sourceType: opts.sourceType, optimize: opts.optimize, lossy }),
    quality: qualityFromCompression(opts.compressionPct),
    targetBytes,
    filename: opts.originalName || 'image',
    maxDim: opts.maxOutputDim,
  };
}

export function useCropperSession({
  active,
  sessionKey,
  imageRef,
  maxOutputDim,
  sourceType,
  optimize,
  compressionPct,
  targetKb,
  originalName,
  initialAspect,
}) {
  const cropperRef = useRef(null);
  const previewTimer = useRef(null);
  const previewUrlRef = useRef(null);
  const previewGen = useRef(0);
  const optionsRef = useRef({
    maxOutputDim, sourceType, optimize, compressionPct, targetKb, originalName, initialAspect,
  });
  const [cropBox, setCropBox] = useState({ width: 0, height: 0 });
  const [preview, setPreview] = useState({ url: null, kb: '—', bytes: 0, width: 0, height: 0, ratio: '—' });

  useEffect(() => {
    optionsRef.current = {
      maxOutputDim, sourceType, optimize, compressionPct, targetKb, originalName, initialAspect,
    };
  }, [maxOutputDim, sourceType, optimize, compressionPct, targetKb, originalName, initialAspect]);

  const clearPreview = useCallback(() => {
    previewGen.current += 1;
    if (previewTimer.current) clearTimeout(previewTimer.current);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const refreshAfter = useCallback(() => {
    const cropper = cropperRef.current;
    if (!cropper) return;
    const opts = encodeOptions(optionsRef.current);
    const data = cropper.getData(true);
    const size = outputSize(data.width, data.height, opts.maxDim);
    setCropBox({ width: Math.round(data.width), height: Math.round(data.height) });
    setPreview((prev) => ({
      ...prev,
      width: size.width,
      height: size.height,
      ratio: formatRatio(data.width, data.height),
    }));

    if (previewTimer.current) clearTimeout(previewTimer.current);
    const gen = ++previewGen.current;
    previewTimer.current = setTimeout(async () => {
      const canvas = cropper.getCroppedCanvas({
        width: size.width,
        height: size.height,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      if (!canvas) return;
      const encoded = await encodeCanvas(canvas, opts);
      if (!encoded || gen !== previewGen.current) return;
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const url = URL.createObjectURL(encoded.file);
      previewUrlRef.current = url;
      setPreview((prev) => ({
        ...prev,
        url,
        width: encoded.width,
        height: encoded.height,
        kb: formatKb(encoded.bytes),
        bytes: encoded.bytes,
      }));
    }, PREVIEW_MS);
  }, []);

  useEffect(() => {
    if (!active || !imageRef.current) return undefined;
    cropperRef.current = new Cropper(imageRef.current, {
      aspectRatio: NaN,
      viewMode: 1,
      autoCropArea: 0.9,
      responsive: true,
      background: false,
      guides: true,
      center: true,
      highlight: false,
      cropBoxMovable: true,
      cropBoxResizable: true,
      dragMode: 'move',
      crop: refreshAfter,
      ready() {
        const initial = optionsRef.current.initialAspect;
        cropperRef.current?.setAspectRatio(Number.isFinite(initial) ? initial : NaN);
        refreshAfter();
      },
    });
    return () => {
      clearPreview();
      cropperRef.current?.destroy();
      cropperRef.current = null;
    };
  }, [active, sessionKey, imageRef, refreshAfter, clearPreview]);

  useEffect(() => {
    if (!cropperRef.current) return;
    refreshAfter();
  }, [optimize, compressionPct, targetKb, refreshAfter]);

  const setAspectRatio = (value) => {
    cropperRef.current?.setAspectRatio(Number.isFinite(value) ? value : NaN);
  };

  const setIndependentSize = ({ width, height }) => {
    const cropper = cropperRef.current;
    if (!cropper) return;
    const current = cropper.getData();
    const next = { ...current };
    if (width != null && width > 0) next.width = width;
    if (height != null && height > 0) next.height = height;
    cropper.setData(next);
  };

  const exportFile = async () => {
    const cropper = cropperRef.current;
    if (!cropper) return null;
    const opts = encodeOptions(optionsRef.current);
    const data = cropper.getData(true);
    const size = outputSize(data.width, data.height, opts.maxDim);
    const canvas = cropper.getCroppedCanvas({
      width: size.width,
      height: size.height,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    if (!canvas) return null;
    const encoded = await encodeCanvas(canvas, opts);
    return encoded?.file || null;
  };

  return {
    cropBox,
    preview,
    previewKb: bytesToKb(preview.bytes),
    setAspectRatio,
    setIndependentSize,
    exportFile,
    zoomIn: () => cropperRef.current?.zoom(0.1),
    zoomOut: () => cropperRef.current?.zoom(-0.1),
    rotateLeft: () => cropperRef.current?.rotate(-90),
    rotateRight: () => cropperRef.current?.rotate(90),
    clearPreview,
  };
}
