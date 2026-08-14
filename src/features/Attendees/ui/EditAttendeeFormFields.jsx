import EditAttendeeRegFields from './EditAttendeeRegFields';

const inputClass = (hasError) =>
  `w-full px-3 py-2 border rounded-md text-sm outline-none transition-colors bg-transparent ${
    hasError
      ? 'border-red-500 focus:ring-1 focus:ring-red-500/20'
      : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/20'
  }`;

const FieldError = ({ message }) =>
  message ? <p className="text-xs text-status-danger mt-1">{message}</p> : null;

const EditAttendeeFormFields = ({
  form,
  setField,
  fieldErrors = {},
  attendeeTypes = [],
  typesLoading = false,
}) => (
  <div className="space-y-6">
    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border pb-2">
        Identity
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={100}
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            className={inputClass(fieldErrors.name)}
          />
          <FieldError message={fieldErrors.name} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            className={inputClass(fieldErrors.email)}
          />
          <FieldError message={fieldErrors.email} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Country code</label>
          <input
            type="text"
            maxLength={4}
            value={form.country_code}
            onChange={(e) => setField('country_code', e.target.value.replace(/\D/g, ''))}
            className={inputClass(fieldErrors.country_code)}
            placeholder="91"
          />
          <FieldError message={fieldErrors.country_code} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Phone</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.phone_number}
            onChange={(e) => setField('phone_number', e.target.value.replace(/\D/g, ''))}
            className={inputClass(fieldErrors.phone_number)}
            placeholder="10 digits or blank"
          />
          <FieldError message={fieldErrors.phone_number} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Designation</label>
          <input
            type="text"
            value={form.designation}
            onChange={(e) => setField('designation', e.target.value)}
            className={inputClass(fieldErrors.designation)}
          />
          <FieldError message={fieldErrors.designation} />
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-xs uppercase tracking-wider text-text-tertiary font-bold border-b border-border pb-2">
        Company & location
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setField('company', e.target.value)}
            className={inputClass(fieldErrors.company)}
          />
          <FieldError message={fieldErrors.company} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-text-secondary">Company address</label>
          <input
            type="text"
            value={form.company_address}
            onChange={(e) => setField('company_address', e.target.value)}
            className={inputClass(fieldErrors.company_address)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setField('city', e.target.value)}
            className={inputClass()}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">State</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => setField('state', e.target.value)}
            className={inputClass()}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Country</label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => setField('country', e.target.value)}
            className={inputClass()}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-text-secondary">Website</label>
          <input
            type="text"
            value={form.website}
            onChange={(e) => setField('website', e.target.value)}
            className={inputClass()}
          />
        </div>
      </div>
    </section>

    <EditAttendeeRegFields
      form={form}
      setField={setField}
      fieldErrors={fieldErrors}
      attendeeTypes={attendeeTypes}
      typesLoading={typesLoading}
    />
  </div>
);

export default EditAttendeeFormFields;
