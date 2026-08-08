import React from 'react';
import { Mic2, Plus } from 'lucide-react';
import ModeratorCard from './ModeratorCard';

const ModeratorRosterSection = ({
  moderators,
  onAdd,
  onChange,
  onRemove,
  onPickImage,
}) => (
  <section className="space-y-5">
    <div className="bg-bg-secondary border border-border py-4 px-6 rounded-2xl flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
          <Mic2 size={18} />
        </div>
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">Moderators</h3>
          <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-widest">Always sorted A–Z by name</p>
        </div>
      </div>
      <button
        type="button"
        className="bg-accent text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest"
        onClick={onAdd}
      >
        <Plus size={14} className="inline mr-1" /> Add
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {moderators.map((m, idx) => (
        <ModeratorCard
          key={idx}
          moderator={m}
          index={idx}
          onChange={(i, field, value) => onChange('moderator', i, field, value)}
          onRemove={(i) => onRemove('moderator', i)}
          onPickImage={(i) => onPickImage('moderator', i)}
        />
      ))}
      {moderators.length === 0 && (
        <p className="text-sm text-text-tertiary col-span-full py-6 text-center">No moderators yet.</p>
      )}
    </div>
  </section>
);

export default ModeratorRosterSection;
