import { DEFAULT_SCALE_COLORS } from '../constants';

/** Colour for a rating value: the configured scale colour first, then a default ramp. */
export function colorForValue(value, scales = []) {
  const scale = scales.find((s) => s.value === value);
  if (scale?.color) return scale.color;
  return DEFAULT_SCALE_COLORS[Math.min(5, Math.max(1, Math.round(value)))] || '#94a3b8';
}
