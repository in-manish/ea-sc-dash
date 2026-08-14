const inputClass = (hasError) =>
  `w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors bg-transparent ${
    hasError
      ? 'border-red-500 focus:ring-1 focus:ring-red-500/20'
      : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/20'
  }`;

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-status-danger mt-1">{message}</p> : null;

const EditAttendeeRegFields = ({
  form,
  setField,
  fieldErrors = {},
  attendeeTypes = [],
  typesLoading = false,
}) => {
  const isExhibitor =
    String(form.attendee_type || '').trim().toLowerCase() === 'exhibitor';
  const typeInList = attendeeTypes.some(
    (t) => String(t.name || '') === String(form.attendee_type || ''),
  );

  return (
    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border pb-2">
        Registration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">
            Attendee type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.attendee_type}
            onChange={(e) => setField('attendee_type', e.target.value)}
            disabled={typesLoading}
            className={inputClass(fieldErrors.attendee_type)}
          >
            <option value="">Select type</option>
            {form.attendee_type && !typeInList && (
              <option value={form.attendee_type}>{form.attendee_type}</option>
            )}
            {attendeeTypes.map((t) => (
              <option key={t.id || t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.attendee_type} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Reg type</label>
          <select
            value={form.reg_type}
            onChange={(e) => setField('reg_type', e.target.value)}
            className={inputClass(fieldErrors.reg_type)}
          >
            <option value="ON_SPOT">ON_SPOT</option>
            <option value="PRE_REG">PRE_REG</option>
          </select>
        </div>
        {isExhibitor && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-secondary">
              Exhibitor ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.exhibitor_id}
              onChange={(e) =>
                setField('exhibitor_id', e.target.value.replace(/\D/g, ''))
              }
              className={inputClass(fieldErrors.exhibitor_id)}
            />
            <FieldError message={fieldErrors.exhibitor_id} />
          </div>
        )}
        <div className="space-y-1">
          <label className="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer pt-7">
            <input
              type="checkbox"
              checked={Boolean(form.is_meeting_enabled)}
              onChange={(e) => setField('is_meeting_enabled', e.target.checked)}
              className="w-4 h-4 accent-accent"
            />
            Meeting enabled
          </label>
          <FieldError message={fieldErrors.is_meeting_enabled} />
        </div>
      </div>
    </section>
  );
};

export default EditAttendeeRegFields;
