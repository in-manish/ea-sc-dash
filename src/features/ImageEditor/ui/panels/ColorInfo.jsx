import { toColorParts } from '../../domain/colors';
import { useCanvasEditor } from '../../hooks/editorContext';

export default function ColorInfo() {
  const { styles } = useCanvasEditor();
  const parts = toColorParts(styles.style.color);
  return (
    <div className="text-[11px] text-text-secondary border border-border rounded-md p-2 mb-3">
      <div>HEX {parts.hex}</div>
      <div>RGB {parts.rgb}</div>
      <div>HSL {parts.hsl}</div>
      <p className="mb-0 mt-1 text-text-tertiary">Eyedropper colors apply to brush, shapes, text, and borders.</p>
    </div>
  );
}
