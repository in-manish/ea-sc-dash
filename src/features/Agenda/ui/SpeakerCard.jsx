import React from 'react';
import { Image as ImageIcon, Mail, Trash2, Upload } from 'lucide-react';

const SpeakerCard = ({ speaker, index, onChange, onRemove, onPickImage, showSortOrder }) => (
  <div className="bg-bg-primary border border-border rounded-2xl p-5 space-y-4 relative group">
    <button
      type="button"
      className="absolute top-3 right-3 text-text-tertiary hover:text-danger p-1.5 rounded-lg"
      onClick={() => onRemove(index)}
    >
      <Trash2 size={16} />
    </button>

    <div className="flex items-center gap-4">
      <button
        type="button"
        className="relative w-16 h-16 rounded-xl bg-bg-secondary overflow-hidden border-2 border-border shrink-0 group/avatar"
        onClick={() => onPickImage(index)}
      >
        {speaker.speaker_image_preview || speaker.speaker_image ? (
          <img src={speaker.speaker_image_preview || speaker.speaker_image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <ImageIcon size={22} />
          </div>
        )}
        <div className="absolute inset-0 bg-accent/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
          <Upload className="text-white" size={18} />
        </div>
      </button>
      <div className="flex-1 space-y-2 min-w-0 pr-6">
        <input
          type="text"
          className="w-full bg-transparent border-b border-border focus:border-accent text-sm font-black focus:outline-none pb-1"
          placeholder="Speaker name"
          value={speaker.speaker_name || ''}
          onChange={(e) => onChange(index, 'speaker_name', e.target.value)}
        />
        <input
          type="text"
          className="w-full bg-transparent border-b border-border focus:border-accent text-[10px] font-bold uppercase tracking-widest focus:outline-none pb-1"
          placeholder="Designation"
          value={speaker.speaker_designation || ''}
          onChange={(e) => onChange(index, 'speaker_designation', e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3">
      <input
        type="text"
        className="w-full bg-bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-accent"
        placeholder="Company"
        value={speaker.speaker_company || ''}
        onChange={(e) => onChange(index, 'speaker_company', e.target.value)}
      />
      <div className="relative">
        <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="email"
          className="w-full pl-8 bg-bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-accent"
          placeholder="Email"
          value={speaker.speaker_email || ''}
          onChange={(e) => onChange(index, 'speaker_email', e.target.value)}
        />
      </div>
      {showSortOrder && (
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">
            Sorting key
          </label>
          <input
            type="number"
            min={1}
            className="w-full bg-bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-accent"
            placeholder="e.g. 1"
            title="Lower numbers appear first when A–Z sort is off"
            value={speaker.speaker_sort_order ?? ''}
            onChange={(e) => onChange(index, 'speaker_sort_order', Number(e.target.value) || 0)}
          />
          <p className="text-[10px] text-text-tertiary font-medium px-0.5">
            Lower number = earlier in the list
          </p>
        </div>
      )}
      <textarea
        className="w-full bg-bg-secondary/50 border border-border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-accent"
        rows={2}
        placeholder="Profile / bio"
        value={speaker.speaker_profile || ''}
        onChange={(e) => onChange(index, 'speaker_profile', e.target.value)}
      />
    </div>
  </div>
);

export default SpeakerCard;
