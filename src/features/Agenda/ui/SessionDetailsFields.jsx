import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const SessionDetailsFields = ({ formData, updateField }) => (
  <section className="space-y-5">
    <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-2xl border border-accent/10">
      <div className="p-2.5 rounded-lg bg-accent text-white">
        <Calendar size={18} />
      </div>
      <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.15em]">Session details</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Session title" className="md:col-span-2">
        <input
          type="text"
          required
          className={inputClass}
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter session title..."
        />
      </Field>

      <Field label="Venue / location">
        <div className="relative">
          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            className={`${inputClass} pl-10`}
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. Grand Ballroom"
          />
        </div>
      </Field>

      <Field label="Track">
        <input
          type="text"
          className={inputClass}
          value={formData.track_title}
          onChange={(e) => updateField('track_title', e.target.value)}
          placeholder="e.g. Main Track"
        />
      </Field>

      <Field label="Date">
        <input
          type="date"
          required
          className={inputClass}
          value={formData.date}
          onChange={(e) => updateField('date', e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start">
          <input
            type="time"
            required
            className={inputClass}
            value={formData.start}
            onChange={(e) => updateField('start', e.target.value)}
          />
        </Field>
        <Field label="End">
          <input
            type="time"
            required
            className={inputClass}
            value={formData.end}
            onChange={(e) => updateField('end', e.target.value)}
          />
        </Field>
      </div>

      <Field label="Description" className="md:col-span-2">
        <textarea
          className={inputClass}
          rows={3}
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Session description..."
        />
      </Field>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Toggle
        label="Joinable session"
        checked={formData.enrollable}
        onChange={(v) => updateField('enrollable', v)}
      />
      <Toggle
        label="Admin visibility only"
        checked={formData.admin}
        onChange={(v) => updateField('admin', v)}
      />
      <Toggle
        label="Force attendance"
        hint="Block slot — this will not allow setting meetings"
        checked={formData.force_attendance}
        onChange={(v) => updateField('force_attendance', v)}
      />
    </div>
  </section>
);

const inputClass =
  'w-full px-4 py-3 bg-bg-secondary/50 border border-border rounded-xl text-xs font-bold focus:outline-none focus:border-accent focus:bg-white transition-all';

function Field({ label, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[9px] font-black uppercase text-text-tertiary tracking-[0.2em] ml-0.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 p-3.5 bg-bg-secondary/50 rounded-xl border border-border cursor-pointer">
      <span className="min-w-0">
        <span className="block text-[9px] font-black uppercase tracking-widest text-text-secondary">
          {label}
        </span>
        {hint ? (
          <span className="block text-[10px] font-medium text-text-tertiary mt-0.5 leading-snug">
            {hint}
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        className="w-4 h-4 rounded-md accent-accent cursor-pointer shrink-0"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default SessionDetailsFields;
