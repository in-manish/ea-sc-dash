import { useEffect, useState } from 'react';

/** Where each connector starts and ends, relative to the board. Hidden ends (scrolled out of a list) get no line. */
function computeLines(board, optionId, permissionIds) {
  const card = board.querySelector(`[data-option-card="${optionId}"]`);
  if (!card) return [];
  const area = board.getBoundingClientRect();
  const from = card.getBoundingClientRect();
  const fromList = card.closest('ul')?.getBoundingClientRect();
  const startY = from.top + from.height / 2;
  if (fromList && (startY < fromList.top || startY > fromList.bottom)) return [];

  return permissionIds.map((id) => {
    const row = board.querySelector(`[data-permission-row="${id}"]`);
    if (!row) return null;
    const to = row.getBoundingClientRect();
    const toList = row.closest('ul')?.getBoundingClientRect();
    const endY = to.top + to.height / 2;
    if (toList && (endY < toList.top || endY > toList.bottom)) return null;
    if (to.left <= from.right) return null; // the two lists are stacked, not side by side
    return { id, x1: from.right - area.left, y1: startY - area.top, x2: to.left - area.left, y2: endY - area.top };
  }).filter(Boolean);
}

/**
 * Lines from the picked SurveyJS option to every ticked EA permission. ``signature`` is the ticked permission
 * ids joined by commas. The lines are measured from the page and redrawn on scroll, resize and tick changes.
 */
export default function ServiceMappingLines({ boardRef, optionId, signature }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || !optionId) return undefined;
    const ids = signature ? signature.split(',').map(Number) : [];
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setLines(computeLines(board, optionId, ids)));
    };
    measure();
    window.addEventListener('resize', measure);
    board.addEventListener('scroll', measure, true);
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(board);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      board.removeEventListener('scroll', measure, true);
      observer?.disconnect();
    };
  }, [boardRef, optionId, signature]);

  if (!optionId || lines.length === 0) return null;
  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block" aria-hidden="true">
      {lines.map((line) => {
        const bend = Math.max(24, (line.x2 - line.x1) / 2);
        return (
          <g key={line.id} className="text-violet-600" stroke="currentColor" fill="currentColor">
            <path d={`M ${line.x1} ${line.y1} C ${line.x1 + bend} ${line.y1}, ${line.x2 - bend} ${line.y2}, ${line.x2} ${line.y2}`}
              fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={line.x1} cy={line.y1} r="4.5" stroke="none" />
            <circle cx={line.x2} cy={line.y2} r="4.5" stroke="none" />
          </g>
        );
      })}
    </svg>
  );
}
