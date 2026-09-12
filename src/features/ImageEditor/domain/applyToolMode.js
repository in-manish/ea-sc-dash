import { PencilBrush } from 'fabric';
import { BRUSH_TOOLS, TOOLS } from '../constants';
import { withAlpha } from './colors';

export function applyToolMode(canvas, tool, style) {
  const isBrush = BRUSH_TOOLS.has(tool);
  canvas.isDrawingMode = isBrush;
  canvas.selection = tool === TOOLS.select || tool === TOOLS.crop;
  canvas.skipTargetFind = tool === TOOLS.pan;
  canvas.defaultCursor = tool === TOOLS.pan || tool === TOOLS.select
    ? 'grab'
    : tool === TOOLS.eyedropper ? 'crosshair' : 'default';
  if (!isBrush) return;
  const brush = canvas.freeDrawingBrush || new PencilBrush(canvas);
  canvas.freeDrawingBrush = brush;
  brush.width = tool === TOOLS.brush ? Math.max(10, style.strokeWidth * 3)
    : tool === TOOLS.marker ? Math.max(8, style.strokeWidth * 2.4)
      : tool === TOOLS.highlighter ? Math.max(14, style.strokeWidth * 4)
        : tool === TOOLS.eraser ? Math.max(12, style.strokeWidth * 3)
          : style.strokeWidth;
  if (tool === TOOLS.highlighter) brush.color = withAlpha('#eab308', 0.35);
  else if (tool === TOOLS.eraser) brush.color = 'rgba(255,255,255,1)';
  else brush.color = withAlpha(style.color, style.opacity);
}
