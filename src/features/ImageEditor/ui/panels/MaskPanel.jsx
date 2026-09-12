import { applyClipMask } from '../../domain/localizedEffect';
import { useCanvasEditor } from '../../hooks/editorContext';

export default function MaskPanel() {
  const { selection, canvas, history } = useCanvasEditor();
  const obj = selection.selected;
  const apply = (kind) => {
    applyClipMask(obj, kind);
    canvas.requestRenderAll();
    history.save();
  };
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Mask</h3>
      {!obj ? <p className="text-xs text-text-tertiary">Select an image or shape first.</p> : (
        <div className="grid grid-cols-2 gap-1">
          <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => apply('rect')}>Rectangle</button>
          <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => apply('roundRect')}>Rounded</button>
          <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => apply('circle')}>Circle</button>
          <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => apply('none')}>Clear mask</button>
        </div>
      )}
      <p className="text-[11px] text-text-tertiary mt-3 mb-0">Position the object inside the clip. Custom paths use the rectangle clip as a base.</p>
    </div>
  );
}
