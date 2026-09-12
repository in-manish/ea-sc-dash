import { alignSelection, distributeSelection } from '../../domain/alignment';
import { useCanvasEditor } from '../../hooks/editorContext';

export default function AlignPanel() {
  const { canvas, history } = useCanvasEditor();
  const run = (mode) => { alignSelection(canvas, mode); history.save(); };
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Align</h3>
      <div className="grid grid-cols-2 gap-1 mb-3">
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => run('left')}>Left</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => run('centerX')}>Center H</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => run('right')}>Right</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => run('top')}>Top</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => run('centerY')}>Center V</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => run('bottom')}>Bottom</button>
      </div>
      <button type="button" className="btn btn-secondary text-[11px] py-1.5 w-full mb-1" onClick={() => { distributeSelection(canvas, 'x'); history.save(); }}>
        Distribute horizontally
      </button>
      <button type="button" className="btn btn-secondary text-[11px] py-1.5 w-full" onClick={() => { distributeSelection(canvas, 'y'); history.save(); }}>
        Distribute vertically
      </button>
      <p className="text-[11px] text-text-tertiary mt-2 mb-0">Select multiple objects to distribute. Alignment uses the artboard.</p>
    </div>
  );
}
