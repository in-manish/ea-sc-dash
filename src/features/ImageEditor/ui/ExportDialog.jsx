import { useState } from 'react';
import { EXPORT_FORMATS } from '../domain/exportFormats';
import { useCanvasEditor } from '../hooks/editorContext';

export default function ExportDialog() {
  const { exporter, session } = useCanvasEditor();
  const [filename, setFilename] = useState(
    (session.meta.fileName || 'edited-image').replace(/\.[a-z0-9]+$/i, ''),
  );
  const [formatId, setFormatId] = useState('png');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(session.meta.width || 0);

  if (!exporter.open) return null;
  const format = EXPORT_FORMATS.find((item) => item.id === formatId);
  const supported = exporter.support[formatId];
  const height = session.meta.width
    ? Math.round((session.meta.height / session.meta.width) * (width || session.meta.width))
    : session.meta.height;

  return (
    <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="ie-export-title">
      <div className="bg-bg-primary border border-border rounded-lg shadow-md w-full max-w-md p-5">
        <h2 id="ie-export-title" className="text-base font-semibold m-0 mb-1">Export image</h2>
        <p className="text-xs text-text-secondary mt-0 mb-4">Flattened copy only. The original file is unchanged.</p>
        <label className="text-xs text-text-secondary block mb-3">
          Filename
          <input className="input-field mt-1 py-2 text-sm" value={filename} onChange={(e) => setFilename(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {EXPORT_FORMATS.map((item) => {
            const ok = exporter.support[item.id];
            return (
              <button
                key={item.id}
                type="button"
                disabled={!ok}
                className={`btn text-xs py-1.5 ${formatId === item.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFormatId(item.id)}
                title={ok ? item.label : `${item.label} is not supported in this browser`}
              >
                {item.label}{!ok ? ' (n/a)' : ''}
              </button>
            );
          })}
        </div>
        {format?.hasQuality ? (
          <label className="text-xs text-text-secondary block mb-3">
            Quality {quality}%
            <input className="ie-range w-full mt-1" type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
          </label>
        ) : null}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <label className="text-xs text-text-secondary">
            Width
            <input className="input-field py-1 text-xs mt-1" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          </label>
          <label className="text-xs text-text-secondary">
            Height
            <input className="input-field py-1 text-xs mt-1" type="number" value={height} readOnly />
          </label>
        </div>
        <label className="text-xs text-text-secondary block mb-4">
          Scale
          <select className="input-field py-1.5 text-xs mt-1" value={scale} onChange={(e) => setScale(Number(e.target.value))}>
            {[0.5, 1, 1.5, 2].map((n) => <option key={n} value={n}>{n}×</option>)}
          </select>
        </label>
        {formatId !== 'jpeg' ? (
          <p className="text-[11px] text-text-tertiary mt-0 mb-3">
            PNG, WebP, and AVIF keep transparency when the canvas background is transparent.
            {formatId === 'avif' ? ' AVIF is encoded locally (browsers can display AVIF without being able to write it from a canvas).' : ''}
          </p>
        ) : null}
        {!supported ? <p className="text-xs text-status-danger">This format is not available here.</p> : null}
        <div className="flex flex-wrap gap-2 justify-end">
          <button type="button" className="btn btn-ghost text-xs" onClick={() => exporter.setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-secondary text-xs" onClick={() => exporter.copyImage({ formatId: 'png', filename, width, scale, quality })}>
            Copy image
          </button>
          <button type="button" className="btn btn-primary text-xs" disabled={!supported} onClick={() => exporter.download({ formatId, filename, width, scale, quality, height })}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
