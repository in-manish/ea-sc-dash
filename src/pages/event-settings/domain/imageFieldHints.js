import { bytesToKb, formatKb } from '../../../components/imageEditor/domain/imageMeta';

const OPTIMIZED_TYPES = new Set(['webp', 'avif', 'image/webp', 'image/avif']);

export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return null;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return formatKb(bytes);
}

export function typeFromUrl(url) {
  if (!url) return '';
  const match = String(url).toLowerCase().match(/\.([a-z0-9]+)(?:\?|#|$)/);
  return match ? match[1] : '';
}

export function formatLabel(type) {
  if (!type) return '';
  const raw = type.split(';')[0].trim();
  const name = raw.includes('/') ? raw.split('/')[1] : raw;
  return name.replace('jpeg', 'jpg').toUpperCase();
}

export function isOptimizedFormat(type) {
  if (!type) return false;
  const raw = type.split(';')[0].trim().toLowerCase();
  const subtype = raw.includes('/') ? raw.split('/')[1] : raw;
  return OPTIMIZED_TYPES.has(raw) || OPTIMIZED_TYPES.has(subtype);
}

export function buildImageFieldHints(meta, recommended, kind = 'image') {
  if (!meta) return null;
  const kb = meta.bytes != null ? bytesToKb(meta.bytes) : null;
  const label = formatLabel(meta.type);
  const sizeText = formatFileSize(meta.bytes);
  const dimText = meta.width && meta.height ? `${meta.width} × ${meta.height} px` : null;
  const stats = [sizeText, dimText, label].filter(Boolean);

  if (kind === 'video') {
    const heavy = meta.bytes != null && meta.bytes > 8 * 1024 * 1024;
    return {
      stats,
      tone: heavy ? 'warn' : 'ok',
      headline: heavy ? 'Large for web playback' : 'Ready for web',
      detail: heavy
        ? 'Prefer MP4 under ~8 MB so the banner loads quickly on mobile.'
        : 'MP4 under ~8 MB is a comfortable size for event banners.',
    };
  }

  const web = recommended?.web;
  const mobile = recommended?.mobile;
  const optimized = isOptimizedFormat(meta.type);
  const overWeight = Boolean(web?.maxKb && kb != null && kb > web.maxKb);
  const overPixels = Boolean(
    web && meta.width && (meta.width > web.width * 1.25 || meta.height > web.height * 1.25)
  );

  let tone = 'ok';
  let headline = 'Web optimized';
  let detail = '';

  if (overWeight && !optimized) {
    tone = 'warn';
    headline = 'Not web optimized';
    detail = `File is ${sizeText}, over the ${web.maxKb} KB web target. Convert to WebP or AVIF.`;
  } else if (overWeight) {
    tone = 'warn';
    headline = 'Optimized format, still heavy';
    detail = `File is ${sizeText}, over the ${web.maxKb} KB web target. Compress or crop to bring it down.`;
  } else if (!optimized) {
    tone = 'warn';
    headline = 'Not web optimized';
    detail = web
      ? `File size is within ${web.maxKb} KB. WebP or AVIF usually loads faster than PNG/JPEG.`
      : 'Size is fine, but WebP or AVIF usually loads faster than PNG/JPEG.';
  } else if (overPixels) {
    detail = web
      ? `File size is within ${web.maxKb} KB. Typical display is ${web.width}×${web.height} px — extra pixels are unused on the web.`
      : 'Modern format that is efficient on the web.';
  } else {
    detail = web
      ? `Fits the web target (≤ ${web.maxKb} KB). Typical display ${web.width}×${web.height} px.`
      : 'Modern format that is efficient on the web.';
  }

  const mobileHint = mobile && overWeight
    ? `Mobile: prefer ≤ ${mobile.maxKb} KB (${mobile.width}×${mobile.height} px).`
    : '';

  return { stats, tone, headline, detail, mobileHint };
}
