import { canEncodeAvif } from './encodeAvif';

export async function detectExportSupport() {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const probe = (mime) => new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(Boolean(blob && blob.type === mime));
    }, mime, 0.8);
  });
  const [png, jpeg, webp] = await Promise.all([
    probe('image/png'),
    probe('image/jpeg'),
    probe('image/webp'),
  ]);
  return { png, jpeg, webp, avif: canEncodeAvif() };
}

export const EXPORT_FORMATS = [
  { id: 'png', mime: 'image/png', label: 'PNG', ext: 'png', hasQuality: false, supportsAlpha: true },
  { id: 'jpeg', mime: 'image/jpeg', label: 'JPEG', ext: 'jpg', hasQuality: true, supportsAlpha: false },
  { id: 'webp', mime: 'image/webp', label: 'WebP', ext: 'webp', hasQuality: true, supportsAlpha: true },
  { id: 'avif', mime: 'image/avif', label: 'AVIF', ext: 'avif', hasQuality: true, supportsAlpha: true },
];
