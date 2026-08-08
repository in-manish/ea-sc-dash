const MAX_OUTPUT = 1200;

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

export function outputSize(naturalW, naturalH) {
  const longest = Math.max(naturalW, naturalH);
  if (longest <= MAX_OUTPUT) {
    return { width: Math.round(naturalW), height: Math.round(naturalH) };
  }
  const scale = MAX_OUTPUT / longest;
  return {
    width: Math.round(naturalW * scale),
    height: Math.round(naturalH * scale),
  };
}

export function emptyCropMeta() {
  return {
    before: { width: 0, height: 0, ratio: '—', kb: '—' },
    after: { width: 0, height: 0, ratio: '—', kb: '—' },
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
