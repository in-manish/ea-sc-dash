import { useEffect, useRef } from 'react';
import { REGION_TOOLS, SHAPE_TOOLS, TOOLS } from '../constants';
import { applyToolMode } from '../domain/applyToolMode';
import { createShape, createText } from '../domain/createObjects';
import { stampLocalizedEffect } from '../domain/localizedEffect';
import { stampObjectMeta } from '../domain/objectMeta';

export function useEditorDrawing(canvas, tool, style, history, redactColor) {
  const startRef = useRef(null);
  const tempRef = useRef(null);

  useEffect(() => {
    if (!canvas) return undefined;
    applyToolMode(canvas, tool, style);


    const onPath = (evt) => {
      const path = evt.path;
      if (!path) return;
      stampObjectMeta(path, 'drawing', tool === TOOLS.eraser ? 'Eraser' : 'Drawing');
      if (tool === TOOLS.eraser) path.globalCompositeOperation = 'destination-out';
      if (tool === TOOLS.highlighter) path.globalCompositeOperation = 'multiply';
    };

    const onDown = (opt) => {
      if (tool === TOOLS.text) {
        const text = createText(canvas.getScenePoint(opt.e), style);
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        history.save();
        return;
      }
      if (!SHAPE_TOOLS.has(tool) && !REGION_TOOLS.has(tool)) return;
      startRef.current = canvas.getScenePoint(opt.e);
    };

    const onMove = (opt) => {
      if (!startRef.current || (!SHAPE_TOOLS.has(tool) && !REGION_TOOLS.has(tool))) return;
      const end = canvas.getScenePoint(opt.e);
      if (tempRef.current) canvas.remove(tempRef.current);
      const shape = createShape(SHAPE_TOOLS.has(tool) ? tool : 'rect', startRef.current, end, {
        ...style,
        fill: REGION_TOOLS.has(tool) ? 'rgba(15,23,42,0.18)' : style.fill,
      });
      if (shape) {
        tempRef.current = shape;
        canvas.add(shape);
        canvas.requestRenderAll();
      }
    };

    const onUp = async (opt) => {
      if (!startRef.current) return;
      const end = canvas.getScenePoint(opt.e);
      const start = startRef.current;
      startRef.current = null;
      if (tempRef.current) {
        canvas.remove(tempRef.current);
        tempRef.current = null;
      }
      if (Math.hypot(end.x - start.x, end.y - start.y) < 4) return;
      if (SHAPE_TOOLS.has(tool)) {
        const shape = createShape(tool, start, end, style);
        if (shape) {
          canvas.add(shape);
          canvas.setActiveObject(shape);
          history.save();
        }
      } else if (REGION_TOOLS.has(tool)) {
        const box = {
          left: Math.min(start.x, end.x),
          top: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x),
          height: Math.abs(end.y - start.y),
        };
        const kind = tool === TOOLS.blurRegion ? 'blur'
          : tool === TOOLS.pixelateRegion ? 'pixelate'
            : tool === TOOLS.mosaic ? 'mosaic'
              : 'black';
        await stampLocalizedEffect(canvas, box, kind === 'black' && redactColor ? 'color' : kind, redactColor);
        history.save();
      }
      canvas.requestRenderAll();
    };

    canvas.on('path:created', onPath);
    canvas.on('mouse:down', onDown);
    canvas.on('mouse:move', onMove);
    canvas.on('mouse:up', onUp);
    return () => {
      canvas.off('path:created', onPath);
      canvas.off('mouse:down', onDown);
      canvas.off('mouse:move', onMove);
      canvas.off('mouse:up', onUp);
    };
  }, [canvas, history, redactColor, style, tool]);
}
