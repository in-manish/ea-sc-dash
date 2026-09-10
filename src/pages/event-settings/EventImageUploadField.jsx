import React, { useEffect, useMemo, useState } from 'react';
import { Play, X } from 'lucide-react';
import { FormField } from './components/SharedComponents';
import EventImageMetaHints from './EventImageMetaHints';

const EventImageUploadField = ({
  label,
  description,
  name,
  kind,
  eventData,
  onPickFile,
  onEdit,
  onClear,
  isFieldModified,
  posterUrl,
  editorConfig,
}) => {
  const value = eventData[name];
  const isFile = value instanceof File;
  const stringUrl = typeof value === 'string' ? value : '';
  const inputId = `media-field-${name}`;

  const previewUrl = useMemo(
    () => (isFile ? URL.createObjectURL(value) : stringUrl),
    [isFile, value, stringUrl]
  );
  useEffect(() => {
    if (!isFile) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [isFile, previewUrl]);

  const modified = isFieldModified(name);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const isVideo = kind === 'video';

  const handleEdit = async () => {
    if (!onEdit || editing) return;
    setEditing(true);
    try {
      await onEdit();
    } finally {
      setEditing(false);
    }
  };

  return (
    <FormField label={label} description={description}>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div
          className={`relative flex items-center justify-center w-32 h-20 rounded-lg border border-border bg-bg-secondary overflow-hidden shrink-0 ${isVideo && previewUrl ? 'group cursor-pointer' : ''}`}
          onClick={() => {
            if (isVideo && previewUrl) setIsPlayerOpen(true);
          }}
        >
          {previewUrl ? (
            isVideo ? (
              <>
                <video src={previewUrl} poster={posterUrl || undefined} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 text-black shadow group-hover:scale-110 transition-transform">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </span>
                </div>
              </>
            ) : (
              <img src={previewUrl} alt="" className="w-full h-full object-contain" />
            )
          ) : (
            <span className="text-[10px] text-text-tertiary px-2 text-center">No {kind}</span>
          )}
        </div>

        <div className="flex-1 w-full min-w-0 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              id={inputId}
              type="file"
              accept={isVideo ? 'video/*' : 'image/*'}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onPickFile(name, file, kind);
                e.target.value = '';
              }}
            />
            <label
              htmlFor={inputId}
              className={`btn btn-secondary text-xs cursor-pointer ${modified ? 'border-amber-500 text-amber-700' : ''}`}
            >
              {value ? `Replace ${kind}` : `Upload ${kind}`}
            </label>
            {!isVideo && value && onEdit ? (
              <button
                type="button"
                onClick={handleEdit}
                disabled={editing}
                className="btn btn-secondary text-xs disabled:opacity-60"
              >
                {editing ? 'Opening…' : 'Edit image'}
              </button>
            ) : null}
            {value ? (
              <button type="button" onClick={() => onClear(name)} className="text-xs text-red-600 hover:underline">
                Clear
              </button>
            ) : null}
            {modified ? (
              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded">
                Modified
              </span>
            ) : null}
          </div>
          {stringUrl ? (
            <p className="text-[10px] text-text-tertiary truncate max-w-full break-all">{stringUrl}</p>
          ) : null}
          {isFile ? (
            <p className="text-[10px] text-text-tertiary truncate">{value.name} (new upload, saved on submit)</p>
          ) : null}
          <EventImageMetaHints
            value={value}
            kind={kind}
            recommended={editorConfig?.recommended}
          />
        </div>
      </div>

      {isVideo && isPlayerOpen && previewUrl ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-text-primary/40 backdrop-blur-md animate-backdrop-smooth"
            onClick={() => setIsPlayerOpen(false)}
          />
          <div className="relative bg-bg-primary rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-modal-smooth resize overflow-auto min-w-[320px] min-h-[220px]">
            <button
              type="button"
              onClick={() => setIsPlayerOpen(false)}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close video"
            >
              <X size={16} />
            </button>
            <video
              src={previewUrl}
              poster={posterUrl || undefined}
              className="w-full h-full max-h-[80vh] bg-black"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      ) : null}
    </FormField>
  );
};

export default EventImageUploadField;
