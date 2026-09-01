import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

const WIDTH = 260;

export default function ColumnInfoIcon({ meaning, calc, example }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const openPanel = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const left = Math.min(rect.left, window.innerWidth - WIDTH - 12);
    setPos({ top: rect.bottom + 6, left: Math.max(8, left) });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (btnRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false);
    const onDismiss = () => setOpen(false);
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onDismiss, true);
    window.addEventListener('resize', onDismiss);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onDismiss, true);
      window.removeEventListener('resize', onDismiss);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="inline-flex items-center justify-center align-middle text-text-tertiary hover:text-accent transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          open ? setOpen(false) : openPanel();
        }}
        aria-label="Column info"
      >
        <Info size={12} />
      </button>
      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: WIDTH }}
            className="z-50 bg-bg-primary border border-border rounded-lg shadow-md p-3 text-xs normal-case tracking-normal font-normal text-text-secondary"
          >
            <p className="text-text-primary font-semibold mb-1">{meaning}</p>
            <p className="mb-1">{calc}</p>
            {example && <p className="text-text-tertiary italic">e.g. {example}</p>}
          </div>,
          document.body,
        )}
    </>
  );
}
