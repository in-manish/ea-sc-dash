import { filters } from 'fabric';
import { DEFAULT_ADJUSTMENTS } from './adjustments';
import { FILTER_PRESETS } from './filterPresets';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function sharpenMatrix(amount) {
  const a = clamp(amount / 100, 0, 1);
  const center = 1 + 4 * a;
  const edge = -a;
  return [0, edge, 0, edge, center, edge, 0, edge, 0];
}

function addBlend(list, color, alpha, mode = 'overlay') {
  if (!alpha) return;
  list.push(new filters.BlendColor({
    color,
    mode,
    alpha: clamp(Math.abs(alpha) / 100, 0, 1),
  }));
}

export function buildImageFilters(adjustments, presetId = 'original', intensity = 100) {
  const preset = FILTER_PRESETS.find((item) => item.id === presetId) || FILTER_PRESETS[0];
  const t = presetId === 'original' ? 0 : intensity / 100;
  const adj = { ...DEFAULT_ADJUSTMENTS, ...adjustments };
  Object.keys(preset.adj || {}).forEach((key) => {
    const from = Number(adjustments[key] ?? DEFAULT_ADJUSTMENTS[key] ?? 0);
    adj[key] = from * (1 - t) + Number(preset.adj[key]) * t;
  });

  const list = [];
  const brightness = clamp(adj.brightness / 100 + adj.exposure / 180 + adj.highlights / 280 - adj.shadows / 280, -1, 1);
  const contrast = clamp(adj.contrast / 100 + adj.highlights / 400 - adj.shadows / 400, -1, 1);
  if (brightness) list.push(new filters.Brightness({ brightness }));
  if (contrast) list.push(new filters.Contrast({ contrast }));
  if (adj.saturation) list.push(new filters.Saturation({ saturation: clamp(adj.saturation / 100, -1, 1) }));
  if (adj.vibrance) list.push(new filters.Vibrance({ vibrance: clamp(adj.vibrance / 100, -1, 1) }));
  if (adj.hue) list.push(new filters.HueRotation({ rotation: clamp(adj.hue / 180, -1, 1) }));
  if (adj.blur) list.push(new filters.Blur({ blur: clamp(adj.blur / 100, 0, 1) }));
  if (adj.sharpness) list.push(new filters.Convolute({ matrix: sharpenMatrix(adj.sharpness) }));
  if (adj.gamma) {
    const g = clamp(1 + adj.gamma / 100, 0.2, 2.2);
    list.push(new filters.Gamma({ gamma: [g, g, g] }));
  }
  if (adj.sepia) list.push(new filters.Sepia());
  if (adj.grayscale) list.push(new filters.Grayscale());
  addBlend(list, adj.temperature >= 0 ? '#f97316' : '#0ea5e9', adj.temperature);
  addBlend(list, adj.tint >= 0 ? '#d946ef' : '#22c55e', adj.tint);

  if (t > 0.15 && preset.matrix && filters[preset.matrix]) {
    list.push(new filters[preset.matrix]());
  }
  if (t > 0.15 && preset.blend) {
    list.push(new filters.BlendColor({
      color: preset.blend.color,
      mode: preset.blend.mode,
      alpha: preset.blend.alpha * t,
    }));
  }
  return list;
}

export function applyMainImageFilters(image, adjustments, presetId, intensity) {
  if (!image) return;
  image.filters = buildImageFilters(adjustments, presetId, intensity);
  image.opacity = clamp((adjustments.opacity ?? 100) / 100, 0, 1);
  image.applyFilters();
}
