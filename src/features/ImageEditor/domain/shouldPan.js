import { BRUSH_TOOLS, REGION_TOOLS, SHAPE_TOOLS, TOOLS } from '../constants';

export function isViewportTool(tool) {
  return tool === TOOLS.select || tool === TOOLS.pan;
}

export function shouldPanViewport(tool, opt) {
  if (!isViewportTool(tool)) return false;
  if (BRUSH_TOOLS.has(tool) || SHAPE_TOOLS.has(tool) || REGION_TOOLS.has(tool)) return false;
  if (tool === TOOLS.crop || tool === TOOLS.text || tool === TOOLS.eyedropper) return false;
  const evt = opt?.e;
  if (tool === TOOLS.pan) return true;
  if (evt?.altKey || evt?.buttons === 4 || evt?.button === 1) return true;
  const target = opt?.target;
  return !target || target.isArtboard || target.isGuide || target.isCropGuide || target.isMainImage;
}
