import { useEffect, useRef, useState } from 'react';
import { DEFAULT_PANEL_POSITION, PANEL_HEIGHT, PANEL_WIDTH } from '../constants';
import { clampPanelPosition } from '../domain/clampPanelPosition';

export function useDraggablePanel(positionKey) {
  const [position, setPosition] = useState(DEFAULT_PANEL_POSITION);
  const [hydrated, setHydrated] = useState(false);
  const dragRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0, pointerId: null });
  const dragMovedRef = useRef(false);

  useEffect(() => {
    const rawPosition = localStorage.getItem(positionKey);
    if (rawPosition) {
      try {
        setPosition(clampPanelPosition(JSON.parse(rawPosition), PANEL_WIDTH, PANEL_HEIGHT));
        setHydrated(true);
        return;
      } catch {
        /* fall through */
      }
    }
    setPosition(
      clampPanelPosition(
        { x: window.innerWidth - PANEL_WIDTH - 8, y: DEFAULT_PANEL_POSITION.y },
        PANEL_WIDTH,
        PANEL_HEIGHT
      )
    );
    setHydrated(true);
  }, [positionKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(positionKey, JSON.stringify(position));
  }, [position, positionKey, hydrated]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragRef.current.isDragging) return;
      if (dragRef.current.pointerId !== null && event.pointerId !== dragRef.current.pointerId) return;
      dragMovedRef.current = true;
      setPosition(
        clampPanelPosition(
          {
            x: event.clientX - dragRef.current.offsetX,
            y: event.clientY - dragRef.current.offsetY,
          },
          PANEL_WIDTH,
          PANEL_HEIGHT
        )
      );
    };

    const onPointerUp = (event) => {
      if (dragRef.current.pointerId !== null && event.pointerId !== dragRef.current.pointerId) return;
      dragRef.current.isDragging = false;
      dragRef.current.pointerId = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const onDragStart = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragMovedRef.current = false;
    dragRef.current.isDragging = true;
    dragRef.current.offsetX = event.clientX - position.x;
    dragRef.current.offsetY = event.clientY - position.y;
    dragRef.current.pointerId = event.pointerId;
  };

  return { position, onDragStart, dragMovedRef };
}
