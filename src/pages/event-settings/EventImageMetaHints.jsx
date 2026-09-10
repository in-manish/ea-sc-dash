import React from 'react';
import { useImageFieldMeta } from './hooks/useImageFieldMeta';
import { buildImageFieldHints } from './domain/imageFieldHints';

const EventImageMetaHints = ({ value, kind, recommended }) => {
  const meta = useImageFieldMeta(value, kind);
  const hints = buildImageFieldHints(meta, recommended, kind);
  if (!value || !hints || hints.stats.length === 0) return null;

  const toneClass = hints.tone === 'ok'
    ? 'text-green-700 bg-green-50 border border-green-200'
    : 'text-amber-700 bg-amber-500/10';

  return (
    <div className="space-y-1">
      <p className="text-[11px] text-text-secondary tabular-nums m-0">{hints.stats.join(' · ')}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${toneClass}`}>
          {hints.headline}
        </span>
      </div>
      {hints.detail ? (
        <p className="text-[10px] text-text-tertiary leading-relaxed m-0">{hints.detail}</p>
      ) : null}
      {hints.mobileHint ? (
        <p className="text-[10px] text-text-tertiary m-0">{hints.mobileHint}</p>
      ) : null}
    </div>
  );
};

export default EventImageMetaHints;
