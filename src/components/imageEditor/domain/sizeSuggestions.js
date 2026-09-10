function fitLabel(width, height, kb, rec) {
  if (!rec) return 'No target set';
  const tooHeavy = rec.maxKb && kb != null && kb > rec.maxKb;
  const tooWide = rec.width && width > rec.width * 1.25;
  const tooTall = rec.height && height > rec.height * 1.25;
  if (!tooHeavy && !tooWide && !tooTall) {
    return `Fits ≤ ${rec.maxKb} KB (${rec.width}×${rec.height} px typical)`;
  }
  if (tooHeavy) return `File is over ${rec.maxKb} KB`;
  return `Typical display ${rec.width}×${rec.height} px`;
}

export function compareToRecommended(width, height, kb, recommended) {
  if (!recommended) return null;
  const sizeOk = (rec) => rec && (kb == null || kb <= rec.maxKb);
  return {
    web: {
      ...recommended.web,
      label: fitLabel(width, height, kb, recommended.web),
      ok: sizeOk(recommended.web),
    },
    mobile: {
      ...recommended.mobile,
      label: fitLabel(width, height, kb, recommended.mobile),
      ok: sizeOk(recommended.mobile),
    },
    note: recommended.note || '',
  };
}

export const FREE_ASPECT = [
  { label: 'Free', value: NaN },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
];

export const SQUARE_ASPECT = [
  { label: '1:1', value: 1 },
  { label: 'Free', value: NaN },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
];
