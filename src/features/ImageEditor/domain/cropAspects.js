export const CROP_ASPECTS = [
  { id: 'free', label: 'Free', value: null },
  { id: 'original', label: 'Original', value: 'original' },
  { id: '1:1', label: '1:1', value: 1 },
  { id: '4:3', label: '4:3', value: 4 / 3 },
  { id: '3:4', label: '3:4', value: 3 / 4 },
  { id: '16:9', label: '16:9', value: 16 / 9 },
  { id: '9:16', label: '9:16', value: 9 / 16 },
];

export function sizeForAspect(width, height, aspect) {
  if (!aspect || aspect === 'original') return { width, height };
  const current = width / height;
  if (current > aspect) return { width: Math.round(height * aspect), height };
  return { width, height: Math.round(width / aspect) };
}
