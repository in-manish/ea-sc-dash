import { Point } from 'fabric';
import { findArtboard } from './objectMeta';

export function alignSelection(canvas, mode) {
  const active = canvas.getActiveObject();
  if (!active) return;
  const board = findArtboard(canvas);
  const box = board
    ? { left: board.left, top: board.top, width: board.getScaledWidth(), height: board.getScaledHeight() }
    : { left: 0, top: 0, width: canvas.getWidth(), height: canvas.getHeight() };

  const targets = active.type === 'activeselection' ? active.getObjects() : [active];
  targets.forEach((obj) => {
    const bound = obj.getBoundingRect();
    if (mode === 'left') obj.setPositionByOrigin(new Point(box.left, bound.top + bound.height / 2), 'left', 'center');
    if (mode === 'centerX') obj.setPositionByOrigin(new Point(box.left + box.width / 2, bound.top + bound.height / 2), 'center', 'center');
    if (mode === 'right') obj.setPositionByOrigin(new Point(box.left + box.width, bound.top + bound.height / 2), 'right', 'center');
    if (mode === 'top') obj.setPositionByOrigin(new Point(bound.left + bound.width / 2, box.top), 'center', 'top');
    if (mode === 'centerY') obj.setPositionByOrigin(new Point(bound.left + bound.width / 2, box.top + box.height / 2), 'center', 'center');
    if (mode === 'bottom') obj.setPositionByOrigin(new Point(bound.left + bound.width / 2, box.top + box.height), 'center', 'bottom');
    obj.setCoords();
  });
  canvas.requestRenderAll();
}

export function distributeSelection(canvas, axis) {
  const active = canvas.getActiveObject();
  if (!active || active.type !== 'activeselection') return;
  const objs = [...active.getObjects()];
  if (objs.length < 3) return;
  const key = axis === 'x' ? 'left' : 'top';
  const size = axis === 'x' ? 'width' : 'height';
  objs.sort((a, b) => a.getBoundingRect()[key] - b.getBoundingRect()[key]);
  const first = objs[0].getBoundingRect();
  const last = objs[objs.length - 1].getBoundingRect();
  const span = last[key] + last[size] - first[key];
  const total = objs.reduce((sum, obj) => sum + obj.getBoundingRect()[size], 0);
  const gap = (span - total) / (objs.length - 1);
  let cursor = first[key];
  objs.forEach((obj) => {
    const bound = obj.getBoundingRect();
    const dx = axis === 'x' ? cursor - bound.left : 0;
    const dy = axis === 'y' ? cursor - bound.top : 0;
    obj.left += dx;
    obj.top += dy;
    obj.setCoords();
    cursor += bound[size] + gap;
  });
  canvas.requestRenderAll();
}
