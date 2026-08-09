import { Building2, LayoutDashboard, Mail, MapPin, Phone } from 'lucide-react';

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-text-secondary font-medium">{label}</label>
    <span className="text-[0.9375rem] text-text-primary break-words">{children || '-'}</span>
  </div>
);

const Card = ({ icon: Icon, title, children }) => (
  <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm">
    <h3 className="text-sm font-semibold uppercase text-text-tertiary mb-5 flex items-center gap-2 border-b border-border pb-3">
      <Icon size={18} /> {title}
    </h3>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

/** CompanyDetails-style 2×2 read-only info cards. */
export default function UserDetailsInfoGrid({ user }) {
  if (!user) return null;
  const phone = user.phone_number
    ? `${user.country_code ? `+${String(user.country_code).replace(/^\+/, '')} ` : ''}${user.phone_number}`
    : '';
  const location = [user.city, user.state, user.country].filter(Boolean).join(', ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card icon={Mail} title="Contact">
        <Field label="Email">{user.email}</Field>
        <Field label="Phone">{phone}</Field>
        <Field label="Email verified">{user.is_verified_email === true ? 'Yes' : 'No'}</Field>
        <Field label="Phone verified">{user.is_verified_phone_number === true ? 'Yes' : 'No'}</Field>
      </Card>

      <Card icon={Building2} title="Organization">
        <Field label="Company">{user.company}</Field>
        <Field label="Designation">{user.designation}</Field>
        <Field label="Company address">{user.company_address}</Field>
      </Card>

      <Card icon={MapPin} title="Location">
        <Field label="City">{user.city}</Field>
        <Field label="State">{user.state}</Field>
        <Field label="Country">{user.country}</Field>
        <Field label="Country name">{user.country_name}</Field>
        <Field label="Zipcode">{user.zipcode}</Field>
      </Card>

      <Card icon={LayoutDashboard} title="System Info">
        <Field label="User ID"><span className="font-mono text-sm">{user.id}</span></Field>
        <Field label="Role">{user.role}</Field>
        <Field label="Country code">{user.country_code}</Field>
      </Card>
    </div>
  );
}
