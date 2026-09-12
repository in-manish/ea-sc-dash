import { makeSticker, STICKERS } from '../../domain/stickers';
import { useCanvasEditor } from '../../hooks/editorContext';

export default function StickersPanel() {
  const { canvas, history } = useCanvasEditor();
  const add = (def) => {
    if (!canvas) return;
    const sticker = makeSticker(def, 80, 80);
    canvas.add(sticker);
    canvas.setActiveObject(sticker);
    canvas.requestRenderAll();
    history.save();
  };
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Stickers</h3>
      <div className="grid grid-cols-2 gap-2">
        {STICKERS.map((item) => (
          <button key={item.id} type="button" className="btn btn-secondary text-xs py-3" onClick={() => add(item)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-text-tertiary mt-3 mb-0">Move, resize, rotate, duplicate, or delete like any layer.</p>
    </div>
  );
}
