import { TOOLS } from '../../constants';
import { useCanvasEditor } from '../../hooks/editorContext';
import ColorField from '../ColorField';

export default function RedactPanel() {
  const { setTool, redactColor, setRedactColor } = useCanvasEditor();
  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary m-0 mb-3">Redaction</h3>
      <p className="text-xs text-text-secondary mt-0 mb-3">
        Drag a region over names, phones, emails, or IDs. Processing stays in the browser.
      </p>
      <div className="grid grid-cols-2 gap-1 mb-3">
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => setTool(TOOLS.redact)}>Black box</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => setTool(TOOLS.blurRegion)}>Blur</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => setTool(TOOLS.pixelateRegion)}>Pixelate</button>
        <button type="button" className="btn btn-secondary text-[11px] py-1.5" onClick={() => setTool(TOOLS.mosaic)}>Mosaic</button>
      </div>
      <ColorField id="redact-color" label="Custom color" value={redactColor} onChange={setRedactColor} />
    </div>
  );
}
