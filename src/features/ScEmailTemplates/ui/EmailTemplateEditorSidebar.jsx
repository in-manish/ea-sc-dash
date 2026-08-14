import { EMAIL_TEMPLATE_AUDIENCES, EMAIL_TEMPLATE_TYPES } from '../constants';
import { appendTemplateVariable } from '../domain/contentVariables';
import { eventFilterId, formatAudience, formatEventId, formatFromName } from '../domain/emailTemplateLabels';
import EmailTemplateVariableChips from './EmailTemplateVariableChips';

export default function EmailTemplateEditorSidebar({
  isEditing,
  form,
  fieldErrors,
  dropdowns,
  eventListId,
  onPatch,
}) {
  const audiences = unique([...EMAIL_TEMPLATE_AUDIENCES, ...(dropdowns.audience || [])]);
  const types = unique([...EMAIL_TEMPLATE_TYPES, ...(dropdowns.template_type || [])]);
  const events = dropdowns.event || [];
  const variables = Array.isArray(form.content_variables) ? form.content_variables : [];

  return (
    <aside className="w-[300px] border-r border-border bg-bg-secondary/40 p-6 flex-col gap-5 overflow-y-auto hidden lg:flex shrink-0">
      <Field label="Title" error={fieldErrors.title} required>
        {isEditing ? (
          <input className="input-field" maxLength={255} value={form.title} onChange={(e) => onPatch({ title: e.target.value })} placeholder="OTM 2026 Exhibitor Reset" />
        ) : (
          <ReadValue>{form.title || '—'}</ReadValue>
        )}
      </Field>
      <Field label="Subject" error={fieldErrors.subject} required>
        {isEditing ? (
          <input className="input-field" value={form.subject} onChange={(e) => onPatch({ subject: e.target.value })} placeholder="Your {{ event_name }} meeting diary password" />
        ) : (
          <ReadValue>{form.subject || '—'}</ReadValue>
        )}
      </Field>
      <Field label="Template type" error={fieldErrors.template_type} required>
        {isEditing ? (
          <>
            <input
              className="input-field"
              list={`${eventListId}-types`}
              value={form.template_type}
              onChange={(e) => onPatch({ template_type: e.target.value })}
              placeholder="PASSWORD_RESET or custom type"
            />
            <datalist id={`${eventListId}-types`}>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
            </datalist>
          </>
        ) : (
          <ReadValue>{form.template_type || '—'}</ReadValue>
        )}
      </Field>
      <Field label="Audience" error={fieldErrors.audience}>
        {isEditing ? (
          <>
            <input
              className="input-field"
              list={`${eventListId}-audiences`}
              value={form.audience}
              onChange={(e) => onPatch({ audience: e.target.value })}
              placeholder="Default, visitor, non_visitor, or custom slug"
            />
            <datalist id={`${eventListId}-audiences`}>
              {audiences.map((aud) => <option key={aud} value={aud}>{aud}</option>)}
            </datalist>
            <p className="text-[10px] text-text-tertiary mt-1">Empty = all. Exhibitor names use non_visitor; others visitor.</p>
          </>
        ) : (
          <ReadValue>{formatAudience(form.audience)}</ReadValue>
        )}
      </Field>
      <Field label="Event" error={fieldErrors.event_id}>
        {isEditing ? (
          <>
            <input className="input-field" type="number" min={1} list={eventListId} value={form.event_id} onChange={(e) => onPatch({ event_id: e.target.value })} placeholder="Empty = all events" />
            <datalist id={eventListId}>
              {events.map((ev) => {
                const id = eventFilterId(ev);
                return <option key={id} value={id}>{`#${id}`}</option>;
              })}
            </datalist>
          </>
        ) : (
          <ReadValue>{formatEventId(form.event_id)}</ReadValue>
        )}
      </Field>
      <Field label="From name" error={fieldErrors.from_sender_name}>
        {isEditing ? (
          <>
            <input
              className="input-field"
              list={`${eventListId}-from-names`}
              value={form.from_sender_name}
              onChange={(e) => onPatch({ from_sender_name: e.target.value })}
              placeholder="Empty = settings default"
            />
            <datalist id={`${eventListId}-from-names`}>
              {(dropdowns.from_sender_name || []).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </datalist>
          </>
        ) : (
          <ReadValue>{formatFromName(form.from_sender_name)}</ReadValue>
        )}
      </Field>
      <Field label="Active" error={fieldErrors.is_active}>
        {isEditing ? (
          <label className="relative inline-flex items-center cursor-pointer gap-3 min-h-[38px]">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.is_active !== false}
              onChange={(e) => onPatch({ is_active: e.target.checked })}
            />
            <div className="relative w-11 h-6 bg-bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-bg-primary after:border after:border-border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
            <span className="text-xs font-medium text-text-secondary">{form.is_active ? 'Active' : 'Archived'}</span>
          </label>
        ) : (
          <ReadValue>{form.is_active ? 'Active' : 'Archived'}</ReadValue>
        )}
      </Field>
      {isEditing ? (
        <EmailTemplateVariableChips
          variables={variables}
          error={fieldErrors.content_variables}
          onChange={(content_variables) => onPatch({ content_variables })}
          onInsert={(name) => onPatch({ content: appendTemplateVariable(form.content, name) })}
        />
      ) : null}
    </aside>
  );
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function Field({ label, error, required, children }) {
  return (
    <div className="input-group">
      <label className="input-label">
        {label}{required ? <span className="text-danger"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-danger mt-1">{error}</p> : null}
    </div>
  );
}

function ReadValue({ children }) {
  return (
    <div className="text-sm font-medium text-text-primary bg-bg-primary p-3 rounded-xl border border-border">
      {children}
    </div>
  );
}
