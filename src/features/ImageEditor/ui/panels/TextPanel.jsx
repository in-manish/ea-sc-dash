import { FONT_FAMILIES } from '../../constants';
import { useCanvasEditor } from '../../hooks/editorContext';
import ColorField from '../ColorField';
import SliderField from '../SliderField';

export default function TextPanel() {
  const { canvas, selection, setTool } = useCanvasEditor();
  const obj = selection.selected?.type === 'i-text' || selection.selected?.type === 'textbox'
    ? selection.selected : null;

  const set = (key, value) => {
    if (!obj) return;
    obj.set(key, value);
    canvas.requestRenderAll();
    selection.refresh();
  };

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Text</h3>
      <button type="button" className="btn btn-secondary w-full text-xs mb-3" onClick={() => setTool('text')}>
        Add text
      </button>
      {!obj ? <p className="text-xs text-text-tertiary">Select a text layer to edit styles.</p> : (
        <>
          <label className="text-xs text-text-secondary block mb-2">
            Font
            <select className="input-field mt-1 py-1.5 text-xs" value={obj.fontFamily} onChange={(e) => set('fontFamily', e.target.value)}>
              {FONT_FAMILIES.map((font) => <option key={font} value={font}>{font}</option>)}
            </select>
          </label>
          <SliderField id="text-size" label="Size" min={8} max={220} value={obj.fontSize || 36} onChange={(v) => set('fontSize', v)} />
          <div className="flex gap-1 mb-3">
            {[['fontWeight', 'bold', 'B'], ['fontStyle', 'italic', 'I']].map(([k, val, label]) => (
              <button key={k} type="button" className="btn btn-ghost text-xs px-2" onClick={() => set(k, obj[k] === val ? 'normal' : val)}>{label}</button>
            ))}
            <button type="button" className="btn btn-ghost text-xs px-2" onClick={() => set('underline', !obj.underline)}>U</button>
            <button type="button" className="btn btn-ghost text-xs px-2" onClick={() => set('linethrough', !obj.linethrough)}>S</button>
          </div>
          <div className="flex gap-1 mb-3">
            {['left', 'center', 'right'].map((align) => (
              <button key={align} type="button" className="btn btn-ghost text-xs px-2 capitalize" onClick={() => set('textAlign', align)}>{align}</button>
            ))}
          </div>
          <ColorField id="text-color" label="Color" value={obj.fill || '#000'} onChange={(v) => set('fill', v)} />
          <ColorField id="text-bg" label="Background" value={obj.textBackgroundColor || '#ffffff'} onChange={(v) => set('textBackgroundColor', v)} />
          <ColorField id="text-stroke" label="Stroke" value={obj.stroke || '#000000'} onChange={(v) => set('stroke', v)} />
          <SliderField id="text-sw" label="Stroke width" min={0} max={12} value={obj.strokeWidth || 0} onChange={(v) => set('strokeWidth', v)} />
          <SliderField id="text-ls" label="Letter spacing" min={-50} max={200} value={obj.charSpacing || 0} onChange={(v) => set('charSpacing', v)} />
          <SliderField id="text-lh" label="Line height" min={50} max={250} value={Math.round((obj.lineHeight || 1.16) * 100)} onChange={(v) => set('lineHeight', v / 100)} />
          <SliderField id="text-op" label="Opacity" min={0} max={100} value={Math.round((obj.opacity ?? 1) * 100)} onChange={(v) => set('opacity', v / 100)} />
        </>
      )}
      <p className="text-[11px] text-text-tertiary mt-2 mb-0">Text stays editable until export.</p>
    </div>
  );
}
