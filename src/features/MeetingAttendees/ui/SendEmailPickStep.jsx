import { useState } from 'react';
import { MAX_COMPANY_CHOICES } from '../constants';
import { templatesByAttendeeType } from '../domain/meetingTemplates';
import TemplateModeSwitch from './TemplateModeSwitch';
import TemplatePicker from './TemplatePicker';
import TemplatePreview from './TemplatePreview';
import TypeTemplateStatus from './TypeTemplateStatus';

export default function SendEmailPickStep({
  types,
  templates,
  loading,
  loadError,
  choices,
  onPickTemplate,
  mode,
  onMode,
  onPickCommon,
  maxCompanies,
  onMaxCompanies,
  onCreateTemplate,
}) {
  const [pickedActiveId, setActiveId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  if (loading) return <p className="text-sm text-text-secondary m-0">Loading templates…</p>;
  if (loadError) return <p className="text-sm text-red-600 m-0">{loadError}</p>;

  // The attendee types may still be loading when the dialog opens, so fall back to the first one.
  const activeId = types.some((type) => type.id === pickedActiveId) ? pickedActiveId : types[0]?.id;
  const own = templatesByAttendeeType(types, templates);
  const common = mode === 'common';
  const selectedId = choices[activeId] || '';
  const previewId = hoverId || selectedId;
  const previewTemplate = templates.find((item) => String(item.id) === String(previewId));

  return (
    <div className="flex flex-col gap-4">
      {types.length > 1 && <TemplateModeSwitch mode={mode} onChange={onMode} />}
      <p className="text-sm text-text-secondary m-0">
        {common
          ? 'Pick one template. It is sent to every selected attendee type.'
          : 'Each attendee type needs a meeting email template. A template made for the type is selected for you. You can pick another.'}
      </p>
      {!common && <TypeTemplateStatus types={types} ownTemplates={own} choices={choices} activeId={activeId} onActive={setActiveId} onCreate={onCreateTemplate} />}
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4">
          <TemplatePicker
            templates={templates}
            selectedId={selectedId}
            recommendedId={common ? undefined : own[activeId]?.id}
            onSelect={(id) => (common ? onPickCommon(String(id)) : onPickTemplate(activeId, String(id)))}
            onHover={setHoverId}
            onLeave={() => setHoverId(null)}
          />
          <TemplatePreview template={previewTemplate} />
        </div>
      ) : (
        <p className="text-sm text-text-secondary m-0">No meeting templates for this event yet. Use “Create template” above.</p>
      )}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-primary">Company names shown in the email body</span>
        <div className="flex gap-2">
          {MAX_COMPANY_CHOICES.map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => onMaxCompanies(count)}
              className={`py-1.5 px-4 border rounded-full text-xs font-medium ${
                maxCompanies === count ? 'bg-accent text-white border-accent' : 'bg-bg-primary border-border text-text-secondary'
              }`}
            >
              Up to {count}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-tertiary m-0">With no requesting companies, this part is left out of the email.</p>
      </div>
    </div>
  );
}
