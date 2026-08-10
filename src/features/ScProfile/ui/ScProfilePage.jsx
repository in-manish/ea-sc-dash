import { useEffect, useState } from 'react';
import { Building2, Loader2, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchAdminUser } from '../../ScManageUsers/api/adminUsersApi';
import { getScUserRole } from '../../ScAuth/domain/scLoginUser';

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

/** Logged-in SC ADMIN profile — read-only details. */
export default function ScProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [error, setError] = useState('');

  useEffect(() => {
    const role = getScUserRole(user);
    const canRefresh = role === 'ADMIN' || role === 'STAFF';
    if (!user?.id || !token || !canRefresh) {
      setProfile(user);
      setLoading(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAdminUser(token, user.id);
        if (!cancelled) setProfile({ ...user, ...data });
      } catch (err) {
        if (!cancelled) {
          setProfile(user);
          setError(err.message || 'Could not refresh profile.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, token]);

  if (!user) return null;

  const p = profile || user;
  const phone = p.phone_number
    ? `${p.country_code ? `+${String(p.country_code).replace(/^\+/, '')} ` : ''}${p.phone_number}`
    : '';
  const initials = (p.name || p.email || 'A')
    .split(/\s+/)
    .map((x) => x[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-[1000px] mx-auto animate-fade-in">
      <div className="mb-8 border-b border-border pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-accent text-accent-text rounded-md flex items-center justify-center text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">{p.name || p.username || 'Profile'}</h1>
            <div className="flex flex-wrap gap-2 items-center">
              {p.id != null && (
                <span className="inline-flex py-1 px-2.5 rounded-full text-xs font-semibold font-mono bg-bg-tertiary border border-border">#{p.id}</span>
              )}
              <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck size={12} /> {p.role || 'ADMIN'}
              </span>
            </div>
          </div>
        </div>
        {loading && <Loader2 size={18} className="animate-spin text-accent" />}
      </div>

      {error && (
        <div className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
          {error} Showing signed-in session details.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card icon={Mail} title="Contact">
          <Field label="Email">{p.email}</Field>
          <Field label="Phone">{phone}</Field>
          <Field label="Email verified">{p.is_verified_email === true ? 'Yes' : 'No'}</Field>
          <Field label="Phone verified">{p.is_verified_phone_number === true ? 'Yes' : 'No'}</Field>
        </Card>
        <Card icon={Building2} title="Organization">
          <Field label="Company">{p.company}</Field>
          <Field label="Designation">{p.designation}</Field>
          <Field label="Company address">{p.company_address}</Field>
        </Card>
        <Card icon={MapPin} title="Location">
          <Field label="City">{p.city}</Field>
          <Field label="State">{p.state}</Field>
          <Field label="Country">{p.country}</Field>
          <Field label="Zipcode">{p.zipcode}</Field>
        </Card>
        <Card icon={Phone} title="Account">
          <Field label="User ID">{p.id != null ? <span className="font-mono text-sm">{p.id}</span> : null}</Field>
          <Field label="Role">{p.role}</Field>
          <Field label="Country code">{p.country_code}</Field>
        </Card>
      </div>
    </div>
  );
}
