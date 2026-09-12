export function regularPolygonPoints(sides, radius) {
  const points = [];
  const step = (Math.PI * 2) / sides;
  for (let i = 0; i < sides; i += 1) {
    const angle = i * step - Math.PI / 2;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return points;
}

export function starPoints(spikes, outer, inner) {
  const points = [];
  const step = Math.PI / spikes;
  let rot = -Math.PI / 2;
  for (let i = 0; i < spikes; i += 1) {
    points.push({ x: Math.cos(rot) * outer, y: Math.sin(rot) * outer });
    rot += step;
    points.push({ x: Math.cos(rot) * inner, y: Math.sin(rot) * inner });
    rot += step;
  }
  return points;
}

export function arrowPoints(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len;
  const ny = dy / len;
  const head = Math.min(28, len * 0.28);
  const hx = dx - nx * head;
  const hy = dy - ny * head;
  const px = -ny;
  const py = nx;
  return [
    { x: 0, y: 0 },
    { x: hx, y: hy },
    { x: hx + px * 8, y: hy + py * 8 },
    { x: dx, y: dy },
    { x: hx - px * 8, y: hy - py * 8 },
    { x: hx, y: hy },
  ];
}
