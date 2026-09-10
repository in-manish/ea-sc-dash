const EXT_MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

function nameFromUrl(url, fallback = 'image') {
  try {
    const path = new URL(url, window.location.origin).pathname;
    const base = decodeURIComponent(path.split('/').pop() || '');
    return base || fallback;
  } catch {
    return fallback;
  }
}

function mimeFrom(type, name) {
  const raw = String(type || '').split(';')[0].trim().toLowerCase();
  if (raw.startsWith('image/')) return raw;
  const ext = (name.split('.').pop() || '').toLowerCase();
  return EXT_MIME[ext] || 'image/png';
}

async function blobFrom(src) {
  const res = await fetch(src);
  if (!res.ok) return null;
  const blob = await res.blob();
  return blob.size > 0 ? blob : null;
}

export async function fileFromImageSource(source) {
  if (source instanceof File) return source;
  if (typeof source !== 'string' || !source.trim()) {
    throw new Error('No image to edit.');
  }

  const url = source.trim();
  const name = nameFromUrl(url);
  const blob = (await blobFrom(url))
    || (await blobFrom(`/__image-file?url=${encodeURIComponent(url)}`));

  if (!blob) {
    throw new Error('Could not load the current image for editing. Try replacing it instead.');
  }

  return new File([blob], name, { type: mimeFrom(blob.type, name) });
}
