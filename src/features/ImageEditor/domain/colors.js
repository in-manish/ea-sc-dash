import { Color } from 'fabric';

export function toColorParts(input) {
  try {
    const color = new Color(input || '#000000');
    const source = color.getSource();
    const [r, g, b] = source;
    const hex = color.toHex();
    const hsl = rgbToHsl(r, g, b);
    return {
      hex: `#${hex}`,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      r,
      g,
      b,
    };
  } catch {
    return { hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)', r: 0, g: 0, b: 0 };
  }
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: Math.round(h * 60), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function withAlpha(hex, opacity) {
  const parts = toColorParts(hex);
  return `rgba(${parts.r}, ${parts.g}, ${parts.b}, ${opacity})`;
}
