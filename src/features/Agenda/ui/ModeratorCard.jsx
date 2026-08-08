import React from 'react';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';

const ModeratorCard = ({ moderator, index, onChange, onRemove, onPickImage }) => (
  <div className="bg-bg-primary border border-border rounded-2xl p-5 space-y-4 relative">
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
        {moderator.moderator_image_preview || moderator.moderator_image ? (
          <img
            src={moderator.moderator_image_preview || moderator.moderator_image}
            alt=""
            className="w-full h-full object-cover"
          />
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
          placeholder="Moderator name"
          value={moderator.moderator_name || ''}
          onChange={(e) => onChange(index, 'moderator_name', e.target.value)}
        />
        <input
          type="text"
          className="w-full bg-transparent border-b border-border focus:border-accent text-[10px] font-bold uppercase tracking-widest focus:outline-none pb-1"
          placeholder="Designation"
          value={moderator.moderator_designation || ''}
          onChange={(e) => onChange(index, 'moderator_designation', e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3">
      <input
        type="text"
        className="w-full bg-bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-accent"
        placeholder="Company"
        value={moderator.moderator_company || ''}
        onChange={(e) => onChange(index, 'moderator_company', e.target.value)}
      />
      <textarea
        className="w-full bg-bg-secondary/50 border border-border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-accent"
        rows={2}
        placeholder="Profile / bio"
        value={moderator.moderator_profile || ''}
        onChange={(e) => onChange(index, 'moderator_profile', e.target.value)}
      />
    </div>
  </div>
);

export default ModeratorCard;
