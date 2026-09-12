export function clampPanelPosition(position, panelWidth = 360, panelHeight = 420) {
  const maxX = Math.max(8, window.innerWidth - panelWidth - 8);
  const maxY = Math.max(8, window.innerHeight - panelHeight - 8);
  return {
    x: Math.min(Math.max(position.x, 8), maxX),
    y: Math.min(Math.max(position.y, 8), maxY),
  };
}
