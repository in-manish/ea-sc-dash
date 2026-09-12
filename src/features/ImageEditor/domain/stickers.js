import { Path } from 'fabric';

export const STICKERS = [
  { id: 'check', label: 'Check', path: 'M4 12 l4 4 l8 -10', stroke: '#16a34a', fill: '' },
  { id: 'cross', label: 'Cross', path: 'M6 6 L18 18 M18 6 L6 18', stroke: '#dc2626', fill: '' },
  { id: 'star', label: 'Star', path: 'M12 2 L14.9 8.6 L22 9.3 L16.5 14.2 L18.2 21.2 L12 17.8 L5.8 21.2 L7.5 14.2 L2 9.3 L9.1 8.6 Z', stroke: '', fill: '#eab308' },
  { id: 'heart', label: 'Heart', path: 'M12 21 C12 21 3 14 3 8.5 C3 5.5 5.5 3.5 8.2 3.5 C10 3.5 11.3 4.4 12 5.6 C12.7 4.4 14 3.5 15.8 3.5 C18.5 3.5 21 5.5 21 8.5 C21 14 12 21 12 21 Z', stroke: '', fill: '#ef4444' },
  { id: 'arrow', label: 'Arrow', path: 'M4 12 H18 M14 7 L19 12 L14 17', stroke: '#0f172a', fill: '' },
  { id: 'circle', label: 'Circle', path: 'M12 3 A9 9 0 1 1 11.9 3 Z', stroke: '#0f172a', fill: '#e2e8f0' },
  { id: 'badge', label: 'Badge', path: 'M5 4 H19 V16 L12 21 L5 16 Z', stroke: '#0f172a', fill: '#fef3c7' },
];

export function makeSticker(def, left, top) {
  const sticker = new Path(def.path, {
    left,
    top,
    fill: def.fill || 'transparent',
    stroke: def.stroke || undefined,
    strokeWidth: def.stroke ? 2.4 : 0,
    strokeLineCap: 'round',
    strokeLineJoin: 'round',
    scaleX: 4,
    scaleY: 4,
    originX: 'center',
    originY: 'center',
    objectCaching: true,
  });
  sticker.layerType = 'sticker';
  sticker.layerName = def.label;
  sticker.layerId = `sticker-${Date.now()}`;
  return sticker;
}
