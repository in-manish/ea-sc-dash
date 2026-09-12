export const DEFAULT_ADJUSTMENTS = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  sharpness: 0,
  blur: 0,
  opacity: 100,
  hue: 0,
  vibrance: 0,
  gamma: 0,
  sepia: 0,
  grayscale: 0,
};

export const ADJUSTMENT_FIELDS = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'exposure', label: 'Exposure', min: -100, max: 100 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
  { key: 'tint', label: 'Tint', min: -100, max: 100 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100 },
  { key: 'blur', label: 'Blur', min: 0, max: 100 },
  { key: 'opacity', label: 'Opacity', min: 0, max: 100 },
  { key: 'hue', label: 'Hue', min: -180, max: 180 },
  { key: 'vibrance', label: 'Vibrance', min: -100, max: 100 },
  { key: 'gamma', label: 'Gamma', min: -100, max: 100 },
  { key: 'sepia', label: 'Sepia', min: 0, max: 100 },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 100 },
];

export function clampAdj(key, value) {
  const field = ADJUSTMENT_FIELDS.find((item) => item.key === key);
  if (!field) return Number(value) || 0;
  return Math.min(field.max, Math.max(field.min, Number(value) || 0));
}

export function mixAdjustments(base, overlay, intensity) {
  const t = Math.min(1, Math.max(0, intensity / 100));
  const out = { ...DEFAULT_ADJUSTMENTS, ...base };
  Object.keys(overlay || {}).forEach((key) => {
    const from = Number(base[key] ?? DEFAULT_ADJUSTMENTS[key] ?? 0);
    const to = Number(overlay[key] ?? from);
    out[key] = from * (1 - t) + to * t;
  });
  return out;
}
