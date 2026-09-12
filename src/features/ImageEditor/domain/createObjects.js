import {
  Circle,
  Ellipse,
  IText,
  Line,
  Polygon,
  Rect,
  Shadow,
  Triangle,
} from 'fabric';
import { arrowPoints, regularPolygonPoints, starPoints } from './shapeGeometry';
import { stampObjectMeta } from './objectMeta';

export function defaultStyle() {
  return {
    color: '#0f172a',
    fill: '#ffffff',
    strokeWidth: 3,
    opacity: 1,
    fontFamily: 'Inter',
    fontSize: 36,
  };
}

export function applyShadow(obj, shadow) {
  if (!obj) return;
  if (!shadow?.enabled) {
    obj.set('shadow', null);
    return;
  }
  obj.set('shadow', new Shadow({
    color: shadow.color || 'rgba(0,0,0,0.45)',
    blur: Number(shadow.blur) || 12,
    offsetX: Number(shadow.offsetX) || 0,
    offsetY: Number(shadow.offsetY) || 8,
  }));
}

export function createShape(tool, start, end, style) {
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.max(2, Math.abs(end.x - start.x));
  const height = Math.max(2, Math.abs(end.y - start.y));
  const common = {
    fill: tool === 'line' || tool === 'arrow' ? 'transparent' : style.fill,
    stroke: style.color,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    originX: 'left',
    originY: 'top',
    objectCaching: true,
  };
  let obj = null;
  if (tool === 'rect') obj = new Rect({ left, top, width, height, ...common });
  if (tool === 'roundRect') obj = new Rect({ left, top, width, height, rx: 16, ry: 16, ...common });
  if (tool === 'circle') {
    obj = new Circle({ left, top, radius: Math.min(width, height) / 2, ...common });
  }
  if (tool === 'ellipse') {
    obj = new Ellipse({ left, top, rx: width / 2, ry: height / 2, ...common });
  }
  if (tool === 'triangle') obj = new Triangle({ left, top, width, height, ...common });
  if (tool === 'polygon') {
    obj = new Polygon(regularPolygonPoints(6, Math.min(width, height) / 2), {
      left: left + width / 2,
      top: top + height / 2,
      ...common,
      originX: 'center',
      originY: 'center',
    });
  }
  if (tool === 'star') {
    const outer = Math.min(width, height) / 2;
    obj = new Polygon(starPoints(5, outer, outer * 0.45), {
      left: left + width / 2,
      top: top + height / 2,
      ...common,
      originX: 'center',
      originY: 'center',
    });
  }
  if (tool === 'line') {
    obj = new Line([start.x, start.y, end.x, end.y], {
      ...common,
      fill: undefined,
      originX: 'center',
      originY: 'center',
    });
  }
  if (tool === 'arrow') {
    obj = new Polygon(arrowPoints(end.x - start.x, end.y - start.y), {
      left: start.x,
      top: start.y,
      ...common,
      fill: style.color,
      originX: 'left',
      originY: 'top',
    });
  }
  if (!obj) return null;
  stampObjectMeta(obj, 'shape', tool);
  return obj;
}

export function createText(pointer, style) {
  const text = new IText('Text', {
    left: pointer.x,
    top: pointer.y,
    fontFamily: style.fontFamily || 'Inter',
    fontSize: style.fontSize || 36,
    fill: style.color,
    opacity: style.opacity,
    originX: 'left',
    originY: 'top',
  });
  stampObjectMeta(text, 'text', 'Text');
  return text;
}
