export function revokeAll(urls) {
  (urls || []).forEach((url) => {
    if (url && String(url).startsWith('blob:')) {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    }
  });
}

export function pinchDistance(touches) {
  if (!touches || touches.length < 2) return 0;
  const [a, b] = touches;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
