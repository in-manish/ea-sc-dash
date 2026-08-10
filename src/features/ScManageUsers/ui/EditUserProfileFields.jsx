/** Work + location fields for SC admin user edit. */
export default function EditUserProfileFields({ values, onChange }) {
  const field = (id, label, name, opts = {}) => (
    <div className={`input-group ${opts.className || ''}`}>
      <label className="input-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={opts.type || 'text'}
        name={name}
        value={values[name] ?? ''}
        onChange={onChange}
        className="input-field"
        placeholder={opts.placeholder}
        readOnly={opts.readOnly}
        disabled={opts.readOnly}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('edit-designation', 'Designation', 'designation')}
        {field('edit-company', 'Company', 'company')}
      </div>

      {field('edit-company-address', 'Company address', 'company_address')}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {field('edit-city', 'City', 'city')}
        {field('edit-state', 'State', 'state')}
        {field('edit-zipcode', 'Zipcode', 'zipcode')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {field('edit-country', 'Country', 'country')}
        {field('edit-country-name', 'Country name', 'country_name', { placeholder: 'e.g. IN' })}
        {field('edit-country-code', 'Country code', 'country_code', { placeholder: 'e.g. 91' })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('edit-role', 'Role', 'role', { readOnly: true })}
      </div>
    </div>
  );
}
