import React from 'react';
import { Info, Plus, Users } from 'lucide-react';
import SpeakerCard from './SpeakerCard';

const SORT_HELP =
  'On: speakers list A–Z by name. Off: use each speaker’s Sorting key (lower numbers appear first).';

const SpeakerRosterSection = ({
  speakers,
  alphaSort,
  onToggleAlphaSort,
  onAdd,
  onChange,
  onRemove,
  onPickImage,
}) => (
  <section className="space-y-5">
    <div className="bg-accent py-4 px-6 rounded-2xl flex flex-wrap justify-between items-center gap-4 text-white">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white/10">
          <Users size={18} />
        </div>
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Speakers</h3>
          <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">Session contributors</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 px-3 py-2 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            className="accent-white"
            checked={alphaSort}
            onChange={(e) => onToggleAlphaSort(e.target.checked)}
          />
          A–Z sort
        </label>
        <span className="relative group/info inline-flex">
          <button
            type="button"
            className="p-2 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="How speaker sorting works"
          >
            <Info size={16} />
          </button>
          <span className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-64 rounded-xl bg-text-primary px-3 py-2.5 text-[10px] font-medium leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover/info:opacity-100 group-focus-within/info:opacity-100">
            {SORT_HELP}
          </span>
        </span>
        <button
          type="button"
          className="bg-white text-accent px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest"
          onClick={onAdd}
        >
          <Plus size={14} className="inline mr-1" /> Add
        </button>
      </div>
    </div>

    {!alphaSort && (
      <p className="text-[11px] text-text-secondary font-medium px-1">
        Custom order is on — set a <span className="font-black text-text-primary">Sorting key</span> on each
        speaker (1 first, then 2, 3…). Hover the info icon for details.
      </p>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {speakers.map((s, idx) => (
        <SpeakerCard
          key={idx}
          speaker={s}
          index={idx}
          showSortOrder={!alphaSort}
          onChange={(i, field, value) => onChange('speaker', i, field, value)}
          onRemove={(i) => onRemove('speaker', i)}
          onPickImage={(i) => onPickImage('speaker', i)}
        />
      ))}
      {speakers.length === 0 && (
        <p className="text-sm text-text-tertiary col-span-full py-6 text-center">No speakers yet.</p>
      )}
    </div>
  </section>
);

export default SpeakerRosterSection;
