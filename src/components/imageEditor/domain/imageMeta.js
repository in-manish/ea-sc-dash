export function formatRatio(w, h) {
  if (!w || !h) return '—';
  return `${(w / h).toFixed(2)}:1`;
}

export function formatKb(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const kb = bytes / 1024;
  if (kb < 10) return `${kb.toFixed(1)} KB`;
  return `${Math.round(kb)} KB`;
}

export function bytesToKb(bytes) {
  if (!bytes && bytes !== 0) return 0;
  return bytes / 1024;
}

export function emptyCropMeta() {
  return {
    before: { width: 0, height: 0, ratio: '—', kb: '—', bytes: 0 },
    after: { width: 0, height: 0, ratio: '—', kb: '—', bytes: 0 },
    previewUrl: null,
  };
}

export function measureImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

export function isImageFile(file) {
  return Boolean(file && typeof file.type === 'string' && file.type.startsWith('image/'));
}
